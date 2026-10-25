#include <WiFi.h>

const char* ssid = "UWR_Robot";
const char* password = "robot1234";

bool setupWifi() {
    WiFi.mode(WIFI_AP);

    return WiFi.softAP(ssid, password);
}