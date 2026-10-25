#include <Arduino.h>
#include "motor.hpp"
#include "ble_communicator.hpp"
#include <WebServer.h>

const int LED_PIN = 2;

const char *ssid = "UWR_Robot";
const char *password = "robot1234";

WebServer server(80);

Motor motorA(17, 5, 18);
Motor motorB(16, 4, 15);

int currentPhase = 0;
unsigned long lastPhaseChangeTime = 0;
int phaseChangeInterval = 1250;

bool setupWifi()
{
  WiFi.mode(WIFI_AP);

  bool success = WiFi.softAP(ssid, password);

  if (success)
  {
    Serial.println(WiFi.softAPIP());
  }

  return success;
}

void setupServer()
{
  server.on("/", HTTP_GET, []()
            { 
        Serial.println("request caught");
        server.send(200, "text/plain", "Robot connecte au Wi-Fi. Serveur operationnel !"); });

  server.on("/commande", HTTP_GET, []()
            {
        String x = server.arg("x");
        String y = server.arg("y");

        Serial.print("Joystick X = ");
        Serial.print(x);
        Serial.print(" | Y = ");
        Serial.println(y);

        server.send(200, "text/plain", "Commande recue"); });

  server.begin();
}

void setup()
{
  Serial.begin(9600);

  setupBle();
  bool success = setupWifi();

  if (success)
  {
    Serial.println("Point Wi-Fi demarre !");
    setupServer();
  }
  else
  {
    Serial.println("Erreur : impossible de creer le reseau Wi-Fi");
  }

  analogWrite(LED_PIN, 1);
  Serial.println("ready");
  Serial.println("coucou les loulous");
}

void zigzag()
{
  unsigned long currentTime = millis();
  int delta = currentTime - lastPhaseChangeTime;

  if (delta >= phaseChangeInterval)
  {
    lastPhaseChangeTime = currentTime;
    currentPhase = (currentPhase + 1) % 2;

    if (currentPhase == 0)
    {
      motorA.forward(150);
      motorB.forward(180);
    }
    else
    {
      motorA.forward(180);
      motorB.forward(150);
    }
  }
}

void loop()
{
  server.handleClient();
}
