//Data logger Demonstration using Seeeduino Stalker v3.0. Logs Battery Voltage every 10 seconds to DATALOG.CSV file
//Use this demo code to implement your Datalogger functionality, add additional sensors.

//1.Solder P3 and P2 PCB jumper pads
//2.Compile and upload the sketch
//3.See if everything works fine using Serial Monitor.
//4.Remove all Serial port code, recompile the sketch and upload.
// This reduces power consumption during battery mode.

#include <avr/sleep.h> 
#include <avr/power.h>
#include <Wire.h>
#include <OneWire.h>
#include <DS1337.h>
#include <SPI.h>
#include <SD.h>
#include <SoftwareSerial.h>
#include <String.h>

#define FONA_RX 5
#define FONA_TX 6
#define FONA_RST 7
#define FONA_KEY 9
#define LED A1


// pH ....................................
#define phPin A0        // pH meter Analog output to Arduino Analog Input 0
#define Offset 0.00     // deviation compensate
#define samplingInterval 20
#define printInterval 800
#define ArrayLength 40    // times of collection

DS1337 RTC; //Create RTC object for DS1337 RTC
static uint8_t prevSecond=0; 
static DateTime interruptTime;

static uint16_t interruptInterval = 20; //Seconds. Change this to suitable value.

#include <SoftwareSerial.h>
SoftwareSerial fonaSS = SoftwareSerial(FONA_TX, FONA_RX);
SoftwareSerial *fonaSerial = &fonaSS;

void setup () 
{
     /*Initialize INT0 pin for accepting interrupts */
     PORTD |= 0x04; 
     DDRD &=~ 0x04;

     Wire.begin();
     Serial.begin(115200);
     RTC.begin();
     
     pinMode(FONA_KEY, OUTPUT);
     
     Serial.println(F("Starting up fona"));
     turnOnFona();
     fonaSerial->begin(4800);
     pinMode(FONA_RST, OUTPUT);
     digitalWrite(FONA_RST, HIGH);
     delay(10);
     digitalWrite(FONA_RST, LOW);
     delay(100);
     digitalWrite(FONA_RST, HIGH);

     // give 7 seconds to reboot
     delay(7000);
     int answer = sendATcommand("AT", "OK", 2000);
     if (answer != 1) {
       Serial.println(F("Couldn't find FONA"));
       return;
     } 
     Serial.println("FONA is OK");
     
     delay(100);

     answer = sendATcommand("AT+CGSOCKCONT=1,\"IP\",\"wholesale\",\"0.0.0.0\",0,0", "OK", 2000);
     if (answer != 1) {
       Serial.println(F("CGSOCKCONT failed"));
     }

     delay(500);
     answer = sendATcommand("AT+CSOCKAUTH=1,2,\"SIMCOM\",\"123\"", "OK", 2000);
     if (answer != 1) {
       Serial.println(F("CGSOCKAUTH failed"));
     }
     delay(1500);
     
     pinMode(4,OUTPUT);//SD Card power control pin. LOW = On, HIGH = Off
     digitalWrite(4,LOW); //Power On SD Card.
     
     Serial.print("Load SD card...");
     pinMode(LED, OUTPUT);
     digitalWrite(LED, HIGH);
     delay(100);
     digitalWrite(LED, LOW);
     delay(100);
     digitalWrite(LED, HIGH);
     delay(100);
     digitalWrite(LED, LOW);
     delay(100);
     digitalWrite(LED, HIGH);
     
     pinMode(10, OUTPUT);
     digitalWrite(10, HIGH);
     
     attachInterrupt(0, INT0_ISR, LOW); //Only LOW level interrupt can wake up from PWR_DOWN
     set_sleep_mode(SLEEP_MODE_PWR_DOWN);
 
     //Enable Interrupt 
//     RTC.enableInterrupts(EveryMinute); //interrupt at  EverySecond, EveryMinute, EveryHour
     // or this
     DateTime start = RTC.now();
     interruptTime = DateTime(start.get() + interruptInterval); //Add interruptInterval in seconds to start time
     
     // Check if SD card can be intialized.
     if (!SD.begin(10))  //Chipselect is on pin 10
     {
        Serial.println("SD Card could not be intialized, or not found");
        return;
     }
     Serial.println("SD Card found and initialized.");
     digitalWrite(LED, HIGH);
     delay(100);
     digitalWrite(LED, LOW);
     delay(100);
     digitalWrite(LED, HIGH);
     delay(100);
     digitalWrite(LED, LOW);
     delay(100);
}

void loop () {
    
    float temp = getTemp();
    float ph = getpH();
    
    boolean sentValuesVia3G = false;
    int i = 0;
    while (!sentValuesVia3G && i < 3) {
//      Serial.println(F("SENTVALUESVIA3G: "));
//      Serial.println(sentValuesVia3G);
      sentValuesVia3G = sendPOSTRequest(ph, temp);
      i++;
    }
    
    DateTime now = RTC.now(); //get the current date-time    
    prevSecond = now.second();
    writeToSDCard(ph, temp);
    
    RTC.clearINTStatus(); //This function call is a must to bring /INT pin HIGH after an interrupt.
    RTC.enableInterrupts(interruptTime.hour(),interruptTime.minute(),interruptTime.second());    // set the interrupt at (h,m,s)
    sleep_enable();      // Set sleep enable bit
    attachInterrupt(0, INT0_ISR, LOW);  //Enable INT0 interrupt (as ISR disables interrupt). This strategy is required to handle LEVEL triggered interrupt   
    
    //\/\/\/\/\/\/\/\/\/\/\/\/Sleep Mode and Power Down routines\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
            
    //Power Down routines
    cli();
    sleep_enable();
    sleep_bod_disable(); // Disable brown out detection during sleep. Saves more power
    sei();
    blinkLED(500, 2);
    digitalWrite(4,HIGH); //Power Off SD Card.
    turnOffFona();
//    Serial.println("\nSleeping");
    delay(10); //This delay is required to allow print to complete
    // Shut down all peripherals like ADC before sleep. Refer Atmega328 manual
    power_all_disable(); // This shuts down ADC, TWI, SPI, Timers and USART
    sleep_cpu();         // Sleep the CPU as per the mode set earlier(power down)  
    sleep_disable();     // Wakes up sleep and clears enable bit. Before this ISR would have executed
    power_all_enable();  // This enables ADC, TWI, SPI, Timers and USART
    delay(900000);         // This delay is required to allow CPU to stabilize
//    Serial.println("Awake from sleep");    
    turnOnFona();
    digitalWrite(4,LOW); //Power On SD Card.
    blinkLED(500, 2);

    //\/\/\/\/\/\/\/\/\/\/\/\/Sleep Mode and Power Saver routines\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
}

float getTemp() { 
  OneWire ds(8);
  byte data[12];
  byte addr[8];


  if ( !ds.search(addr)) {// no more sensors on chain, reset search
    ds.reset_search();
    return -1000;
  }
  
  ds.reset();
//  ds.select((uint8_t*) "0x28, 0x9D, 0xF2, 0x97, 0x05, 0x00, 0x00, 0x9");
  ds.select(addr);
  ds.write(0x44,1); // start conversion, with parasite power on at the end
  byte present = ds.reset();
  ds.select(addr);
//  ds.select((uint8_t*) "0x28, 0x9D, 0xF2, 0x97, 0x05, 0x00, 0x00, 0x9");
  ds.write(0xBE); // Read Scratchpad
  
  data[0] = ds.read();
  data[1] = ds.read();
  data[2] = ds.read();
  data[3] = ds.read();
  data[4] = ds.read();
  data[5] = ds.read();
  data[6] = ds.read();
  data[7] = ds.read();
  data[8] = ds.read();
  ds.reset_search();
  float TemperatureSum = ((data[1] << 8) | data[0]) / 16.0;  //using two's compliment
  TemperatureSum = TemperatureSum * (9/5) + 32; // convert to F
  
  return TemperatureSum + 17.0;
}

void writeToSDCard(float phVal, float tempVal) {
    DateTime now = RTC.now(); //get the current date-time
    File logFile = SD.open("DATALOG.TXT", FILE_WRITE);
//    Serial.println(logFile);
    
    if (logFile) {
//      Serial.println(F("printing to logfile"));
      // temp
      logFile.print(tempVal, DEC);
      logFile.print(',');
      // pH
      logFile.print(phVal, DEC);
      logFile.print(',');
      // timestamp      
      logFile.println(now.get() + (30 * 31556926) - 3600 - (21 * 60));
      logFile.close();
      blinkLED(10, 3);
    }
}

boolean sendPOSTRequest(float phVal, float tempVal) {
  char request[160] = "POST /data/newData HTTP/1.1\r\nContent-Length: 52\r\nHost: vache.cs.umd.edu\r\nAccept: text/html\r\n\r\ndevice_id=2&data_type=water&ph=";
  char phArr[5];
  char tempArr[5];
  dtostrf(phVal,4,1,phArr);
  dtostrf(tempVal,4,1,tempArr);
  strcat(request, phArr);
  strcat(request, "&temperature=");
  strcat(request, tempArr);
  boolean didSend = false;
  // gets the SSL stack
  int answer = sendATcommand("AT+CHTTPSSTART", "OK", 10000);
  if (answer == 1) { 
    // Opens the HTTP session
    answer = sendATcommand("AT+CHTTPSOPSE=\"vache.cs.umd.edu\",80,1", "OK", 30000);
    if (answer == 1) {
      // Stores and sends the request
      answer = sendATcommand("AT+CHTTPSSEND=155", ">", 5000);
      if (answer == 1) {
        answer = sendATcommand(request, "te", 5000); 
        if (answer == 1) { 
          // request the url
          answer = sendATcommand("AT+CHTTPSSEND", "OK", 5000);
          blinkLED(2000, 4);
          didSend = true;
        } else {
          Serial.println(F("Error sending request to FONA"));
          didSend = true;
        }
      } else {
        Serial.println(F("Error in sending aux_str to FONA"));
      }
    } else {
       Serial.println(F("Error in opening HTTP session"));   
    }
  } else {
    Serial.println(F("Error in opening SSL stack"));
  }
  sendATcommand("AT+CHTTPSCLSE", "OK", 5000);  // close http session
  sendATcommand("AT+CHTTPSSTOP", "OK", 5000);  // stop http stack
  delay(5000);
  digitalWrite(FONA_RST, HIGH);
  delay(10);
  digitalWrite(FONA_RST, LOW);
  delay(100);
  digitalWrite(FONA_RST, HIGH);
  delay(7000);
  return didSend;
}

int8_t sendATcommand(char* ATcommand, char* expected_answer, unsigned int timeout){
    unsigned long previous;
    
    delay(300); // Delay to be sure no passed commands interfere
    
    while( fonaSS.available() > 0) fonaSS.read();    // Wait for clean input buffer
    
    fonaSS.println(ATcommand); // Send the AT command 
 
    previous = millis();
    
    // this loop waits for the answer
    do {
        // if there are data in the UART input buffer, reads it and checks for the answer
        if(fonaSS.available() != 0) {
          
              char a = fonaSS.read();
              char b = fonaSS.read();
//              Serial.print(a);
//              Serial.print(b);
              if ((a == 'K' || b == 'K') || (a == '>' || b == '>')) {
                return 1;
              }
        }
    // Waits for the answer with time out
    } while((millis() - previous) < timeout);
 
    return 0;
}

// returns current pH
float getpH() {
  return (float) 3.5 * (analogRead(phPin) * 5.0/1024) + Offset;
}

//float getpH() {
//  int pHArray[ArrayLength]; // Store the average value of the sensor feedback
//  int pHArrayIndex = 0;
//  static unsigned long samplingTime = millis();
//  static float pHValue, voltage;
//  if (millis() - samplingTime > samplingInterval) {
//      pHArray[pHArrayIndex++] = analogRead(phPin);
//      if (pHArrayIndex == ArrayLength) {
//        pHArrayIndex = 0;
//      }
//      voltage = averageArray(pHArray, ArrayLength) * 5.0/1024;
////      voltage = analogRead(phPin) * 5.0/1024;
//      pHValue = 3.5 * voltage + Offset;
//  }
//  return pHValue;
//}
//
//double averageArray(int* arr, int number) {
//  int i, max, min;
//  double avg;
//  long amount = 0;
//  if (number <= 0) {
//    Serial.println("Error: averageArray(): number can't be less than or equal to 0/n");
//    return 0;
//  }
//  if (number < 5) {   
//    for (i = 0; i < number; i++) {
//      amount += arr[i];
//    }
//    return amount/number;
//  } else {
//    arr[0] < arr[1] ? min = arr[0], max = arr[1] : min = arr[1], max = arr[0];
//    for (i = 2; i < number; i++) {
//      if (arr[i] < min) {
//        amount += min;        //arr<min
//        min = arr[i];
//      } else {
//        if (arr[i] > max) {
//          amount += max;    //arr>max
//          max = arr[i];
//        } else {
//          amount += arr[i]; //min<=arr<=max
//        }
//      } // end if
//    } // end for
//    return (double) amount / (number-2);
//  } // end if
//}

  
//Interrupt service routine for external interrupt on INT0 pin conntected to DS1337 /INT
void INT0_ISR()
{
    // Keep this as short as possible. Possibly avoid using function calls
    detachInterrupt(0); 
    interruptTime = DateTime(interruptTime.get() + interruptInterval);  //decide the time for next interrupt, configure next interrupt  
}

void blinkLED(int seconds, int times) {
  int i;
  for (i = 0; i < times; i++) {
    digitalWrite(LED, HIGH);
    delay(seconds);
    digitalWrite(LED, LOW);
    delay(seconds);
    digitalWrite(LED, HIGH);
    delay(seconds);
    digitalWrite(LED, LOW);
  }
}

void turnOnFona() {
  int i = 0;
  while (i< 5000) {
    digitalWrite(FONA_KEY, LOW);
    delay(1);
    i++;
  }
  digitalWrite(FONA_KEY, HIGH);
}

void turnOffFona() {
  int i = 0;
  while (i< 5000) {
    digitalWrite(FONA_KEY, LOW);
    delay(1);
    i++;
  }
  digitalWrite(FONA_KEY, HIGH);
}


