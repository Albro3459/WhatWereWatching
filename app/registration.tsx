import { Text, View, Image, TouchableOpacity, Animated, ScrollView, TextInput, StyleSheet, Pressable, Alert} from "react-native";
import Feather from '@expo/vector-icons/Feather'
import React, { useState } from 'react';
import * as ImagePicker from "expo-image-picker"
import { Link, Href } from "expo-router"

export default function Registration() {


    const populateArray = (reactArray: string[]) => {
        const newArr = new Array(reactArray.length);
        for (let i = 0; i < reactArray.length; i++) {
            newArr[i] = reactArray[i];
        }
        return newArr;
    };



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

    const [selectedAttributes, setSelectedAttributes] = useState(new Set());

    const toggleSelection = (attribute: any) => {
        setSelectedAttributes((prevSelected) => {
            const updatedSelected = new Set(prevSelected);
            if (updatedSelected.has(attribute)) {
                updatedSelected.delete(attribute); // Unselect
            } else {
                updatedSelected.add(attribute); // Select
            }
            return updatedSelected;
        });
    };

    // State for each section's eye icon
    const [pronounsIconName, setPronounsIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [orientationIconName, setOrientationIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [languageIconName, setLanguageIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [religionIconName, setReligionIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [educationIconName, setEducationIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [hobbiesIconName, setHobbiesIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [musicIconName, setMusicIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [zodiacIconName, setZodiacIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [petsIconName, setPetsIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [dietIconName, setDietIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [icksIconName, setIcksIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [substanceIconName, setSubstanceIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [photosIconName, setPhotosIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [videoIconName, setVideoIconName] = useState<React.ComponentProps<typeof Feather>['name']>("eye");

    // Individualized handler functions for toggling the eye icon state
    const handlePronounsEyePress = () => {
        setPronounsIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handleOrientationEyePress = () => {
        setOrientationIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handleLanguageEyePress = () => {
        setLanguageIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handleReligionEyePress = () => {
        setReligionIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handleEducationEyePress = () => {
        setEducationIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handleHobbiesEyePress = () => {
        setHobbiesIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handleMusicEyePress = () => {
        setMusicIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handleZodiacEyePress = () => {
        setZodiacIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handlePetsEyePress = () => {
        setPetsIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handleDietEyePress = () => {
        setDietIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handleIcksEyePress = () => {
        setIcksIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handleSubstanceEyePress = () => {
        setSubstanceIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handlePhotosEyePress = () => {
        setPhotosIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };
    const handleVideoEyePress = () => {
        setVideoIconName(prevIconName => (prevIconName === "eye" ? "eye-off" : "eye"));
    };


    return (

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: "#FFD3EE" }}>

            <Text style={{marginTop: 15, fontSize: 20, alignSelf:"center" }}>Let's get started!</Text>
            
            {/* white rectangle*/}
            <View 
                style={{
                    flex: 1,
                    width: 350,
                    backgroundColor: "white",
                    borderRadius: 16,
                    paddingTop: 20,
                    paddingBottom: 20,
                    marginTop: 5, 
                    marginBottom: 10,
                    alignSelf: "center"
                }}
            >

                {/*div for content within rectangle*/}
                <View
                    style={{
                        alignSelf: "stretch",
                        marginLeft: 15,
                        marginRight: 15
                    }}
                >
                    <TextInput
                        style={styles.singleLineTextInput}
                        placeholder="Name"
                        placeholderTextColor="gray"
                    />

                    <TextInput
                        style={styles.singleLineTextInput}
                        placeholder="Birthday"
                        placeholderTextColor="gray"
                    />


                    <TextInput
                        style={styles.singleLineTextInput}
                        placeholder="Location"
                        placeholderTextColor="gray"
                    />
                </View>
            </View>

            <View style={styles.separatorLine}></View>

            {/* white rectangle*/}
            <View
                style={{
                    flex: 1,
                    width: 350,
                    backgroundColor: "white",
                    borderRadius: 16,
                    paddingTop: 20,
                    paddingBottom: 20,
                    marginTop: 5,
                    marginBottom: 10,
                    alignSelf: "center"
                }}
            >

                {/*div for content within rectangle*/}
                <View
                    style={{
                        alignSelf: "stretch",
                        marginLeft: 15,
                        marginRight: 15
                    }}
                >

                    <Text style={styles.sectionHeader}>Bio:</Text>
                    <TextInput
                        style={{
                            height: 150,
                            borderRadius: 16,
                            paddingHorizontal: 10,
                            textAlign: "left",
                            backgroundColor: "#ECE6F0",
                            marginBottom: 5,
                            marginTop: 5,
                            fontSize: 15,
                            paddingTop: 10,
                            paddingBottom: 10,
                            paddingLeft: 10,
                            paddingRight: 10
                        }}
                        placeholder="What else do you want people to know about you?"
                        placeholderTextColor="gray"
                        multiline={true}
                    />
                </View>
            </View>

            <View style={styles.separatorLine}></View>

            {/* white rectangle*/}
            <View
                style={{
                    flex: 1,
                    width: 350,
                    backgroundColor: "white",
                    borderRadius: 16,
                    paddingTop: 20,
                    paddingBottom: 20,
                    marginTop: 5,
                    marginBottom: 10,
                    alignSelf: "center"
                }}
            >

                {/*div for content within rectangle*/}
                <View
                    style={{
                        alignSelf: "stretch",
                        marginLeft: 15,
                        marginRight: 15
                    }}
                >

                    <TextInput
                        style={styles.singleLineTextInput}
                        placeholder="Hometown"
                        placeholderTextColor="gray"
                    />

                    <TextInput
                        style={styles.singleLineTextInput}
                        placeholder="Occupation"
                        placeholderTextColor="gray"
                    />
                </View>
            </View>

            <View style={styles.separatorLine}></View>

            {/* white rectangle*/}
            <View
                style={{
                    flex: 1,
                    width: 350,
                    backgroundColor: "white",
                    borderRadius: 16,
                    paddingTop: 20,
                    paddingBottom: 20,
                    marginTop: 5,
                    marginBottom: 10,
                    alignSelf: "center"
                }}
            >

                {/*div for content within rectangle*/}
                <View
                    style={{
                        alignSelf: "stretch",
                        marginLeft: 15,
                        marginRight: 15
                    }}
                >

                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Photos:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handlePhotosEyePress} style={styles.headerButtons}>
                                    <Feather name={photosIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.photoView}>
                        <Image style={{
                            height: 200,
                            width: 100,
                            borderRadius: 24
                        }}
                            source={require('../assets/images/stockPhoto1.jpg')}
                        />
                        <Image style={{
                            height: 200,
                            width: 100,
                            borderRadius: 24
                        }}
                            source={require('../assets/images/stockPhoto2.jpg')}
                        /> 
                        <Image style={{
                            height: 200,
                            width: 100,
                            borderRadius: 24
                        }}
                            source={require('../assets/images/stockPhoto3.jpg')}
                        /> 
                        <Image style={{
                            height: 200,
                            width: 100,
                            borderRadius: 24
                        }}
                            source={require('../assets/images/stockPhoto4.jpg')}
                        /> 
                        <Image style={{
                            height: 200,
                            width: 100,
                            borderRadius: 24
                        }}
                            source={require('../assets/images/addMediaImage.png')}
                        /> 
                    </View>



                </View>
            </View>

            <View style={styles.separatorLine}></View>

            {/* white rectangle*/}
            <View
                style={{
                    flex: 1,
                    width: 350,
                    backgroundColor: "white",
                    borderRadius: 16,
                    paddingTop: 20,
                    paddingBottom: 20,
                    marginTop: 5,
                    marginBottom: 10,
                    alignSelf: "center"
                }}
            >

                {/*div for content within rectangle*/}
                <View
                    style={{
                        alignSelf: "stretch",
                        marginLeft: 15,
                        marginRight: 15
                    }}
                >

                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Personal Video:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handleVideoEyePress} style={styles.headerButtons}>
                                    <Feather name={videoIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.photoView}>
                        <Image style={{
                            height: 200,
                            width: 100,
                            borderRadius: 24
                        }}
                            source={require('../assets/images/addMediaImage.png')}
                        />
                    </View>
                </View>
            </View>


            <View style={{
                flex: 1,
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center"
            }}>

                <Link href="./LandingPage" asChild>
                    <TouchableOpacity
                        style={styles.bottomButton}
                    >
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>SAVE</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="./index" asChild>
                <TouchableOpacity
                    style={[styles.bottomButton, { backgroundColor: "#FF2452"}]}
                >
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>CANCEL</Text>
                </TouchableOpacity>
                </Link>
            </View>

        </ScrollView>

    );
}

const styles = StyleSheet.create({
    singleLineTextInput: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        textAlign: "left",
        backgroundColor: "#ECE6F0",
        marginBottom: 15,
        fontSize: 15
    },

    sectionHeader: {
        fontSize: 20,
        paddingLeft: 5,
        fontWeight: "bold"
    },

    attribute: {
        borderRadius: 30,
        paddingHorizontal: "4%",
        paddingVertical: "4%",
        backgroundColor: "#ECE6F0"
    },

    attributeView: {
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "flex-start",
        rowGap: 10,
        columnGap: 12,
        paddingHorizontal: "2%",
        paddingVertical: "3%",
    },

    separatorLine: {
        height: "0.05%",
        backgroundColor: "gray", // Customize the color as needed
        marginVertical: 10, // Adjust spacing as needed
        width: "90%",
        alignSelf: "center",
    },

    attributeName: {
        fontSize: 24,
        padding: "1%",
    },

    attributeViewSingle: {
        flexDirection: "row",
        columnGap: 5,
    },

    attributeText: {
        fontSize: 16,
        color: "#49454F",
    },

    headerContainer: {
        flex: 1,
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between"
    },

    eyeContainer: {
        justifyContent: "center",
        alignItems: "flex-end"
    },

    headerButtons: {
        marginLeft: 10,
        marginRight: 5
    },

    selectedAttribute: {
        backgroundColor: "#6750A4"
    },

    selectedAttributeText: {
        color: "white"
    },

    photoView: {
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "flex-start",
        rowGap: 5,
        columnGap: 5,
        paddingHorizontal: "1.5%",
        paddingVertical: "3%",
    },

    bottomButton: {
        backgroundColor: "#6750A4",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 30,
        width: 125,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
        marginRight:5
    }
});