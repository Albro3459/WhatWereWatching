import { Text, TextInput, View, StyleSheet,TouchableOpacity, ScrollView, Image, Button, Pressable, Dimensions, Alert } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PressableBubblesGroup,} from './components/formComponents';
import { Link, Href, usePathname, useNavigation, router } from "expo-router"
import { Colors } from "@/constants/Colors";
import { dateToString, stringToDate } from "./helpers/dateHelper";
import { KuraleFont } from "@/styles/appStyles";
import { Global, LogoutUser } from "@/Global";
import { Feather } from "@expo/vector-icons";


export default function ProfilePage() {
    const navigation = useNavigation();
    const pathname = usePathname();

    // State for text inputs
    const [nameText, setNameText] = useState<string>(Global.name);
    const [birthdayText, setBirthdayText] = useState<string>(Global.birthday);
    // Date picker for birthday
    const [selectedDate, setSelectedDate] = useState<Date | null>(stringToDate(birthdayText) || new Date());
    const handleConfirmDate = (birthdayDate: Date) => {
        setBirthdayText(dateToString(birthdayDate));
        setSelectedDate(birthdayDate);
    };
    const [locationText, setLocationText] = useState(Global.location); // temporary placeholder, will be from the db
    const [bioText, setBioText] = useState(Global.bio); // temporary placeholder, will be from the db

    //pronoun options
    const [genres, setGenres] = useState<string[]>(["Fantasy", "Horror", "Action", "Comedy", "Romantic", "Sci-Fi", "Adventure", "Other"]);

    // State for selected attributes
    const [selectedGenres, setSelectedGenres] = useState<Set<string>>(Global.genres);

    const saveProfile = (name: string, birthday: string, location: string, bio: string, genres: Set<string>) => {
        Global.name = name;
        Global.birthday = birthday;
        Global.location = location;
        Global.bio = bio;
        Global.genres = genres;

        Alert.alert(
            'Success',
            'Your profile has been updated!',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        if (Global.justSignedUp) {
                            // on sign up
                            router.push('/LandingPage');
                            Global.justSignedUp = false;
                            Global.justSignedIn = true;
                        } else {
                            // regular save
                            Global.justSignedUp = false;
                        }
                    },
                },
            ]
        );
    };

    useEffect(() => {
        const fetchProfile = () => {
            if (pathname === "/ProfilePage") {
                setNameText(Global.name);
                setBirthdayText(Global.birthday);
                setLocationText(Global.location);
                setBioText(Global.bio);
                setSelectedGenres(Global.genres);
            }
        };  
        fetchProfile();
    }, [Global]);


    // Adding a working save button to the top nav bar
    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <Pressable onPress={() => saveProfile(nameText, birthdayText, locationText, bioText, selectedGenres)}>
                <Feather name="save" size={35} />                
            </Pressable>
          ),
        });
      }, [navigation, nameText, birthdayText, locationText, bioText, selectedGenres]);

    return (
        <ScrollView style={styles.background}>
            {/* Picture + Name */}
            <View style={styles.topContainer}>
                <Image
                    source={require("../assets/images/ProfilePic.png")}
                    style={styles.image}
                />
                {/* <Text style={[styles.nameText, { marginTop: -55 }]}>John Slade</Text> */}
            </View>

            {/* First container */}
            <View style={[styles.container, { marginTop: 0-15 }]}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Name:</Text>
                    <Text style={{ color: 'red', marginLeft: 2 }}>*</Text>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                    </View>
                </View>
                <TextInput
                    style={[styles.textField, nameText.length > 0 ? styles.selectedTextBox : null]}
                    value={nameText}
                    onChangeText={(newText) => setNameText(newText)}
                />


                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Birthday:</Text>
                    <Text style={{ color: "red", marginLeft: 2 }}>*</Text>
                    </View>
                    <View
                    style={[
                        styles.dateContainer,
                        birthdayText && birthdayText.length > 0
                        ? styles.selectedDateContainer
                        : null,
                    ]}
                    >
                    {selectedDate && (
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="default"
                        style={styles.datePicker}
                        accentColor="transparent"
                        // themeVariant={birthdayText && birthdayText.length > 0 ? "dark" : "light"}
                        themeVariant="dark"
                        textColor="white"
                        onChange={(event, date) => {
                        if (date) {
                            handleConfirmDate(date);
                        }
                        }}
                    />
                    )}
                    </View>

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
                        labels={genres}
                        selectedLabels={selectedGenres}
                        setLabelState={setSelectedGenres}
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
                {/* Button */}
                { Global.justSignedUp ? (
                    <Pressable style={styles.button} onPress={() => saveProfile(nameText, birthdayText, locationText, bioText, selectedGenres)}>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>Save</Text>
                    </Pressable>
                ) : (
                    <Pressable style={styles.button} onPress={async () => { await LogoutUser(); router.push('/');}}>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>Logout</Text>
                    </Pressable>
                )}
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
        // marginVertical: "5%",
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
        width: "90%",
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
        width: "90%",
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
        fontFamily: KuraleFont,
        padding: "1%",
    },
    labelText: {
        color: "black",
        fontSize: 25,
        fontFamily: KuraleFont,
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
        backgroundColor: Colors.tabBarColor,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 10,
        width: 150,
        height: 75,
        justifyContent: "center",
        alignItems: "center"
    },
    dateContainer: {
        backgroundColor: Colors.unselectedColor,
        width: "90%",
        height: 50,
        borderRadius: 15,
        marginBottom: 20,
        padding: 10,
        alignContent: "flex-start",
        alignSelf: "center",
        justifyContent: "center",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // for Android
    },
    selectedDateContainer: {
        backgroundColor: Colors.selectedColor,
    },
    datePicker: {
        borderRadius: 15,
        alignSelf: "flex-start",
        overflow: "hidden",
    },
});