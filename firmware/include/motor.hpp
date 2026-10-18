#pragma once

class Motor {
  private:
    int pwmId;
    int firstInputId;
    int secondInputId;

  public:
    Motor(int firstInputId, int secondInputId, int pwmId);
    void forward(int power);
    void backward(int power);
    void stop();
};