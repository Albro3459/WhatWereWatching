import { Text, View, Image, TouchableOpacity, Animated, ScrollView, TextInput, StyleSheet} from "react-native";
import React, { useState } from "react";
import { Link, Href } from "expo-router"
import { Colors } from "@/constants/Colors";

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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: Colors.backgroundColor }}>
            // white rectangle (no absolute positioning now)
            <Animated.View style={[styles.animatedView, {height: animatedHeight}]} >
                {/* Top Section with welcome text and image */}
                <View style={styles.textContainer}>
                    <Text style={{ fontSize: 32 }}>Welcome to</Text>

                    <Text style={styles.appNameText}>What We're Watching</Text>

                </View>

                {/* Button container */}
                <View style={styles.buttonContainer} >
                    {/* Sign In Button */}
                    <Link href="./LandingPage" asChild>
                        <TouchableOpacity style={styles.button} >
                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>ENTER</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    animatedView: {
        width: 350,
        height: 450, // Bind the animated value to the height
        backgroundColor: "white",
        borderRadius: 16,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 20,
        marginTop: 100, // Added a margin to space it from the top
        alignSelf: "center"
    },
    textContainer: { 
        alignItems: "center", 
        textAlign: "center",
        justifyContent: "center",
        paddingTop: 40 
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 75
    },
    appNameText: {
        padding: 20,
        fontSize: 52, 
        fontFamily: 'Raleway_800ExtraBold', 
        color: Colors.backgroundColor,
        alignSelf: "center",
        flexWrap: "wrap",
        textAlign: "center"
    },
    button: {
        backgroundColor: Colors.buttonColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        width: 200,
        height: 100,
        justifyContent: "center",
        alignItems: "center"
    },
});