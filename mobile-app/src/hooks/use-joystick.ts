import { useMemo, useState } from "react";
import { PanResponder } from "react-native";

const SIZE = 240;
const KNOB_SIZE = 76;
const RADIUS = (SIZE - KNOB_SIZE) / 2;

type JoystickPosition = {
  x: number;
  y: number;
};

type UseJoystickProps = {
  onMove?: (x: number, y: number) => void;
};

export function useJoystick({ onMove }: UseJoystickProps = {}) {
  const [position, setPosition] = useState<JoystickPosition>({
    x: 0,
    y: 0,
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderMove: (_, gesture) => {
          let x = gesture.dx;
          let y = gesture.dy;

          const distance = Math.hypot(x, y);

          if (distance > RADIUS) {
            x = (x / distance) * RADIUS;
            y = (y / distance) * RADIUS;
          }

          setPosition({ x, y });
          onMove?.(x / RADIUS, -y / RADIUS);
        },

        onPanResponderRelease: () => {
          setPosition({ x: 0, y: 0 });
          onMove?.(0, 0);
        },

        onPanResponderTerminate: () => {
          setPosition({ x: 0, y: 0 });
          onMove?.(0, 0);
        },
      }),
    [onMove],
  );

  return {
    position,
    axisX: position.x / RADIUS,
    axisY: -position.y / RADIUS,
    panHandlers: panResponder.panHandlers,
  };
}