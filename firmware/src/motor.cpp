#include "Arduino.h"
#include "motor.hpp"

Motor::Motor(int f, int s, int p) {
  firstInputId = f;
  secondInputId = s;
  pwmId = p;

  pinMode(firstInputId, OUTPUT);
  pinMode(secondInputId, OUTPUT);
}

void Motor::backward(int power) {
  digitalWrite(firstInputId, LOW);
  digitalWrite(secondInputId, HIGH);

  analogWrite(pwmId, constrain(power, 0, 255));
}

void Motor::forward(int power) {
  digitalWrite(firstInputId, HIGH);
  digitalWrite(secondInputId, LOW);

  analogWrite(pwmId, constrain(power, 0, 255));
}

void Motor::stop() {
  digitalWrite(firstInputId, LOW);
  digitalWrite(secondInputId, LOW);
}