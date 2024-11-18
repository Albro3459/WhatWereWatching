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



    //pronoun options
    const [pronouns, setPronouns] = useState<string[]>(["She/Her", "They/Them", "He/Him", "Other"]);
    const addPronoun = (newAttribute: string) => {
        setPronouns((prevPronouns) => [...prevPronouns, newAttribute]); 
    };

    //orientatino options
    const [orientations, setOrientations] = useState<string[]>(["Straight", "Gay", "Lesbian", "Pansexual", "Bisexual"]);
    const addOrientation = (newAttribute: string) => {
        setPronouns((prevOrientations) => [...prevOrientations, newAttribute]);
    };

    //language options
    const [languages, setLanguages] = useState<string[]>(["English", "Spanish", "Japanese", "Chinese", "Mandarin"]);
    const addLanguage = (newAttribute: string) => {
        setLanguages((prevLanguages) => [...prevLanguages, newAttribute]); 
    };

    //religion options
    const [religions, setReligions] = useState<string[]>(["Christian", "Jewish", "Hindu", "Islamic", "Spiritual", "Agnostic"]);
    const addReligion = (newAttribute: string) => {
        setReligions((prevReligions) => [...prevReligions, newAttribute]); 
    };

    //education options
    const [educations, setEducations] = useState<string[]>(["Bachelors", "High School", "Masters"]);
    const addEducation = (newAttribute: string) => {
        setEducations((prevEducations) => [...prevEducations, newAttribute]);
    };

    //hobby options
    const [hobbies, setHobbies] = useState<string[]>(["Football", "Reading", "Gym"]);
    const addHobby = (newAttribute: string) => {
        setHobbies((prevHobbies) => [...prevHobbies, newAttribute]);
    };

    //music options
    const [musics, setMusics] = useState<string[]>(["Rap", "Rock", "Pop", "Country", "Classical", "Indie", "R&B"]);
    const addMusic = (newAttribute: string) => {
        setMusics((prevMusics) => [...prevMusics, newAttribute]);
    };

    //zodiac options
    const [zodiacs, setZodiacs] = useState<string[]>(["Virgo"]);
    const addZodiac = (newAttribute: string) => {
        setZodiacs((prevZodiacs) => [...prevZodiacs, newAttribute]);
    };

    //pet options
    const [pets, setPets] = useState<string[]>(["Dog", "Cat"]);
    const addPet = (newAttribute: string) => {
        setPets((prevPets) => [...prevPets, newAttribute]);
    };

    //diet options
    const [diets, setDiets] = useState<string[]>(["Vegan", "Keto", "None"]);
    const addDiet = (newAttribute: string) => {
        setDiets((prevDiets) => [...prevDiets, newAttribute]);
    };

    //ick options
    const [icks, setIcks] = useState<string[]>(["Bad hygiene", "Poor driver", "Low tipper"]);
    const addIck = (newAttribute: string) => {
        setIcks((prevIcks) => [...prevIcks, newAttribute]);
    };

    //substance options
    const [substances, setSubstances] = useState<string[]>(["Alcohol", "Smoking", "Cannabis", "Sober", "Sober Curious"]);
    const addSubstance = (newAttribute: string) => {
        setSubstances((prevSusbtances) => [...prevSusbtances, newAttribute]);
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

                    {/*Pronouns*/}
                    <View style={ styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Pronouns:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handlePronounsEyePress} style={styles.headerButtons }>
                                    <Feather name={pronounsIconName} size={28} color="black"/>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.attributeView}>
                        {populateArray(pronouns).map((pronoun) =>
                            <Pressable onPress={() => toggleSelection(pronoun)} style={[styles.attribute, selectedAttributes.has(pronoun) && styles.selectedAttribute]}>
                                <Text style={[styles.attributeText, selectedAttributes.has(pronoun) && styles.selectedAttributeText]}>{pronoun}</Text>
                            </Pressable>
                        )}
                    </View>

                    {/*Orientation*/}
                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Orientation:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handleOrientationEyePress} style={styles.headerButtons}>
                                    <Feather name={orientationIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.attributeView}>
                        {populateArray(orientations).map((orientation) =>
                            <Pressable onPress={() => toggleSelection(orientation)} style={[styles.attribute, selectedAttributes.has(orientation) && styles.selectedAttribute]}>
                                <Text style={[styles.attributeText, selectedAttributes.has(orientation) && styles.selectedAttributeText]}>{orientation}</Text>
                            </Pressable>
                        )}
                    </View>

                    {/*Languages*/ }
                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Languages:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={() => HandleAddAttributePress(addLanguage)}>
                                    <Feather name="plus-circle" size={28} color="#6750A4" />
                                </Pressable>
                            </View>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handleLanguageEyePress} style={styles.headerButtons}>
                                    <Feather name={languageIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.attributeView}>
                        {populateArray(languages).map((language) =>
                            <Pressable onPress={() => toggleSelection(language)} style={[styles.attribute, selectedAttributes.has(language) && styles.selectedAttribute]}>
                                <Text style={[styles.attributeText, selectedAttributes.has(language) && styles.selectedAttributeText]}>{language}</Text>
                            </Pressable>
                        )}
                    </View>

                    {/*Religion*/ }
                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Religion:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={() => HandleAddAttributePress(addReligion)}>
                                    <Feather name="plus-circle" size={28} color="#6750A4" />
                                </Pressable>
                            </View>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handleReligionEyePress} style={styles.headerButtons}>
                                    <Feather name={religionIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.attributeView}>
                        {populateArray(religions).map((religion) =>
                            <Pressable onPress={() => toggleSelection(religion)} style={[styles.attribute, selectedAttributes.has(religion) && styles.selectedAttribute]}>
                                <Text style={[styles.attributeText, selectedAttributes.has(religion) && styles.selectedAttributeText]}>{religion}</Text>
                            </Pressable>
                        )}
                    </View>

                    {/*Education*/ }
                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Education:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={() => HandleAddAttributePress(addEducation)}>
                                    <Feather name="plus-circle" size={28} color="#6750A4" />
                                </Pressable>
                            </View>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handleEducationEyePress} style={styles.headerButtons}>
                                    <Feather name={educationIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.attributeView}>
                        {populateArray(educations).map((education) =>
                            <Pressable onPress={() => toggleSelection(education)} style={[styles.attribute, selectedAttributes.has(education) && styles.selectedAttribute]}>
                                <Text style={[styles.attributeText, selectedAttributes.has(education) && styles.selectedAttributeText]}>{education}</Text>
                            </Pressable>
                        )}
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

                    {/*Hobbies*/}
                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Hobbies:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={() => HandleAddAttributePress(addHobby)}>
                                    <Feather name="plus-circle" size={28} color="#6750A4" />
                                </Pressable>
                            </View>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handleHobbiesEyePress} style={styles.headerButtons}>
                                    <Feather name={hobbiesIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.attributeView}>
                        {populateArray(hobbies).map((hobby) =>
                            <Pressable onPress={() => toggleSelection(hobby)} style={[styles.attribute, selectedAttributes.has(hobby) && styles.selectedAttribute]}>
                                <Text style={[styles.attributeText, selectedAttributes.has(hobby) && styles.selectedAttributeText]}>{hobby}</Text>
                            </Pressable>
                        )}
                    </View>

                    {/*Music*/}
                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Music:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={() => HandleAddAttributePress(addMusic)}>
                                    <Feather name="plus-circle" size={28} color="#6750A4" />
                                </Pressable>
                            </View>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handleMusicEyePress} style={styles.headerButtons}>
                                    <Feather name={musicIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.attributeView}>
                        {populateArray(musics).map((music) =>
                            <Pressable onPress={() => toggleSelection(music)} style={[styles.attribute, selectedAttributes.has(music) && styles.selectedAttribute]}>
                                <Text style={[styles.attributeText, selectedAttributes.has(music) && styles.selectedAttributeText]}>{music}</Text>
                            </Pressable>
                        )}
                    </View>

                    {/*Zodiac*/}
                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Zodiac:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handleZodiacEyePress} style={styles.headerButtons}>
                                    <Feather name={zodiacIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.attributeView}>
                        {populateArray(zodiacs).map((zodiac) =>
                            <Pressable onPress={() => toggleSelection(zodiac)} style={[styles.attribute, selectedAttributes.has(zodiac) && styles.selectedAttribute]}>
                                <Text style={[styles.attributeText, selectedAttributes.has(zodiac) && styles.selectedAttributeText]}>{zodiac}</Text>
                            </Pressable>
                        )}
                    </View>

                    {/*Diet*/}
                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Diet:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={() => HandleAddAttributePress(addDiet)}>
                                    <Feather name="plus-circle" size={28} color="#6750A4" />
                                </Pressable>
                            </View>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handleDietEyePress} style={styles.headerButtons}>
                                    <Feather name={dietIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.attributeView}>
                        {populateArray(diets).map((diet) =>
                            <Pressable onPress={() => toggleSelection(diet)} style={[styles.attribute, selectedAttributes.has(diet) && styles.selectedAttribute]}>
                                <Text style={[styles.attributeText, selectedAttributes.has(diet) && styles.selectedAttributeText]}>{diet}</Text>
                            </Pressable>
                        )}
                    </View>

                    {/*Icks*/}
                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Icks:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={() => HandleAddAttributePress(addIck)}>
                                    <Feather name="plus-circle" size={28} color="#6750A4" />
                                </Pressable>
                            </View>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handleIcksEyePress} style={styles.headerButtons}>
                                    <Feather name={icksIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.attributeView}>
                        {populateArray(icks).map((ick) =>
                            <Pressable onPress={() => toggleSelection(ick)} style={[styles.attribute, selectedAttributes.has(ick) && styles.selectedAttribute]}>
                                <Text style={[styles.attributeText, selectedAttributes.has(ick) && styles.selectedAttributeText]}>{ick}</Text>
                            </Pressable>
                        )}
                    </View>

                    {/*Substance*/}
                    <View style={styles.headerContainer}>
                        <Text style={styles.sectionHeader}>Substances:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <View style={styles.eyeContainer}>
                                <Pressable onPress={handleSubstanceEyePress} style={styles.headerButtons}>
                                    <Feather name={substanceIconName} size={28} color="black" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={styles.attributeView}>
                        {populateArray(substances).map((substance) =>
                            <Pressable onPress={() => toggleSelection(substance)} style={[styles.attribute, selectedAttributes.has(substance) && styles.selectedAttribute]}>
                                <Text style={[styles.attributeText, selectedAttributes.has(substance) && styles.selectedAttributeText]}>{substance}</Text>
                            </Pressable>
                        )}
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


                <TouchableOpacity
                    style={[styles.bottomButton, { backgroundColor: "#FF2452"}]}
                >
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>CANCEL</Text>
                </TouchableOpacity>
                
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