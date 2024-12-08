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
};

export const LogoutUser = () => {
    Global.username = "";
    Global.password = "";
    Global.name = "";
    Global.birthday = "";
    Global.location = "";
    Global.bio = "";
    Global.genres = new Set<string>();
}

export const FetchUserProfile = () => {
    return Global;
};