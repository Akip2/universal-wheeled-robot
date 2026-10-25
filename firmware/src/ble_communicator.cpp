#include <NimBLEDevice.h>
#include <Arduino.h>

const char *SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const char* COMMAND_UUID = "beb5483e-1e6d-4a8f-8e5b-8b1a9f6c1001";
const char* DEVICE_NAME = "UWR_Robot";

volatile float joystickX = 0;
volatile float joystickY = 0;

class CommandCallbacks : public NimBLECharacteristicCallbacks {
    void onWrite(NimBLECharacteristic *characteristic, NimBLEConnInfo &connInfo) override {
        std::string value = characteristic->getValue();

        float x, y;

        Serial.println(value.c_str());
        if (sscanf(value.c_str(), "%f;%f", &x, &y) == 2)
        {
            joystickX = x;
            joystickY = y;
        }
    }
};

class ServerCallbacks : public NimBLEServerCallbacks {
  void onConnect(
    NimBLEServer* server,
    NimBLEConnInfo& connInfo
  ) override {
    Serial.println("Client BLE connecte");
  }

  void onDisconnect(
    NimBLEServer* server,
    NimBLEConnInfo& connInfo,
    int reason
  ) override {
    Serial.print("Client BLE deconnecte. Raison : ");
    Serial.println(reason);

    NimBLEDevice::startAdvertising();
  }
};


void setupBle() {
    NimBLEDevice::init("UWR_Robot");

    NimBLEServer* server = NimBLEDevice::createServer();
    server->setCallbacks(new ServerCallbacks());

    NimBLEService* service = server->createService(SERVICE_UUID);

    NimBLECharacteristic* command =
        service->createCharacteristic(
            COMMAND_UUID,
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_NR
        );

    command->setCallbacks(new CommandCallbacks());

    service->start();

    NimBLEAdvertising* advertising = NimBLEDevice::getAdvertising();

    // Autoriser une réponse au scan séparée
    advertising->enableScanResponse(true);

    // Nom court pour faciliter la détection
    advertising->setName("UWR_Robot");

    // UUID du service annoncé
    advertising->addServiceUUID(SERVICE_UUID);

    // Intervalle : 100 à 200 ms
    advertising->setMinInterval(160);
    advertising->setMaxInterval(320);

    if (advertising->start()) {
        Serial.println("Publicite BLE demarree : UWR_Robot");
    } else {
        Serial.println("ERREUR : impossible de demarrer la publicite BLE");
    }
}

int getJoystickX() {
    return joystickX;
}

int getJoystickY() {
    return joystickY;
}