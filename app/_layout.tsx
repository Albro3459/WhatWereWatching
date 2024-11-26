import { Stack } from "expo-router";
import { Pressable, Button, TouchableOpacity } from "react-native";
import Feather from '@expo/vector-icons/Feather';

export default function RootLayout() {
  return (
    <Stack>
        <Stack.Screen
            name="LandingPage"
            options={({ navigation }) => ({
                title: "What We're Watching",
                headerBackVisible: false,
                headerTitleStyle: {
                    fontSize: 24,
                    color: '#2D2350',
                },
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('ProfilePage')}>
                        <Feather name="user" size={28} color="black" />
                    </TouchableOpacity>
                ),
            })}
        />
        <Stack.Screen name="unmatched" options={{ headerShown: false }} />
        <Stack.Screen name="report" options={{ headerShown: true, title: "Report User", headerBackButtonDisplayMode: "minimal" }} />
        <Stack.Screen name="registration" options={{ title: "Registration", headerBackButtonDisplayMode: "minimal" }} />
        <Stack.Screen name="breakup" options={{ title: "Break Up With User", headerBackButtonDisplayMode: "minimal" }} />
        <Stack.Screen name="ProfilePage" options={{
                headerBackButtonDisplayMode: "minimal", title: "Profile",
                headerTitleStyle: {
                    fontSize: 24,
            }
          }} />
          <Stack.Screen name="index" options={{headerShown: false}} />
          
    </Stack>
  );
}
