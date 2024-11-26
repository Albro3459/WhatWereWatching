import { Text, View, Image, TouchableOpacity, Animated, ScrollView, TextInput} from "react-native";
import React, { useState } from "react";
import { Link, Href } from "expo-router"

export default function Index() {

    // State to manage the height of the white rectangle
    const [isExpanded, setIsExpanded] = useState(false);

    // Create an Animated value to handle the height change
    const animatedHeight = useState(new Animated.Value(500))[0]; // Start at 500px height

    // Toggle function to expand or collapse the white rectangle
    const handleSignInPress = () => {
        setIsExpanded(!isExpanded);
        // Animate the height change
        Animated.timing(animatedHeight, {
            toValue: isExpanded ? 450 : 600, // Toggle between 500px and 600px
            duration: 500, // Animation duration (in milliseconds)
            useNativeDriver: false // Use native driver for better performance
        }).start();
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: "#FFD3EE" }}>
            <Animated.View // white rectangle (no absolute positioning now)
                style={{
                    width: 350,
                    height: animatedHeight, // Bind the animated value to the height
                    backgroundColor: "white",
                    borderRadius: 16,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingTop: 20,
                    paddingBottom: 20,
                    marginTop: 100, // Added a margin to space it from the top
                    alignSelf: "center"
                }}
            >
                {/* Top Section with welcome text and image */}
                <View style={{ alignItems: "center", paddingTop: 30 }}>
                    <Text style={{ fontSize: 32 }}>Welcome to</Text>

                    <Image
                        style={{
                            width: 325,
                            height: 100
                        }}
                        source={require('../assets/images/TheCatchText.png')}
                    />
                </View>

                {/*Username and password entry*/}
                {isExpanded && (
                    <View style={{ marginTop: 20, paddingHorizontal: 20, alignItems: "flex-start" }}>
                        <TextInput
                            style={{
                                height: 40,
                                width: 250,
                                borderColor: 'white',
                                borderWidth: 1,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                marginTop: 10,
                                textAlign: "left",
                                backgroundColor: "#ECE6F0",
                            }}
                            placeholder="Username"
                            placeholderTextColor="black"
                        />
                        <Text style={{ fontStyle: "italic", marginBottom: 10 }}>Forgot Username?</Text>

                        <TextInput
                            style={{
                                height: 40,
                                width: 250,
                                borderColor: 'white',
                                borderWidth: 1,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                marginTop: 10,
                                textAlign: "left",
                                backgroundColor: "#ECE6F0",
                            }}
                            placeholder="Password"
                            placeholderTextColor="black"
                        />
                        <Text style={{ fontStyle: "italic", marginBottom: 10 }}>Forgot Password?</Text>
                    </View>
                )}

                {/* Button container */}
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        marginBottom: 20
                    }}
                >
                    {/* Sign In Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#6750A4",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 10,
                            marginTop: 10,
                            width: 175,
                            height: 75,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onPress={handleSignInPress}
                    >
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>SIGN IN</Text>
                    </TouchableOpacity>

                    {/* Sign Up Button */}
                    <Link href="./registration" asChild>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#6750A4",
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                                marginTop: 10,
                                width: 175,
                                height: 75,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>SIGN UP</Text>
                            </TouchableOpacity>
                    </Link>

                    {/*Test Page*/}
                    <Link href="./registration" asChild>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#6750A4",
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 10,
                                marginTop: 10,
                                width: 175,
                                height: 75,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>Test</Text>
                            </TouchableOpacity>
                    </Link>
                </View>
            </Animated.View>

            {/* Bottom Logo Image */}
            <View style={{ alignItems: "center", marginTop: 20 }}>
                <Image
                    style={{
                        width: 200,
                        height: 200,
                    }}
                    source={require('../assets/images/TheCatchLogo.png')}
                />
            </View>
        </ScrollView>
    );
}
