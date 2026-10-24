import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BleManager,
  Device,
  State as BluetoothState,
} from "react-native-ble-plx";

const manager = new BleManager();

export default function BluetoothScanner() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [bluetoothState, setBluetoothState] = useState("Unknown");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [message, setMessage] = useState(
    "Appuie sur « Scanner » pour rechercher les appareils."
  );

  const foundDevices = useRef(new Map<string, Device>());
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      setBluetoothState(state);

      if (state !== BluetoothState.PoweredOn) {
        setMessage("Active le Bluetooth sur ton téléphone.");
      }
    }, true);

    return () => {
      subscription.remove();

      if (scanTimeout.current) {
        clearTimeout(scanTimeout.current);
      }

      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  async function requestPermissions(): Promise<boolean> {
    if (Platform.OS !== "android") {
      return true;
    }

    if (Number(Platform.Version) >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      return (
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  async function startScan() {
    if (scanning) return;

    try {
      const permitted = await requestPermissions();

      if (!permitted) {
        setMessage("Les permissions Bluetooth ont été refusées.");
        return;
      }

      const state = await manager.state();

      if (state !== BluetoothState.PoweredOn) {
        setMessage(
          "Le Bluetooth est désactivé. Active-le puis relance le scan."
        );
        return;
      }

      foundDevices.current.clear();
      setDevices([]);
      setSelectedDevice(null);
      setScanning(true);
      setMessage("Recherche des appareils Bluetooth LE…");

      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          setMessage(`Erreur Bluetooth : ${error.message}`);
          setScanning(false);
          return;
        }

        if (device) {
          foundDevices.current.set(device.id, device);

          setDevices(
            Array.from(foundDevices.current.values()).sort(
              (a, b) => (b.rssi ?? -999) - (a.rssi ?? -999)
            )
          );
        }
      });

      scanTimeout.current = setTimeout(() => {
        manager.stopDeviceScan();
        setScanning(false);
        setMessage(
          foundDevices.current.size > 0
            ? `${foundDevices.current.size} appareil(s) détecté(s).`
            : "Aucun appareil détecté. Vérifie que les appareils sont allumés et diffusent en BLE."
        );
      }, 12000);
    } catch (error) {
      setScanning(false);
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible de démarrer le scan."
      );
    }
  }

  function stopScan() {
    if (scanTimeout.current) {
      clearTimeout(scanTimeout.current);
      scanTimeout.current = null;
    }

    manager.stopDeviceScan();
    setScanning(false);
    setMessage("Scan arrêté.");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth LE</Text>

      <Text style={styles.subtitle}>
        État du Bluetooth : {bluetoothState}
      </Text>

      <Pressable
        style={[styles.button, scanning && styles.stopButton]}
        onPress={scanning ? stopScan : startScan}
      >
        {scanning ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Scanner les appareils</Text>
        )}
      </Pressable>

      <Text style={styles.message}>{message}</Text>

      <Text style={styles.sectionTitle}>
        Appareils détectés ({devices.length})
      </Text>

      <ScrollView style={styles.list}>
        {devices.map((device) => (
          <Pressable
            key={device.id}
            style={[
              styles.device,
              selectedDevice?.id === device.id && styles.selectedDevice,
            ]}
            onPress={() => setSelectedDevice(device)}
          >
            <Text style={styles.deviceName}>
              {device.name || device.localName || "Appareil sans nom"}
            </Text>

            <Text style={styles.deviceId}>{device.id}</Text>

            <Text style={styles.deviceRssi}>
              RSSI : {device.rssi ?? "Inconnu"} dBm
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {selectedDevice && (
        <View style={styles.details}>
          <Text style={styles.sectionTitle}>Appareil sélectionné</Text>
          <Text style={styles.deviceName}>
            {selectedDevice.name ||
              selectedDevice.localName ||
              "Appareil sans nom"}
          </Text>
          <Text style={styles.deviceId}>{selectedDevice.id}</Text>
          <Text style={styles.message}>
            La sélection est enregistrée. La connexion n’est pas encore
            implémentée.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1120",
    padding: 20,
    paddingTop: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#AAB4C8",
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 50,
    justifyContent: "center",
  },
  stopButton: {
    backgroundColor: "#B91C1C",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    color: "#AAB4C8",
    fontSize: 14,
    marginTop: 14,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  list: {
    flex: 1,
  },
  device: {
    backgroundColor: "#172033",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#263247",
  },
  selectedDevice: {
    borderColor: "#3B82F6",
    backgroundColor: "#1D2B45",
  },
  deviceName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  deviceId: {
    color: "#AAB4C8",
    fontSize: 12,
    marginBottom: 5,
  },
  deviceRssi: {
    color: "#60A5FA",
    fontSize: 13,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: "#263247",
    paddingTop: 16,
    marginTop: 12,
  },
});
