import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Pressable,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";

import * as SplashScreen from "expo-splash-screen";

import { useFonts, Kurale_400Regular } from "@expo-google-fonts/kurale";

import React, { useState, useEffect, useRef } from "react";

import * as Font from "expo-font";

// useEffect(() => {
//   async function loadFonts() {
//     await Font.loadAsync({
//       "Kurale-Regular": require("./assets/fonts/Kurale-Regular.ttf"),
//     });
//   }
//   loadFonts();
// }, []);

import { Link } from "expo-router";
const screenWidth = Dimensions.get("window").width;

import LinearGradient from "react-native-linear-gradient";

var darkRed = "#B0170F";
var magenta = "#FF2452";
var pink = "#FFD3EE";
var darkPurple = "#6750A4";
var grayText = "#49454F";
var attributeGray = "#ECE6F0";

export default function LandingPage() {
  const hobbies = ["Video Games", "Anime", "Reading", "Clogging", "Tennis"];
  const hobbiesLength = hobbies.length;

  const music = ["R&B", "Rock", "Country", "Folk", "smthsmth", "indie pop"];
  const musicLength = music.length;

  const icks = ["Smelly", "Broke", "Bad Driver"];
  const icksLength = icks.length;

  const attributes = [
    ["Hobbies", hobbies],
    ["Music", music],
    ["Icks", icks],
  ];
  const attributesLength = attributes.length;

  const [viewHeight, setViewHeight] = useState(0);
  const myViewRef = useRef(null);

  const [isReady, setIsReady] = useState(false);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setViewHeight(height);
  };

  useEffect(() => {
    async function prepare() {
      let [fontsLoaded] = useFonts({
        Kurale_400Regular,
      });
      await SplashScreen.preventAutoHideAsync();
    }

    prepare();
  }, []);

  useEffect(() => {
    const hideAsync = async () => {
      if (isReady) {
        await SplashScreen.hideAsync();
      }
    };

    hideAsync();
  }, [isReady]);

  return (
    <ScrollView style={styles.background}>
      <View ref={myViewRef} onLayout={handleLayout}>
        <View style={styles.container}>
          <Pressable style={{ alignSelf: "flex-end" }}>
            <Link href="./report">
              <View style={styles.reportCircle}>
                <Text style={{ alignSelf: "center", fontSize: 20 }}>!</Text>
              </View>
            </Link>
          </Pressable>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.image}
          />
          <Text style={styles.bigText}>Myles Stubbs</Text>
          <Text style={styles.smallText}>He/Him 24</Text>
          <Text style={styles.verySmallText}>Sao Poalo, Brazil</Text>
          {/* This is the space for the chat button */}
          <View style={{ marginVertical: "5%" }}>
            <Pressable style={styles.purpleButton}>
              <Text style={styles.purpleButtonText}>Chat</Text>
            </Pressable>
          </View>
        </View>
        {/* This is the container that contains the bio */}
        <View style={styles.container}>
          <Text style={styles.bioText}>
            Long ass text that should wrap within the container so that it looks
            clean and the bio section should just auto adjust to the size of the
            string input
          </Text>
        </View>

        {/* Everything in this view is the attributes about the person */}
        <View style={styles.leftAlignedContainer}>
          <Text style={styles.attributeName}>Age: 24</Text>
          <View style={styles.separatorLine}></View>

          <View style={styles.attributeViewSingle}>
            <Text style={styles.attributeName}>Pronouns:</Text>
            <Pressable style={styles.attribute}>
              <Text style={styles.attributeText}>He/Him</Text>
            </Pressable>
          </View>
          <View style={styles.separatorLine}></View>

          <View style={styles.attributeViewSingle}>
            <Text style={styles.attributeName}>Orientation:</Text>
            <Pressable style={styles.attribute}>
              <Text style={styles.attributeText}>Straight</Text>
            </Pressable>
          </View>
          <View style={styles.separatorLine}></View>
          {Array.from({ length: attributesLength }).map((_, i) => (
            <View style={{ alignItems: "flex-start" }}>
              <Text style={styles.attributeName}>{attributes[i][0]}:</Text>
              <View style={styles.attributeView}>
                {Array.from({ length: attributes[i][1].length }).map(
                  (_, index) => (
                    <Pressable style={styles.attribute}>
                      <Text style={[styles.attributeText]}>
                        {attributes[i][1][index]}
                      </Text>
                    </Pressable>
                  )
                )}
              </View>
              {i != attributesLength - 1 && (
                <View style={styles.separatorLine}></View>
              )}
              {i == attributesLength - 1 && (
                <View style={{ padding: "4%" }}></View>
              )}
            </View>
          ))}
        </View>
        {/* buffer space for the bottom */}
        <View style={{ padding: "33%" }}></View>
      </View>

      {/* This is the lock Icon, may need to do some sort of magic in order to get it to be in front of the correct values */}
      <View style={[styles.cover, { top: viewHeight - screenWidth * 0.68 }]}>
        <Text style={styles.bigText}>Hidden Info</Text>
        <Text style={styles.textPoints}>Points to Unlock: 3/5</Text>
        <Pressable style={styles.breakupButton}>
          <Link href={"./breakup"}>
            <Text style={styles.breakupButtonText}>Break Up?</Text>
          </Link>
        </Pressable>
      </View>

      <View
        style={[styles.bottomOfPage, { top: viewHeight - screenWidth * 0.77 }]}
      >
        <View style={styles.lockLineLeft}></View>
        <View style={styles.lockOutline}>
          <View style={styles.lockContainer}>
            <View style={styles.lockArc} />
            <View style={styles.lockBody} />
          </View>
        </View>
        <View style={styles.lockLineRight}></View>
      </View>
    </ScrollView>
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
    borderRadius: 10,
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: "5%",
  },
  image: {
    width: screenWidth / 2,
    height: screenWidth / 2,
    resizeMode: "contain",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 100,
  },
  smallText: {
    fontSize: 25,
    fontFamily: "Kurale_400Regular",
  },
  bigText: {
    fontSize: 48,
    fontFamily: "Kurale_400Regular",
  },
  bioText: {
    fontSize: 15,
    padding: "1%",
    fontFamily: "Kurale_400Regular",
  },
  verySmallText: {
    fontSize: 14,
    padding: "1%",
  },
  purpleButton: {
    backgroundColor: darkPurple,
    padding: "0%",
    borderRadius: 10,
    paddingHorizontal: "8%",
  },
  purpleButtonText: {
    color: "#ffffff",
    fontSize: 48,
    fontFamily: "Kurale_400Regular",
  },
  reportCircle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: grayText,
    justifyContent: "center",
  },
  attributeName: {
    fontSize: 24,
    padding: "1%",
    alignSelf: "flex-start",
    fontFamily: "Kurale_400Regular",
  },
  leftAlignedContainer: {
    backgroundColor: "white",
    padding: "3%",
    borderRadius: 10,
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginVertical: "5%",
    marginBottom: "-5%",
    paddingBottom: "15%",
  },
  separatorLine: {
    backgroundColor: "gray",
    marginVertical: 10,
    alignSelf: "center",
    paddingHorizontal: "47%",
    paddingVertical: "0.25%",
  },
  attribute: {
    borderRadius: 30,
    backgroundColor: attributeGray,
    paddingHorizontal: "4%",
    paddingVertical: "4%",
  },
  attributeView: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    rowGap: screenWidth / 100,
    columnGap: screenWidth / 90,
    paddingHorizontal: "2%",
    paddingVertical: "3%",
  },
  attributeText: {
    fontSize: 16,
    color: grayText,
  },
  attributeViewSingle: {
    flexDirection: "row",
    columnGap: 5,
  },
  lockOutline: {
    borderRadius: 1000,
    borderColor: "black",
    borderWidth: 4,
    width: "20%",
    aspectRatio: 1,
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  lockLineLeft: {
    height: 3,
    backgroundColor: "black",
    alignSelf: "center",
    width: "45%",
    marginLeft: "-6%",
  },
  lockLineRight: {
    height: 3,
    backgroundColor: "black",
    alignSelf: "center",
    width: "45%",
  },
  lock: {
    width: screenWidth / 10,
    height: screenWidth / 10,
    borderRadius: 40,
  },
  bottomOfPage: {
    flexDirection: "row",
    alignContent: "center",
    position: "absolute",
  },
  cover: {
    position: "absolute",
    bottom: 0,
    height: "15%",
    width: "112%",
    backgroundColor: pink,
    marginLeft: "-6%",
    alignItems: "center",
    paddingTop: "10%",
  },
  textPoints: {
    fontSize: 20,
    color: grayText,
    padding: "1%",
    alignSelf: "center",
  },
  breakupButton: {
    backgroundColor: magenta,
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    marginTop: "4%",
    borderRadius: 20,
  },
  breakupButtonText: {
    color: "white",
    fontSize: 32,
    fontFamily: "Kurale_400Regular",
  },
  lockContainer: {
    width: 50,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  lockBody: {
    width: screenWidth / 10,
    height: screenWidth / 14,
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: "10%",
  },
  lockArc: {
    position: "absolute",
    width: screenWidth / 14,
    height: screenWidth / 14,
    borderRadius: screenWidth / 24,
    borderColor: "black",
    borderWidth: 3,
    top: screenWidth / 50,
    left: screenWidth / 35,
    transform: [{ rotate: "45deg" }],
  },
});
