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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: "#2D2350" }}>
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
                <View style={{ alignItems: "center", paddingTop: 40 }}>
                    <Text style={{ fontSize: 32 }}>Welcome to</Text>

                    <Image
                        style={{
                            paddingTop: 20,
                            width: 310,
                            height: 120
                        }}
                        source={require('../assets/images/whatWewatch.png')}
                    />
                </View>

                {/* Button container */}
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        marginBottom: 75
                    }}
                >
                    {/* Sign In Button */}
                    <Link href="./LandingPage" asChild>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#676F9D",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 10,
                            marginTop: 10,
                            width: 200,
                            height: 100,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>ENTER</Text>
                    </TouchableOpacity>
                    </Link>
                </View>
            </Animated.View>
        </ScrollView>
    );
}
