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
    justSignedIn: false,

    backPressLoadSearch: false,
    searchMovies: [],
    searchFilter: null,

    backPressLoadLibrary: false,

    backPressLoadSpinner: false,
};

export const LogoutUser = async () => {
    Global.username = "";
    Global.password = "";
    
    SignInReset();

    // Clear AsyncStorage
    try {
        await AsyncStorage.clear();
        console.log("AsyncStorage cleared successfully.");
    } catch (error) {
        console.warn("Failed to clear AsyncStorage:", error);
    }
}

export const SignInReset = () => {
    Global.name = "";
    Global.birthday = "";
    Global.location = "";
    Global.bio = "";
    Global.genres = new Set<string>();

    Global.justSignedUp = false;
    Global.justSignedIn = false;

    ClearLoadState();
};

export const ClearLoadState = () => {
    Global.backPressLoadSearch = false;
    Global.searchMovies = [];
    Global.searchFilter = null;

    Global.backPressLoadLibrary = false;

    Global.backPressLoadSpinner = false;
};

export const FetchUserProfile = () => {
    return Global;
};