import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Pressable,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

import React, { useState, useEffect } from "react";

import { useFonts, Kurale_400Regular } from "@expo-google-fonts/kurale";

var darkRed = "#B0170F";
var magenta = "#FF2452";
var pink = "#FFD3EE";
var darkPurple = "#6750A4";
var grayText = "#49454F";
var attributeGray = "#ECE6F0";

const screenWidth = Dimensions.get("window").width;

export default function report() {
  const [isTextInputVisible, setIsTextInputVisible] = useState(false);
  const [pressedIds, setPressedIds] = useState([]);
  const names = [
    "Scam",
    "Abusive",
    "Violent",
    "Racist",
    "Sexist",
    "Homophobic",
    "Other",
  ];

  const handleOutsideTouch = () => {
    setIsTextInputVisible(false);
    Keyboard.dismiss();
  };

  const handlePress = (id) => {
    if (pressedIds.includes(id)) {
      setPressedIds(pressedIds.filter((item) => item !== id));
    } else {
      setPressedIds([...pressedIds, id]);
    }
    Keyboard.dismiss();
  };

  useFonts({
    Kurale_400Regular,
  });
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.background, { flex: 1 }]}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 10 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={handleOutsideTouch}>
          {/* <View style={[styles.background, { flex: 1 }]}> */}
          <View style={styles.container}>
            <Text style={styles.bigText}>Reporting Myles Stubbs:</Text>
            <Text style={styles.smallText}>Select All:</Text>
            <View style={styles.attributeView}>
              {Array.from({ length: 7 }).map((_, index) => (
                <Pressable
                  style={[
                    styles.attribute,
                    pressedIds.includes(index) && styles.attributePressed,
                  ]}
                  onPress={() => handlePress(index)}
                >
                  <Text
                    style={[
                      styles.attributeText,
                      pressedIds.includes(index) && styles.attributeTextpressed,
                    ]}
                  >
                    {names[index]}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.smallText}>Description:</Text>
            <TextInput
              style={styles.textInput}
              textAlignVertical="top"
              textAlign="left"
              multiline={true}
            ></TextInput>
            <Pressable style={styles.reportButton}>
              <Text style={styles.reportButtonText}>Report</Text>
            </Pressable>
          </View>
          {/* </View> */}
        </TouchableWithoutFeedback>
        <View style={{ padding: "24%" }}></View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    borderRadius: screenWidth / 30,
    justifyContent: "space-around",
    marginVertical: "5%",
  },
  smallText: {
    fontSize: 18,
    paddingLeft: "2%",
    flexWrap: "wrap",
    paddingVertical: "2%",
    fontFamily: "Kurale_400Regular",
  },
  bigText: {
    fontSize: 24,
    padding: "5%",
    alignSelf: "center",
    fontFamily: "Kurale_400Regular",
  },
  textInput: {
    backgroundColor: attributeGray,
    height: "40%",
    width: "90%",
    borderRadius: 10,
    padding: "5%",
    alignSelf: "center",
    flex: 11,
    paddingBottom: "20%",
  },
  attributeName: {
    fontSize: 24,
    padding: "1%",
    alignSelf: "flex-start",
  },
  attribute: {
    borderRadius: 30,
    backgroundColor: attributeGray,
    paddingHorizontal: "4%",
    paddingVertical: "4%",
  },
  attributePressed: {
    borderRadius: 30,
    backgroundColor: darkPurple,
    paddingHorizontal: "4%",
    paddingVertical: "4%",
  },
  attributeView: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    rowGap: 5,
    columnGap: 5,
    paddingHorizontal: "3%",
  },
  attributeText: {
    fontSize: 16,
    color: grayText,
  },
  attributeTextpressed: {
    fontSize: 16,
    color: "#ffffff",
  },
  reportButton: {
    backgroundColor: magenta,
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    margin: "6%",
    borderRadius: 20,
    alignSelf: "center",
  },
  reportButtonText: {
    color: "white",
    fontSize: 32,
    fontFamily: "Kurale_400Regular",
  },
});
