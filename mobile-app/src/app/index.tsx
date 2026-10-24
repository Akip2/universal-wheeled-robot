import { router } from "expo-router";
import { Pressable, Text, View, StyleSheet } from "react-native";
import Control from "./control";

export default function Index() {
  return (
    <View style={styles.container}>
      <Control />

      <Pressable
        style={styles.bluetoothButton}
        onPress={() => router.push("/bluetooth")}
      >
        <Text style={styles.buttonText}>
          Scanner les appareils Bluetooth
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1120",
  },
  bluetoothButton: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});