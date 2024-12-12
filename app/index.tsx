import { Text, View, Image, TouchableOpacity, Animated, ScrollView, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Keyboard, Dimensions} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Link, Href, usePathname, router } from "expo-router"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Colors } from "@/constants/Colors";
import { KuraleFont, RalewayFont } from "@/styles/appStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Global, LogoutUser, SignInReset } from "@/Global";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Index() {
    // const pathname = usePathname();

    const [inputUsername, setInputUsername] = useState<string>("");
    const [inputPassword, setInputPassword] = useState<string>("");
    const [inputConfirmPassword, setInputConfirmPassword] = useState<string>("");
  
    // State to manage if the user is signing in or signing up
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
  
    // Create an Animated value to handle the height change
    const animatedHeight = useState(new Animated.Value(470))[0];

    const handleSignIn = async () => {
        if (!inputUsername.trim() || !inputPassword) {
          Alert.alert("Error", "Please enter a username and password.");
          return;
        }

        SignInReset();
        
        Global.username = inputUsername.trim();
        Global.password = inputPassword;

        Global.justSignedIn = true;

        router.push('/LandingPage');
    };
    
      // Toggle function to expand or collapse the white rectangle
      const handleSignInPress = async () => {        
        setIsSigningIn(true);
        setIsSigningUp(false);
        // Animate the height change
        Animated.timing(animatedHeight, {
          toValue: 625, // Toggle between 465px and 615px
          duration: 500, // Animation duration (in milliseconds)
          useNativeDriver: false,
        }).start();
      };
    
      const handleSignUp = async () => {
        await LogoutUser();
        if (!inputUsername || !inputPassword || !inputConfirmPassword) {
          Alert.alert("Error", "Please fill out all fields.");
          return;
        }
        if (inputPassword !== inputConfirmPassword) {
          Alert.alert("Error", "Passwords Must Match.");
          return;
        }
    
        // if (inputPassword.length < 6 || inputConfirmPassword.length < 6) {
        //   Alert.alert("Error", "Passwords Must Be At Least 6 Characters.");
        //   return;
        // }
        SignInReset();
        Global.username = inputUsername;
        Global.password = inputPassword;

        Global.justSignedUp = true;
        
        router.push('/ProfilePage');
      };
    
      // Toggle function to expand or collapse the white rectangle
      const handleSignUpPress = async () => {
        setIsSigningUp(true);
        setIsSigningIn(false);
        // Animate the height change
        Animated.timing(animatedHeight, {
          toValue: 660, // Toggle between 465px and 665px
          duration: 500, // Animation duration (in milliseconds)
          useNativeDriver: false,
        }).start();
      };

    useEffect(() => {

    }, [])

    return (
        // <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: Colors.backgroundColor, padding: "5%" }}>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: Colors.backgroundColor, padding: "5%" }}>
            <Animated.View // white rectangle (no absolute positioning now)
                style={{
                height: animatedHeight,
                backgroundColor: "white",
                borderRadius: 15,
                marginTop: screenHeight*0.15, // Added a margin to space it from the top
                }}
            >
                {/* Top Section with welcome text and image */}
                <View style={{ alignItems: "center", paddingTop: 30 }}>
                    <View style={[styles.textContainer, (isSigningIn || isSigningUp) && {paddingBottom: 0}]}>
                        <Text style={{ fontSize: 30 }}>This is</Text>

                        <Text style={styles.appNameText}>What We're Watching</Text>

                    </View>

                    {/*Username and password entry*/}
                    {(isSigningIn || isSigningUp) && (
                    <View style={styles.inputContainer}>
                        <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.textField}
                            placeholder="Username"
                            placeholderTextColor={Colors.italicTextColor}
                            value={inputUsername}
                            onChangeText={setInputUsername}
                            autoCapitalize="none"
                        />
                        {isSigningIn && (
                            <Text style={styles.italicText}>Forgot Username?</Text>
                        )}
                        </View>

                        <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.textField}
                            placeholder="Password"
                            placeholderTextColor={Colors.italicTextColor}
                            value={inputPassword}
                            onChangeText={setInputPassword}
                            secureTextEntry={true}
                            onSubmitEditing={async () => { await handleSignIn(); }}
                            submitBehavior={isSigningUp ? null : isSigningIn ? "submit" : null}
                        />
                        {isSigningIn && (
                            <Text style={styles.italicText}>Forgot Password?</Text>
                        )}
                        </View>

                        {/*Confirm password entry*/}
                        {isSigningUp && (
                        <View style={styles.inputGroup}>
                            <TextInput
                              style={styles.textField}
                              placeholder="Confirm Password"
                              placeholderTextColor={Colors.italicTextColor}
                              value={inputConfirmPassword}
                              onChangeText={setInputConfirmPassword}
                              secureTextEntry={true}
                            />
                        </View>
                        )}
                    </View>
                    )}

                    {/* Button container */}
                    <View style={styles.buttonContainer}>
                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={{
                            ...styles.button,
                            ...(isSigningUp && styles.smallButton), // Manually merge styles
                            }}
                            onPress={
                              !isSigningUp && isSigningIn ? async () => { await handleSignIn(); } : async () => { await handleSignInPress(); }
                            }
                        >
                            <Text
                            style={[styles.buttonText, isSigningUp && styles.smallButtonText]}
                            >
                            SIGN IN
                            </Text>
                        </TouchableOpacity>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={{
                            ...styles.button,
                            ...(isSigningIn && styles.smallButton), // Manually merge styles
                            }}
                            onPress={
                            !isSigningIn && isSigningUp ? async () => { await handleSignUp(); } : async () => { await handleSignUpPress(); }
                            }
                        >
                            <Text
                            style={[styles.buttonText, isSigningIn && styles.smallButtonText]}
                            >
                            SIGN UP
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    textContainer: { 
        alignItems: "center", 
        textAlign: "center",
        justifyContent: "center",
        paddingTop: 20,
        paddingBottom: 50 
    },
    appNameText: {
        paddingTop: 10,
        fontSize: 52, 
        fontFamily: RalewayFont, 
        color: Colors.backgroundColor,
        alignSelf: "center",
        flexWrap: "wrap",
        textAlign: "center"
    },
    background: {
        backgroundColor: Colors.backgroundColor,
        // paddingHorizontal: "5%",
        padding: "5%",
      },
      inputContainer: {
        width: "100%",
        backgroundColor: "white",
        paddingTop: 20,
        // marginBottom: -15,
        borderRadius: 15,
      },
      inputGroup: {
        width: "87.5%",
        alignSelf: "center",
        marginBottom: 10,
      },
      textField: {
        backgroundColor: Colors.grayCell,
        width: "100%",
        height: 50,
        borderRadius: 15,
        marginBottom: 20,
        fontSize: 18,
        color: Colors.tabBarColor,
        padding: 10,
        textAlign: "left",
      },
      buttonContainer: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: "5%",
        justifyContent: "center",
        rowGap: 15,
        alignSelf: "center",
        marginTop: 70,
      },
      button: {
        backgroundColor: Colors.buttonColor,
        width: 225,
        height: 70,
        borderRadius: 15,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        shadowRadius: 10,
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5, // Added for Android compatibility
      },
      smallButton: {
        width: 225 * 0.7,
        height: 70 * 0.7,
        alignSelf: "center",
      },
      bigText: {
        fontSize: 54,
        fontFamily: KuraleFont,
      },
      italicText: {
        color: Colors.reviewTextColor,
        fontStyle: "italic",
        alignSelf: "flex-start",
        paddingLeft: 20,
        paddingBottom: 15,
        marginTop: -10,
      },
      buttonText: {
        color: "white",
        fontSize: 35,
        fontFamily: RalewayFont,
      },
      smallButtonText: {
        fontSize: 35 * 0.7,
      },
});