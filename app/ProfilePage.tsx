import { Text, TextInput, View, StyleSheet,TouchableOpacity, ScrollView, Image, Button, Pressable, Dimensions, Alert } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PressableBubblesGroup,} from './components/formComponents';
import { Link, Href } from "expo-router"
import { Colors } from "@/constants/Colors";


export default function ProfilePage() {

    const setAttributeTrue = (attribute: string, setState: Dispatch<SetStateAction<Set<string>>>) => {
        setState((prevSelected) => {
            const updatedSet = new Set(prevSelected);
            updatedSet.add(attribute); // Add the attribute, ensuring it's selected
            return updatedSet;
        });
    };

    // State for text inputs
    const [birthdayText, setBirthdayText] = useState('08/24/2002'); // temporary placeholder, will be from the db
    const [locationText, setLocationText] = useState('Baton Rouge, LA'); // temporary placeholder, will be from the db
    const [bioText, setBioText] = useState('I\'m a super cool guy!'); // temporary placeholder, will be from the db

    //pronoun options
    const [pronouns, setPronouns] = useState<string[]>(["Fantasy", "Horror", "Action", "Comedy", "Romantic", "Sci-Fi", "Adventure", "Other"]);
    const addPronoun = (newAttribute: string) => {
        if (pronouns.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedPronouns);
        }
        else {
            setPronouns((prevPronouns) => [...prevPronouns, newAttribute]);
        }
    };

    
    // State for selected attributes
    const [selectedPronouns, setSelectedPronouns] = useState(new Set<string>(['He/Him']));


    // When the user clicks the plus to add a new attribute
    const HandleAddAttributePress = (addHandler: (newAttribute: string) => void) => {
        // Prompt user for the new attribute
        Alert.prompt(
            `Add Attribute`,
            `Enter a new attribute`, // Remove 's' for singular (e.g., "Language")
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: (text) => text && addHandler(text) }
            ],
            "plain-text"
        );
    };

    return (
        <ScrollView style={styles.background}>
            {/* Picture + Name */}
            <View style={styles.topContainer}>
                <Image
                    source={require("../assets/images/ProfilePic.png")}
                    style={styles.image}
                />
                <Text style={[styles.nameText, { marginTop: -55 }]}>John Slade</Text>
            </View>

            {/* First container */}
            <View style={[styles.container, { marginTop: 0 }]}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Birthday:</Text>
                    <Text style={{ color: 'red', marginLeft: 2 }}>*</Text>
                </View>
                <TextInput
                    style={[styles.textField, birthdayText.length > 0 ? styles.selectedTextBox : null]}
                    value={birthdayText}
                    onChangeText={(newText) => setBirthdayText(newText)}
                />

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Location:</Text>
                    <Text style={{ color: 'red', marginLeft: 2 }}>*</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                    </View>
                </View>
                <TextInput
                    style={[styles.textField, locationText.length > 0 ? styles.selectedTextBox : null]}
                    value={locationText}
                    onChangeText={(newText) => setLocationText(newText)}
                />

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Favorite Genres:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <PressableBubblesGroup
                        labels={pronouns}
                        selectedLabels={selectedPronouns}
                        setLabelState={setSelectedPronouns}
                        styles={styles}
                    />
                </View>
            </View>

            <View style={styles.separatorLine}></View>

            {/* Second container */}
            <View style={styles.container}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Bio:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                    </View>
                </View>
                <TextInput
                    style={[styles.textBox, bioText.length > 0 ? styles.selectedTextBox : null]}
                    value={bioText}
                    onChangeText={(newText) => setBioText(newText)}
                    multiline={true}
                />
            </View>

            <View style={styles.separatorLine}></View>

            {/* Button container */}
            <View style={styles.buttonContainer} >
                {/* logout Button */}
                <Link href="./" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>Logout</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* <View style={{ padding: "8%" }}></View> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: Colors.unselectedColor,
        padding: "5%",
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: "contain",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 100,
        shadowRadius: 10,
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,  // Added for Android compatibility
    },
    topContainer: {
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: "5%",
        marginTop: -35,
    },
    container: {
        backgroundColor: "white",
        paddingVertical: "4%",
        borderRadius: 15,
        marginVertical: "5%",
    },
    labelContainer: {
        flexDirection: "row",
        paddingRight: "5%",
    },
    pressableContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "flex-start",
        rowGap: 5,
        columnGap: 5,
        paddingLeft: 20,
        paddingRight: 16,
        marginBottom: 20,
    },
    textField: {
        backgroundColor: Colors.unselectedColor,
        width: 300,
        height: 50,
        borderRadius: 15,
        marginBottom: 20,
        fontSize: 18,
        color: Colors.unselectedTextColor,
        padding: 10,
        textAlign: "left",
        alignSelf: "center",
    },
    textBox: {
        backgroundColor: Colors.unselectedColor,
        width: 300,
        minHeight: 200,
        borderRadius: 15,
        marginBottom: 20,
        fontSize: 18,
        color: Colors.unselectedTextColor,
        padding: 15,
        textAlignVertical: "top",
        alignSelf: "center",
    },
    selectedTextBox: {
        color: "white",
        backgroundColor: Colors.selectedColor,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // for Android
    },
    nameText: {
        fontSize: 35,
        fontFamily: "Kurale_400Regular",
        padding: "1%",
    },
    labelText: {
        color: "black",
        fontSize: 25,
        fontFamily: "Kurale_400Regular",
        // alignSelf: "flex-start",
        paddingBottom: 5,
        paddingLeft: "8%",
    },
    separatorLine: {
        width: "90%",
        height: 1,
        backgroundColor: "black",
        marginVertical: 10,
        alignSelf: "center",
    },
    pressableBubble: {
        borderRadius: 30,
        backgroundColor: Colors.unselectedColor,
        padding: "4%",
    },
    pressableText: {
        fontSize: 16,
        color: Colors.unselectedTextColor,
    },
    selectedBubble: {
        backgroundColor: Colors.selectedColor,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // for Android
    },
    selectedBubbleText: {
        color: "white"
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 75,
        alignItems: "center"
    },
    button: {
        backgroundColor: Colors.backgroundColor,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 10,
        width: 150,
        height: 75,
        justifyContent: "center",
        alignItems: "center"
    }
});