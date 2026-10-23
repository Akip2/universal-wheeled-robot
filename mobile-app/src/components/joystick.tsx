import { useJoystick } from "../hooks/use-joystick";
import { View, Text } from "react-native";
import { joystickStyles as styles } from "./joystick-styles";

type JoystickProps = {
  onMove?: (x: number, y: number) => void;
};

export default function Joystick({ onMove }: JoystickProps) {
  const { position, axisX, axisY, panHandlers } =
    useJoystick({ onMove });

  return (
    <View style={{ alignItems: "center" }}>
      <View style={styles.joystick}>
        <View style={styles.horizontalLine} />
        <View style={styles.verticalLine} />

        <View
          {...panHandlers}
          style={[
            styles.knob,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
              ],
            },
          ]}
        />
      </View>

      <View style={styles.values}>
        <Text style={styles.value}>
          X : {axisX.toFixed(2)}
        </Text>

        <Text style={styles.value}>
          Y : {axisY.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}