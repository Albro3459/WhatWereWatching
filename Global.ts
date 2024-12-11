import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEY = 'libraryTabs';

export const Global = {
    // profile
    username: "",
    password: "",
    name: "",
    birthday: "",
    location: "",
    bio: "",
    genres: new Set<string>(),

    justSignedUp: false,
};

export const LogoutUser = async () => {
    Global.username = "";
    Global.password = "";
    Global.name = "";
    Global.birthday = "";
    Global.location = "";
    Global.bio = "";
    Global.genres = new Set<string>();

    Global.justSignedUp = false;

    // Clear AsyncStorage
    try {
        await AsyncStorage.clear();
        console.log("AsyncStorage cleared successfully.");
    } catch (error) {
        console.error("Failed to clear AsyncStorage:", error);
    }
}

export const FetchUserProfile = () => {
    return Global;
};