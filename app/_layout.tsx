import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Pressable, Button, TouchableOpacity } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { Colors } from "@/constants/Colors";
import { useEffect } from "react";
import { useFonts, Raleway_800ExtraBold } from '@expo-google-fonts/raleway';
import { Kurale_400Regular } from '@expo-google-fonts/kurale';

// Prevent splash screen from hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const [fontsLoaded] = useFonts({
        Raleway_800ExtraBold,
        Kurale_400Regular,
    });
    
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
                name="LandingPage"
                options={({ navigation }) => ({
                    title: "What We're Watching",
                    headerBackVisible: false,
                    headerTitleStyle: {
                        fontSize: 24,
                        color: Colors.backgroundColor,
                    },
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('ProfilePage')}>
                            <Feather name="user" size={28} color="black" />
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen name="InfoPage" options={{ title: "Info", headerBackButtonDisplayMode: "minimal" }} />
            <Stack.Screen name="ProfilePage" options={{
                    headerBackButtonDisplayMode: "minimal", title: "Profile",
                    headerTitleStyle: {
                        fontSize: 24,
                }
            }} />
            
            
        </Stack>
    );
}
