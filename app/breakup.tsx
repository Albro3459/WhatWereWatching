import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";

var darkRed = "#B0170F";
var magenta = "#FF2452";
var pink = "#FFD3EE";
var darkPurple = "#6750A4";
var grayText = "49454F";
var attributeGray = "#ECE6F0";
const screenWidth = Dimensions.get("window").width;
const scale = 1.25;

export default function breakup() {
  // const [fontsLoaded] = useFonts({
  //   "Kurale-Regular": require("./assets/fonts/Kurale-Regular.ttf"),
  // });
  const [isTextInputVisible, setIsTextInputVisible] = useState(false);
  const [heart1, setHeart1] = useState(magenta);
  const [heart2, setHeart2] = useState(magenta);
  const [heart3, setHeart3] = useState(magenta);
  const [heart4, setHeart4] = useState(magenta);
  const [heart5, setHeart5] = useState(magenta);
  function changeHeart(num) {
    switch (num) {
      case 1: {
        setHeart2(attributeGray);
        setHeart3(attributeGray);
        setHeart4(attributeGray);
        setHeart5(attributeGray);
        break;
      }
      case 2: {
        setHeart2(magenta);
        setHeart3(attributeGray);
        setHeart4(attributeGray);
        setHeart5(attributeGray);
        break;
      }
      case 3: {
        setHeart2(magenta);
        setHeart3(magenta);
        setHeart4(attributeGray);
        setHeart5(attributeGray);
        break;
      }
      case 4: {
        setHeart2(magenta);
        setHeart3(magenta);
        setHeart4(magenta);
        setHeart5(attributeGray);
        break;
      }
      case 5: {
        setHeart2(magenta);
        setHeart3(magenta);
        setHeart4(magenta);
        setHeart5(magenta);
        break;
      }
      default: {
        break;
      }
    }
  }

  const handleOutsideTouch = () => {
    setIsTextInputVisible(false);
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.background, { flex: 1 }]}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 20 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.bigText}>Why Break Up?</Text>
          <View style={{ flexDirection: "row", paddingVertical: "3%" }}>
            <Pressable onPress={() => changeHeart(1)}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.heartContainer}>
                  <View
                    style={[styles.heartLeft, { backgroundColor: heart1 }]}
                  />
                  <View
                    style={[styles.heartRight, { backgroundColor: heart1 }]}
                  />
                </View>
              </View>
            </Pressable>
            <Pressable onPress={() => changeHeart(2)}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.heartContainer}>
                  <View
                    style={[styles.heartLeft, { backgroundColor: heart2 }]}
                  />
                  <View
                    style={[styles.heartRight, { backgroundColor: heart2 }]}
                  />
                </View>
              </View>
            </Pressable>
            <Pressable onPress={() => changeHeart(3)}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.heartContainer}>
                  <View
                    style={[styles.heartLeft, { backgroundColor: heart3 }]}
                  />
                  <View
                    style={[styles.heartRight, { backgroundColor: heart3 }]}
                  />
                </View>
              </View>
            </Pressable>
            <Pressable onPress={() => changeHeart(4)}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.heartContainer}>
                  <View
                    style={[styles.heartLeft, { backgroundColor: heart4 }]}
                  />
                  <View
                    style={[styles.heartRight, { backgroundColor: heart4 }]}
                  />
                </View>
              </View>
            </Pressable>
            <Pressable onPress={() => changeHeart(5)}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.heartContainer}>
                  <View
                    style={[styles.heartLeft, { backgroundColor: heart5 }]}
                  />
                  <View
                    style={[styles.heartRight, { backgroundColor: heart5 }]}
                  />
                </View>
              </View>
            </Pressable>
          </View>

          <Text style={styles.attributeName}>Rant:</Text>
          <TextInput
            style={styles.textInput}
            textAlignVertical="top"
            textAlign="left"
            multiline={true}
          ></TextInput>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingVertical: "4%",
            }}
          >
            <Pressable style={styles.breakupButton}>
              <Text style={styles.breakupButtonText}>Break Up</Text>
            </Pressable>
            <Pressable style={styles.cancelButton}>
              <Text style={styles.purpleButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
        <Image
          source={require("../assets/images/brokenHeart.png")}
          style={styles.brokenHeart}
        />
        <View style={{ padding: "61%" }}></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: pink,
    padding: "5%",
    flex: 1,
  },
  container: {
    backgroundColor: "white",
    padding: "3%",
    borderRadius: 10,
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "5%",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 100,
  },
  smallText: {
    fontSize: 15,
    padding: "1%",
    fontFamily: "Kurale_400Regular",
  },
  bigText: {
    fontSize: 44,
    padding: "1%",
    fontFamily: "Kurale-Regular",
  },
  verySmallText: {
    fontSize: 12,
    padding: "1%",
    fontFamily: "Kurale_400Regular",
  },
  purpleButton: {
    backgroundColor: darkPurple,
    padding: "5%",
    borderRadius: 10,
    paddingHorizontal: "15%",
  },
  purpleButtonText: {
    color: "#ffffff",
    fontSize: 30,
    fontFamily: "Kurale_400Regular",
  },
  attributeName: {
    fontSize: 20,
    padding: "1%",
    alignSelf: "flex-start",
    fontFamily: "Kurale_400Regular",
  },
  breakupButton: {
    backgroundColor: magenta,
    borderRadius: 20,
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    marginVertical: "4%",
    marginHorizontal: "2%",
  },
  breakupButtonText: {
    color: "white",
    fontSize: 32,
    fontFamily: "Kurale_400Regular",
  },
  textInput: {
    backgroundColor: attributeGray,
    height: "30%",
    width: "90%",
    borderRadius: 10,
    padding: "5%",
    maxHeight: "30%",
    // flex: 1,
    // paddingBottom: "40%",
  },
  cancelButton: {
    backgroundColor: darkPurple,
    borderRadius: 20,
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    marginVertical: "4%",
    marginHorizontal: "2%",
  },
  heartRating: {
    width: 40,
    height: 40,
    marginVertical: "2%",
    backgroundColor: "#FDB0C0",
  },
  heartContainer: {
    width: (screenWidth / 10) * scale,
    height: ((4 * screenWidth) / 50) * scale,
    justifyContent: "center",
    alignItems: "center",
  },
  heartLeft: {
    width: 0.079 * screenWidth * scale,
    height: (screenWidth / 20) * scale,
    backgroundColor: "#FDB0C0",
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    left: 0,
  },
  heartRight: {
    width: 0.079 * screenWidth * scale,
    height: (screenWidth / 20) * scale,
    backgroundColor: "#FDB0C0",
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    transform: [{ rotate: "-45deg" }],
    position: "absolute",
    right: 0,
  },
  brokenHeart: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: "-20%",
  },
});
