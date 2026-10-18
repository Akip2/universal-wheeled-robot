#include <Arduino.h>
#include "motor.hpp"

const int LED_PIN = 2;

Motor motorA(17, 5, 18);
Motor motorB(16, 4, 15);

int currentPhase = 0;
unsigned long lastPhaseChangeTime = 0;
int phaseChangeInterval = 1250;

void setup() {
  Serial.begin(9600);

  analogWrite(LED_PIN, 1);
  Serial.println("ready");
}

void zigzag() {
  unsigned long currentTime = millis();
  int delta = currentTime - lastPhaseChangeTime;

  if(delta >= phaseChangeInterval) {
    lastPhaseChangeTime = currentTime;
    currentPhase = (currentPhase + 1) % 2;

    if(currentPhase == 0) {
      motorA.forward(150);
      motorB.forward(180);
    } else {
      motorA.forward(180);
      motorB.forward(150);
    }
  }
}

void loop() {
  zigzag();
}
