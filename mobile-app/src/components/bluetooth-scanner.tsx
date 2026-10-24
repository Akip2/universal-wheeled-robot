import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BluetoothScanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth LE</Text>

      <Text style={styles.message}>
        Le scan Bluetooth LE n'est pas disponible dans la version Web.
      </Text>

      <Text style={styles.hint}>
        Lance l'application sur ton téléphone Android avec une version native
        compilée pour rechercher les appareils Bluetooth.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1120",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  message: {
    color: "#60A5FA",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  hint: {
    color: "#AAB4C8",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
});