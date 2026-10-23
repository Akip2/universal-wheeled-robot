import Joystick from "@/components/joystick";
import { View, Text, StyleSheet } from "react-native";

export default function Index() {
  const handleJoystickMove = (x: number, y: number) => {
    console.log("Joystick:", { x, y });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Control joystick</Text>

      <Joystick onMove={handleJoystickMove} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10151f",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 44,
  },
});