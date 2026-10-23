import { StyleSheet } from "react-native";

export const JOYSTICK_SIZE = 240;
export const KNOB_SIZE = 76;

export const joystickStyles = StyleSheet.create({
  joystick: {
    width: JOYSTICK_SIZE,
    height: JOYSTICK_SIZE,
    borderRadius: JOYSTICK_SIZE / 2,
    backgroundColor: "#1d2939",
    borderWidth: 2,
    borderColor: "#34445b",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  horizontalLine: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "#34445b",
  },

  verticalLine: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "#34445b",
  },

  knob: {
    position: "absolute",
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: "#3b82f6",
    borderWidth: 3,
    borderColor: "#93c5fd",
    elevation: 8,
  },

  values: {
    flexDirection: "row",
    gap: 32,
    marginTop: 36,
  },

  value: {
    color: "#e2e8f0",
    fontSize: 18,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});