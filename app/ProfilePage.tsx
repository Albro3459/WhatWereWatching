import { Text, TextInput, View, StyleSheet, ScrollView, Image, Button, Pressable, Dimensions, Alert } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as SplashScreen from "expo-splash-screen";
import Feather from '@expo/vector-icons/Feather'
import { useFonts, Kurale_400Regular } from "@expo-google-fonts/kurale";
import { PressableBubblesGroup, EyeToggle } from './components/formComponents';
import { calcZodiacFromDate, isValidDateFormat } from './helpers/calcZodiacFromDate';

var darkRed = "#B0170F";
var magenta = "#FF2452CC"; // 80% opacity from the CC
var pink = "#FFD3EE";
var darkPurple = "#6750A4";
var unselectedCellColor = "#ECE6F0";
var unselectedTextColor = "#49454F";

// TODO:
/*
    Switching between editing

    Obviously integrating a backend and actually loading with data, saving data, and canceling correctly

    Input validation. BOOOO
*/


export default function ProfilePage() {
    useFonts({
        Kurale_400Regular,
    });


    const setAttributeTrue = (attribute: string, setState: Dispatch<SetStateAction<Set<string>>>) => {
        setState((prevSelected) => {
            const updatedSet = new Set(prevSelected);
            updatedSet.add(attribute); // Add the attribute, ensuring it's selected
            return updatedSet;
        });
    };

    // State for text inputs
    const [birthdayText, setBirthdayText] = useState('08/24/2002'); // temporary placeholder, will be from the db
    const [locationText, setLocationText] = useState('S�o Paulo, Brazil'); // temporary placeholder, will be from the db
    const [bioText, setBioText] = useState('I\'m a super cool guy!'); // temporary placeholder, will be from the db
    const [hometownText, setHometownText] = useState('');
    const [occupationText, setOccupationText] = useState('');


    // State for each section's eye icon
    const [locationEyeIcon, setLocationEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [pronounsEyeIcon, setPronounsEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [orientationEyeIcon, setOrientationEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [languageEyeIcon, setLanguageEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [religionEyeIcon, setReligionEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [educationEyeIcon, setEducationEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [bioEyeIcon, setBioEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [hometownEyeIcon, setHometownEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [occupationEyeIcon, setOccupationEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [hobbiesEyeIcon, setHobbiesEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [musicEyeIcon, setMusicEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [zodiacEyeIcon, setZodiacEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [petsEyeIcon, setPetsEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [dietEyeIcon, setDietEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [icksEyeIcon, setIcksEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [substanceEyeIcon, setSubstanceEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [photosEyeIcon, setPhotosEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");
    const [videoEyeIcon, setVideoEyeIcon] = useState<React.ComponentProps<typeof Feather>['name']>("eye");

    // Individualized handler functions for toggling the eye icon state
    const handleLocationEyePress = () => {
        setLocationEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handlePronounsEyePress = () => {
        setPronounsEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleOrientationEyePress = () => {
        setOrientationEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleLanguageEyePress = () => {
        setLanguageEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleReligionEyePress = () => {
        setReligionEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleEducationEyePress = () => {
        setEducationEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleBioEyePress = () => {
        setBioEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleHometownEyePress = () => {
        setHometownEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleOccupationEyePress = () => {
        setOccupationEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleHobbiesEyePress = () => {
        setHobbiesEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleMusicEyePress = () => {
        setMusicEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleZodiacEyePress = () => {
        setZodiacEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handlePetsEyePress = () => {
        setPetsEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleDietEyePress = () => {
        setDietEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleIcksEyePress = () => {
        setIcksEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleSubstanceEyePress = () => {
        setSubstanceEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handlePhotosEyePress = () => {
        setPhotosEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };
    const handleVideoEyePress = () => {
        setVideoEyeIcon(prevEyeIcon => (prevEyeIcon === "eye" ? "eye-off" : "eye"));
    };

    //pronoun options
    const [pronouns, setPronouns] = useState<string[]>(["He/Him", "She/Her", "They/Them", "Other"]);
    const addPronoun = (newAttribute: string) => {
        if (pronouns.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedPronouns);
        }
        else {
            setPronouns((prevPronouns) => [...prevPronouns, newAttribute]);
        }
    };

    //orientation options
    const [orientations, setOrientations] = useState<string[]>(["Straight", "Gay", "Lesbian", "Bisexual", "Pansexual"]);
    const addOrientation = (newAttribute: string) => {
        if (orientations.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedOrientations);
        }
        else {
            setOrientations((prevOrientations) => [...prevOrientations, newAttribute]);
        }
    };

    //language options
    const [languages, setLanguages] = useState<string[]>(["English", "Spanish", "Japanese", "Chinese", "Mandarin"]);
    const addLanguage = (newAttribute: string) => {
        if (languages.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedLanguages);
        }
        else {
            setLanguages((prevLanguages) => [...prevLanguages, newAttribute]);
        }
    };

    //religion options
    const [religions, setReligions] = useState<string[]>(["Christian", "Jewish", "Hindu", "Islamic", "Spiritual", "Agnostic"]);
    const addReligion = (newAttribute: string) => {
        if (religions.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedReligions);
        }
        else {
            setReligions((prevReligions) => [...prevReligions, newAttribute]);
        }
    };

    //education options
    const [educations, setEducations] = useState<string[]>(["Bachelors", "High School", "Masters"]);
    const addEducation = (newAttribute: string) => {
        if (educations.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedEducations);
        }
        else {
            setEducations((prevEducations) => [...prevEducations, newAttribute]);
        }
    };

    //hobby options
    const [hobbies, setHobbies] = useState<string[]>(["Football", "Reading", "Gym"]);
    const addHobby = (newAttribute: string) => {
        if (hobbies.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedHobbies);
        }
        else {
            setHobbies((prevHobbies) => [...prevHobbies, newAttribute]);
        }
    };

    //music options
    const [musics, setMusics] = useState<string[]>(["Rap", "Rock", "Pop", "Country", "Classical", "Indie", "R&B"]);
    const addMusic = (newAttribute: string) => {
        if (musics.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedMusic);
        }
        else {
            setMusics((prevMusics) => [...prevMusics, newAttribute]);
        }
    };

    //zodiac options
    const [zodiac, setZodiac] = useState<string>(calcZodiacFromDate(birthdayText));
    const addZodiac = (newAttribute: string) => {
        setZodiac(newAttribute);
    };
    useEffect(() => {
        if (birthdayText) {
            if (isValidDateFormat(birthdayText)) {
                const sign = calcZodiacFromDate(birthdayText);
                setZodiac(sign);
            }
            else {
                // ALERT: Birthday in incorrect format
                console.log("WACK ZODIAC SIGN CALCULATION");
            }
        }
    }, [birthdayText]);

    //pet options
    const [pets, setPets] = useState<string[]>(["Dogs", "Cats"]);
    const addPet = (newAttribute: string) => {
        if (pets.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedPets);
        }
        else {
            setPets((prevPets) => [...prevPets, newAttribute]);
        }
    };

    //diet options
    const [diets, setDiets] = useState<string[]>(["Vegan", "Keto", "None"]);
    const addDiet = (newAttribute: string) => {
        if (diets.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedDiets);
        }
        else {
            setDiets((prevDiets) => [...prevDiets, newAttribute]);
        }
    };

    //ick options
    const [icks, setIcks] = useState<string[]>(["Bad hygiene", "Bad Driver", "Mean"]);
    const addIck = (newAttribute: string) => {
        if (icks.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedIcks);
        }
        else {
            setIcks((prevIcks) => [...prevIcks, newAttribute]);
        }
    };

    //substance options
    const [substances, setSubstances] = useState<string[]>(["Alcohol", "Smoking", "Cannabis", "Sober", "Sober Curious"]);
    const addSubstance = (newAttribute: string) => {
        if (substances.includes(newAttribute)) {
            setAttributeTrue(newAttribute, setSelectedSubstances);
        }
        else {
            setSubstances((prevSubstances) => [...prevSubstances, newAttribute]);
        }
    };

    // State for selected attributes
    const [selectedPronouns, setSelectedPronouns] = useState(new Set<string>(['He/Him']));
    const [selectedOrientations, setSelectedOrientations] = useState(new Set<string>(['Straight']));
    const [selectedLanguages, setSelectedLanguages] = useState(new Set<string>(['English']));
    const [selectedReligions, setSelectedReligions] = useState(new Set<string>(['Agnostic']));
    const [selectedEducations, setSelectedEducations] = useState(new Set<string>(['Bachelors']));
    const [selectedHobbies, setSelectedHobbies] = useState(new Set<string>(['Football']));
    const [selectedMusic, setSelectedMusic] = useState(new Set<string>(['Pop', 'R&B']));
    const [selectedZodiacs, setSelectedZodiacs] = useState(new Set<string>());
    const [selectedPets, setSelectedPets] = useState(new Set<string>(['Dogs']));
    const [selectedDiets, setSelectedDiets] = useState(new Set<string>(['None']));
    const [selectedIcks, setSelectedIcks] = useState(new Set<string>(['Bad Driver']));
    const [selectedSubstances, setSelectedSubstances] = useState(new Set<string>(['Alcohol']));
    const [selectedPhotos, setSelectedPhotos] = useState(new Set<string>());
    const [selectedVideos, setSelectedVideos] = useState(new Set<string>());


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
                <Text style={[styles.nameText, { marginTop: -55 }]}>Myles Stubbs</Text>
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
                        <EyeToggle
                            icon={locationEyeIcon}
                            onPress={handleLocationEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <TextInput
                    style={[styles.textField, locationText.length > 0 ? styles.selectedTextBox : null]}
                    value={locationText}
                    onChangeText={(newText) => setLocationText(newText)}
                />

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Pronouns:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <EyeToggle
                            icon={pronounsEyeIcon}
                            onPress={handlePronounsEyePress}
                            styles={styles}
                        />
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

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Orientation:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <EyeToggle
                            icon={orientationEyeIcon}
                            onPress={handleOrientationEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <PressableBubblesGroup
                        labels={orientations}
                        selectedLabels={selectedOrientations}
                        setLabelState={setSelectedOrientations}
                        styles={styles}
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Languages:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <View style={styles.eyeContainer}>
                            <Pressable onPress={() => HandleAddAttributePress(addLanguage)}>
                                <Feather name="plus-circle" size={28} color={darkPurple} />
                            </Pressable>
                        </View>
                        <EyeToggle
                            icon={languageEyeIcon}
                            onPress={handleLanguageEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <PressableBubblesGroup
                        labels={languages}
                        selectedLabels={selectedLanguages}
                        setLabelState={setSelectedLanguages}
                        styles={styles}
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Religions:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <View style={styles.eyeContainer}>
                            <Pressable onPress={() => HandleAddAttributePress(addReligion)}>
                                <Feather name="plus-circle" size={28} color={darkPurple} />
                            </Pressable>
                        </View>
                        <EyeToggle
                            icon={religionEyeIcon}
                            onPress={handleReligionEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <PressableBubblesGroup
                        labels={religions}
                        selectedLabels={selectedReligions}
                        setLabelState={setSelectedReligions}
                        styles={styles}
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Education:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <View style={styles.eyeContainer}>
                            <Pressable onPress={() => HandleAddAttributePress(addEducation)}>
                                <Feather name="plus-circle" size={28} color={darkPurple} />
                            </Pressable>
                        </View>
                        <EyeToggle
                            icon={educationEyeIcon}
                            onPress={handleEducationEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <PressableBubblesGroup
                        labels={educations}
                        selectedLabels={selectedEducations}
                        setLabelState={setSelectedEducations}
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
                        <EyeToggle
                            icon={bioEyeIcon}
                            onPress={handleBioEyePress}
                            styles={styles}
                        />
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

            {/* Third container */}
            <View style={styles.container}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Hometown:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <EyeToggle
                            icon={hometownEyeIcon}
                            onPress={handleHometownEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <TextInput
                    style={[styles.textField, hometownText.length > 0 ? styles.selectedTextBox : null]}
                    value={hometownText}
                    onChangeText={(newText) => setHometownText(newText)}
                />

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Occupation:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <EyeToggle
                            icon={occupationEyeIcon}
                            onPress={handleOccupationEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <TextInput
                    style={[styles.textField, occupationText.length > 0 ? styles.selectedTextBox : null]}
                    value={occupationText}
                    onChangeText={(newText) => setOccupationText(newText)}
                />

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Hobbies:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <View style={styles.eyeContainer}>
                            <Pressable onPress={() => HandleAddAttributePress(addHobby)}>
                                <Feather name="plus-circle" size={28} color={darkPurple} />
                            </Pressable>
                        </View>
                        <EyeToggle
                            icon={hobbiesEyeIcon}
                            onPress={handleHobbiesEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <PressableBubblesGroup
                        labels={hobbies}
                        selectedLabels={selectedHobbies}
                        setLabelState={setSelectedHobbies}
                        styles={styles}
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Music:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <View style={styles.eyeContainer}>
                            <Pressable onPress={() => HandleAddAttributePress(addMusic)}>
                                <Feather name="plus-circle" size={28} color={darkPurple} />
                            </Pressable>
                        </View>
                        <EyeToggle
                            icon={musicEyeIcon}
                            onPress={handleMusicEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <PressableBubblesGroup
                        labels={musics}
                        selectedLabels={selectedMusic}
                        setLabelState={setSelectedMusic}
                        styles={styles}
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Zodiac Sign:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <EyeToggle
                            icon={zodiacEyeIcon}
                            onPress={handleZodiacEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <Pressable style={[styles.pressableBubble, styles.selectedBubble]}>
                        <Text style={[styles.pressableText, styles.selectedBubbleText]}>{zodiac}</Text>
                    </Pressable>
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Pets:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <View style={styles.eyeContainer}>
                            <Pressable onPress={() => HandleAddAttributePress(addPet)}>
                                <Feather name="plus-circle" size={28} color={darkPurple} />
                            </Pressable>
                        </View>
                        <EyeToggle
                            icon={petsEyeIcon}
                            onPress={handlePetsEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <PressableBubblesGroup
                        labels={pets}
                        selectedLabels={selectedPets}
                        setLabelState={setSelectedPets}
                        styles={styles}
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Diet:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <View style={styles.eyeContainer}>
                            <Pressable onPress={() => HandleAddAttributePress(addDiet)}>
                                <Feather name="plus-circle" size={28} color={darkPurple} />
                            </Pressable>
                        </View>
                        <EyeToggle
                            icon={dietEyeIcon}
                            onPress={handleDietEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <PressableBubblesGroup
                        labels={diets}
                        selectedLabels={selectedDiets}
                        setLabelState={setSelectedDiets}
                        styles={styles}
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Icks:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <View style={styles.eyeContainer}>
                            <Pressable onPress={() => HandleAddAttributePress(addIck)}>
                                <Feather name="plus-circle" size={28} color={darkPurple} />
                            </Pressable>
                        </View>
                        <EyeToggle
                            icon={icksEyeIcon}
                            onPress={handleIcksEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <PressableBubblesGroup
                        labels={icks}
                        selectedLabels={selectedIcks}
                        setLabelState={setSelectedIcks}
                        styles={styles}
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Substances:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <EyeToggle
                            icon={substanceEyeIcon}
                            onPress={handleSubstanceEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.pressableContainer}>
                    <PressableBubblesGroup
                        labels={substances}
                        selectedLabels={selectedSubstances}
                        setLabelState={setSelectedSubstances}
                        styles={styles}
                    />
                </View>

            </View>

            <View style={styles.separatorLine}></View>

            {/* Fourth container: Photos */}
            <View style={styles.container}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Photos:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <EyeToggle
                            icon={photosEyeIcon}
                            onPress={handlePhotosEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.photosContainer}>
                    <View style={styles.photoShadow}>
                        <Image style={styles.photo}
                            source={require('../assets/images/stockPhoto1.jpg')}
                        />
                    </View>
                    <View style={styles.photoShadow}>
                        <Image style={styles.photo}
                            source={require('../assets/images/stockPhoto2.jpg')}
                        />
                    </View>
                    <View style={styles.photoShadow}>
                        <Image style={styles.photo}
                            source={require('../assets/images/stockPhoto3.jpg')}
                        />
                    </View>
                    <View style={styles.photoShadow}>
                        <Image style={styles.photo}
                            source={require('../assets/images/stockPhoto4.jpg')}
                        />
                    </View>

                    <View style={styles.svgContainer}>
                        <Image style={{
                            height: "100%",
                            width: "100%",
                            borderRadius: 8
                        }}
                            source={require('../assets/images/addMediaImage.png')}
                        /> 
                    </View>
                </View>
            </View>

            <View style={styles.separatorLine}></View>

            {/* Fifth container: Video */}
            <View style={styles.container}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Personal Video:</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                        <EyeToggle
                            icon={photosEyeIcon}
                            onPress={handlePhotosEyePress}
                            styles={styles}
                        />
                    </View>
                </View>
                <View style={styles.photosContainer}>
                    <View style={styles.svgContainer}>
                        <Image style={{
                            height: "100%",
                            width: "100%",
                            borderRadius: 8
                        }}
                            source={require('../assets/images/addMediaImage.png')}
                        /> 
                    </View>
                </View>
            </View>


            <View style={styles.buttonContainer}>
                <Pressable style={styles.saveButton}>
                    <Text style={styles.buttonText}>Save</Text>
                </Pressable>
                <Pressable style={styles.cancelButton}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
            </View>

            <View style={{ padding: "8%" }}></View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: pink,
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
    photosContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "flex-start",
        rowGap: 5,
        columnGap: 5,
        paddingHorizontal: 20,
        // paddingVertical: "3%",
    },
    svgContainer: {
        width: "32%",
        aspectRatio: 11 / 16,
        borderColor: "black",
        borderWidth: .5,
        borderRadius: 10,
    },
    photo: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    photoShadow: {
        width: "32%",
        aspectRatio: 11 / 16,

        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // for Android
    },
    textField: {
        backgroundColor: unselectedCellColor,
        width: 300,
        height: 50,
        borderRadius: 15,
        marginBottom: 20,
        fontSize: 18,
        color: unselectedTextColor,
        padding: 10,
        textAlign: "left",
        alignSelf: "center",
    },
    textBox: {
        backgroundColor: unselectedCellColor,
        width: 300,
        minHeight: 200,
        borderRadius: 15,
        marginBottom: 20,
        fontSize: 18,
        color: unselectedTextColor,
        padding: 15,
        textAlignVertical: "top",
        alignSelf: "center",
    },
    selectedTextBox: {
        color: "white",
        backgroundColor: darkPurple,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // for Android
    },
    bigText: {
        fontSize: 30,
        padding: "1%",
    },
    nameText: {
        fontSize: 35,
        fontFamily: "Kurale_400Regular",
        padding: "1%",
    },
    verySmallText: {
        fontSize: 12,
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
    eyeContainer: {
        justifyContent: "center",
        alignItems: "flex-end"
    },
    headerButtons: {
        marginLeft: 10,
        marginRight: 5
    },
    purpleButtonText: {
        color: "#ffffff",
        fontSize: 30,
        // margin: "5%",
    },
    purpleButton: {
        backgroundColor: darkPurple,
        padding: "5%",
        borderRadius: 10,
        paddingHorizontal: "15%",
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
        backgroundColor: unselectedCellColor,
        padding: "4%",
    },
    pressableText: {
        fontSize: 16,
        color: unselectedTextColor,
    },
    selectedBubble: {
        backgroundColor: darkPurple,
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
        flexDirection: "row",
        paddingHorizontal: "5%",
        justifyContent: "center",
        columnGap: 15,
    },
    saveButton: {
        backgroundColor: magenta,
        width: "45%",
        alignItems: "center",
        paddingHorizontal: "5%",
        paddingVertical: "2%",
        marginTop: "4%",
        borderRadius: 20,
    },
    cancelButton: {
        backgroundColor: darkPurple,
        width: "45%",
        alignItems: "center",
        paddingHorizontal: "5%",
        paddingVertical: "2%",
        marginTop: "4%",
        borderRadius: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 32,
        fontFamily: "Kurale_400Regular",
    },
});