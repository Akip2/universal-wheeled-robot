#include <NimBLEDevice.h>
#include <Arduino.h>

#define SERVICE_UUID \
    "4fafc201-1fb5-459e-8fcc-c5c9c331914b"

#define COMMAND_UUID \
    "beb5483e-1e6d-4a8f-8e5b-8b1a9f6c1001"

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

void setupBle() {
    NimBLEDevice::init("ESP32-Joystick");

    NimBLEServer *server = NimBLEDevice::createServer();

    NimBLEService *service = server->createService(SERVICE_UUID);

    NimBLECharacteristic *command =
        service->createCharacteristic(
            COMMAND_UUID,
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_NR
        );

    service->start();

    command->setCallbacks(new CommandCallbacks());

    NimBLEAdvertising *advertising =
        NimBLEDevice::getAdvertising();

    advertising->addServiceUUID(SERVICE_UUID);
    advertising->start();
}

int getJoystickX() {
    return joystickX;
}

int getJoystickY() {
    return joystickY;
}