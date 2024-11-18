import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Pressable,
  Dimensions,
} from "react-native";

import React, { useState, useEffect } from "react";

import { useFonts, Kurale_400Regular } from "@expo-google-fonts/kurale";

const screenWidth = Dimensions.get("window").width;

var darkRed = "#B0170F";
var magenta = "#FF2452";
var pink = "#FFD3EE";
var darkPurple = "#6750A4";
var grayText = "#49454F";
var attributeGray = "#ECE6F0";

export default function unmatched() {
  const calculateNextThursday = () => {
    const nextThursday = new Date();
    nextThursday.setDate(
      nextThursday.getDate() + ((4 - nextThursday.getDay() + 7) % 7)
    );
    nextThursday.setHours(17, 0, 0, 0);
    return nextThursday;
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  const [targetTime, setTargetTime] = useState(calculateNextThursday());

  const calculateTimeLeft = () => {
    const difference = targetTime.getTime() - currentTime.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());

      // Calculate the next Thursday's date at 5 PM
      const nextThursday = new Date();
      nextThursday.setDate(
        nextThursday.getDate() + ((4 - nextThursday.getDay() + 7) % 7)
      );
      nextThursday.setHours(17, 0, 0, 0);

      setTargetTime(nextThursday);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const { days, hours, minutes, seconds } = calculateTimeLeft();

  useFonts({
    Kurale_400Regular,
  });
  return (
    <View style={[styles.background, { flex: 1 }]}>
      <View style={styles.container}>
        <Text style={styles.bigText}>Next Catch In: </Text>
        <Text style={styles.countdown}>
          {days}d : {hours}hr : {minutes}m
        </Text>
        <Pressable style={[styles.purpleButton, { margin: "10%" }]}>
          <Text style={styles.purpleButtonText}>Check in</Text>
        </Pressable>
        <Pressable
          style={[
            styles.yellowButton,
            { backgroundColor: "gold", paddingHorizontal: "5%" },
          ]}
        >
          <Text
            style={[
              styles.yellowButtonText,
              {
                color: "white",
                fontSize: 28,
                // borderRadius: screenWidth / 1000,
              },
            ]}
          >
            Get Premium
          </Text>
        </Pressable>
        <Text style={[styles.smallText, { color: grayText }]}>
          Get Priority Matches
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: pink,
    padding: "5%",
  },
  container: {
    backgroundColor: "white",
    padding: "3%",
    borderRadius: screenWidth / 40,
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: "5%",
  },
  smallText: {
    fontSize: 15,
    padding: "1%",
    fontFamily: "Kurale_400Regular",
    paddingBottom: "10%",
  },
  bigText: {
    fontSize: 42,
    padding: "10%",
    fontFamily: "Kurale_400Regular",
  },
  countdown: {
    fontSize: 46,
    fontFamily: "Kurale_400Regular",
  },
  purpleButton: {
    backgroundColor: darkPurple,
    padding: "0%",
    borderRadius: screenWidth / 40,
    paddingHorizontal: "10%",
    marginTop: "15%",
  },
  purpleButtonText: {
    color: "#ffffff",
    fontSize: 46,
    fontFamily: "Kurale_400Regular",
  },
  yellowButton: {
    backgroundColor: "gold",
    padding: "1%",
    borderRadius: screenWidth / 50,
    marginTop: "5%",
  },
  yellowButtonText: {
    color: "#ffffff",
    fontSize: 46,
    fontFamily: "Kurale_400Regular",
  },
});
