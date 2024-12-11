import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Pressable, Button, TouchableOpacity, View } from "react-native";
import { Fontisto, Feather } from '@expo/vector-icons';
import { Colors } from "@/constants/Colors";
import { useEffect } from "react";
import { useFonts, Raleway_800ExtraBold } from '@expo-google-fonts/raleway';
import { Kurale_400Regular } from '@expo-google-fonts/kurale';
import { Global } from "@/Global";

// Prevent splash screen from hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const [fontsLoaded] = useFonts({
        Raleway_800ExtraBold,
        Kurale_400Regular,
    });

    // const handleProfileBackPress = (navigation) => {
    //     console.log("PROFILE BACK PRESS:");

    //     console.log("Global.username:", Global.username);
    //     console.log("Global.name:", Global.name);
    //     console.log("Global.birthday:", Global.birthday);
    //     console.log("Global.location:", Global.location);
    //     console.log("Global.bio:", Global.bio);
    //     console.log("Global.genres:", Global.genres);

    //     // Add LandingPage to the stack below the current screen
    //     navigation.reset({
    //     index: 1,
    //     routes: [
    //         { name: "LandingPage" }, // Place LandingPage below
    //         { name: "ProfilePage" }, // Current screen
    //     ],
    //     });

    //     // Go back to LandingPage with back animation
    //     navigation.goBack();
    //     // router.push("/LandingPage");
    // };
    
    // Show splash screen until fonts are loaded
    useEffect(() => {
    if (fontsLoaded) {
        SplashScreen.hideAsync();
    }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
    return null; // Prevent rendering until fonts are loaded
    }

    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen 
                name="SearchPage" 
                options={{ 
                    title: "Search", 
                    headerBackButtonDisplayMode: "minimal",
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontSize: 24,
                        color: "white"
                    },
                    headerStyle: {
                        backgroundColor: Colors.unselectedColor,
                    },
                }}
            />
            <Stack.Screen
                name="LandingPage"
                options={({ navigation }) => ({
                    title: "What We're Watching",
                    gestureEnabled: false,
                    headerBackVisible: false,
                    headerTitleStyle: {
                        fontSize: 24,
                        color: "white"
                    },
                    headerStyle: {
                        backgroundColor: Colors.unselectedColor,
                    },
                    headerLeft: () => (
                        <Pressable onPress={() => router.push('/SearchPage')}>
                            <Feather name="search" size={28} color="white" />
                        </Pressable>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('ProfilePage')}>
                            <Feather name="user" size={28} color="white" />
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="SpinnerPage"
                options={({ navigation }) => ({
                    title: "Spin to Pick",
                    gestureEnabled: false,
                    headerBackVisible: false,
                    // headerBackButtonDisplayMode: "minimal",
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontSize: 24,
                        color: "white"
                    },
                    headerStyle: {
                        backgroundColor: Colors.unselectedColor,
                    },
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('LandingPage')}>
                            <Feather name="home" size={28} color="white" />
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="LibraryPage"
                options={({ navigation }) => ({
                    title: "Library",
                    headerBackButtonDisplayMode: "minimal",
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontSize: 24,
                        color: "white"
                    },
                    headerStyle: {
                        backgroundColor: Colors.unselectedColor,
                    },
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.push('/SpinnerPage')}>
                            <Fontisto name="spinner" size={28} color="white" />
                        </TouchableOpacity>
                    ),
                })}
            />
            
            <Stack.Screen 
                name="InfoPage" 
                options={{ 
                    title: "Info", 
                    headerBackButtonDisplayMode: "minimal",
                    headerTintColor: "white",
                    headerTitleStyle: {
                        fontSize: 24,
                        color: "white"
                    },
                    headerStyle: {
                        backgroundColor: Colors.unselectedColor,
                    },
                }}
            />
            <Stack.Screen 
                name="ProfilePage" 
                options={({navigation}) => ({
                title: "Profile",
                headerBackButtonDisplayMode: "minimal",
                headerTintColor: "black",
                headerTitleStyle: {
                    fontSize: 24,
                    color: Colors.backgroundColor,
                },
                // headerStyle: {
                //     backgroundColor: Colors.unselectedColor,
                // },
                // headerLeft: () => (
                //     <View style={{ marginLeft: -15 }}>
                //       <Pressable
                //         onPress={async () => {
                //           handleProfileBackPress(navigation);
                //         }}
                //       >
                //         <Feather name="chevron-left" size={32} color="black" />
                //       </Pressable>
                //     </View>
                //   ),
            })}/>
            
        </Stack>
    );
}
