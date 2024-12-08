import React, { useEffect, useState } from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Pressable, Alert, Modal} from 'react-native';
import { GestureHandlerRootView, TouchableWithoutFeedback} from 'react-native-gesture-handler';

import { Spinner } from './components/spinnerComponent';
import { Content } from './types/contentType';
import { getContentById, getPosterByContent, getRandomContent } from './helpers/fetchHelper';
import { router, usePathname } from 'expo-router';
import moviesAndTvShows from './data/moviesAndTvShows';
import { Colors } from '@/constants/Colors';
import { appStyles, RalewayFont } from '@/styles/appStyles';
import Heart from './components/heartComponent';
import { Entypo } from '@expo/vector-icons';
import { WatchList } from './types/listsType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '@/Global';
import { isItemInList } from './helpers/listHelper';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const scale = .75;
const selectedHeartColor = "#FF2452";
const unselectedHeartColor = "#ECE6F0";

const SpinnerPage = () => {
    const pathname = usePathname();

    const [moviesAndShows, setMoviesAndShows] = useState<Content[]>([]);   

    const [winner, setWinner] = useState<Content | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    // const [heartColor, setHeartColor] = useState(unselectedHeartColor);
    const [heartColors, setHeartColors] = useState<{[key: string]: string}>();

    const [lists, setLists] = useState<WatchList>({
        Planned: [],
        Watching: [],
        Completed: [],
        Favorite: [],
      });
    const [addToListModal, setAddToListModal] = useState(false);

    const moveItemToFavoriteList = async (id: string) => {
        try {
          // Update heartColors locally
          setHeartColors((prevColors = {}) => ({
            ...prevColors,
            [id]: prevColors[id] === selectedHeartColor ? unselectedHeartColor : selectedHeartColor,
          }));
      
          // Fetch tabs from AsyncStorage
          const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
          const tabs = savedTabs ? JSON.parse(savedTabs) : { Planned: [], Watching: [], Completed: [], Favorite: [] };
      
          // Find the item in all tabs
          let item = Object.values<Content>(tabs)
            .flat()
            .find((content: Content) => content.id === id);
      
          if (!item) {
            item = await getContentById(id);
            if (!item) {
              console.log(`LandingPage: item with id: ${id} doesn't exist`);
              return;
            }
          }
      
          // Check if the item is already in the Favorite tab
          const isFavorite = tabs.Favorite.some((fav) => fav.id === id);
      
          // Update the Favorite tab
          const updatedFavorites = isFavorite
            ? tabs.Favorite.filter((content) => content.id !== id) // Remove if already in Favorites
            : [...tabs.Favorite, item]; // Add if not in Favorites
      
          const updatedTabs = {
            ...tabs,
            Favorite: updatedFavorites,
          };
          
          setLists(updatedTabs);
          // Save updated tabs to AsyncStorage
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));
          
          // Show success alert
          Alert.alert(
            "Success",
            isFavorite
              ? `Removed "${item.title}" from Favorites`
              : `Added "${item.title}" to Favorites`
          );
      
        } catch (error) {
          console.error("Error updating Favorites:", error);
          // Alert.alert("Error", "Unable to update Favorites. Please try again.");
        }
    };
    
    const moveItemToList = async (item: Content, targetTab: string) => {
        try {
          // Load tabs from AsyncStorage
          const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
          const tabs = savedTabs ? JSON.parse(savedTabs) : { Planned: [], Watching: [], Completed: [], Favorite: [] };
      
          // Check if the item is already in the target tab
          const isItemInTargetTab = tabs[targetTab].some((content) => content.id === item.id);
      
          // Update the target tab
          const updatedTabs = {
            ...tabs,
            [targetTab]: isItemInTargetTab
              ? tabs[targetTab].filter((content) => content.id !== item.id) // Remove if already exists
              : [...tabs[targetTab], item], // Add if it doesn't exist
          };
    
          setLists(updatedTabs);
      
          // Save updated tabs back to AsyncStorage
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));
          
          setAddToListModal(false);
          // Show success alert
          Alert.alert(
            "Success",
            isItemInTargetTab
              ? `Removed "${item.title}" from "${targetTab}"`
              : `Moved "${item.title}" to "${targetTab}"`
          );
      
        } catch (error) {
          console.error("Error updating tabs:", error);
        }
    };

    const getContentObject = async (content: Content) => {
        try {
            // Load saved tabs from AsyncStorage
            const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
        
            if (savedTabs && content) {
                const parsedTabs = JSON.parse(savedTabs);
                setLists(parsedTabs);
                // Initialize heartColors based on the Favorite tab
                const savedHeartColors = Object.values(parsedTabs).flat().reduce<{ [key: string]: string }>((acc) => {
                acc[content.id] = parsedTabs.Favorite.some((fav) => fav.id === content.id)
                    ? selectedHeartColor
                    : unselectedHeartColor;
                return acc;
                }, {});
                setHeartColors(savedHeartColors);
            }
        } catch (error) {
            console.error("Error loading library content:", error);
        } 
      };

    const handleWinner = (selectedWinner: Content) => {
        const updateLists = async () => {
            try {
                await getContentObject(selectedWinner);
            } catch (error) {
                console.error('Error updating lists:', error);
            }
        };
        updateLists();
        setWinner(selectedWinner); // Update state with the winner
        setShowOverlay(true);
        console.log('Winner is:', selectedWinner.title); // Log the winner
    };

    useEffect(() => {
        const fetchContent  = async () => {
          if (pathname === "/SpinnerPage") {
            if (!moviesAndShows || moviesAndShows.length == 0) {
  
              const randomContent = await getRandomContent(10);
              if (randomContent) {
                setMoviesAndShows(randomContent);
              }
            }
          }
        }
        fetchContent();
    }, [pathname]);   
  
    return (
        
        <GestureHandlerRootView>
            <Spinner list={moviesAndShows} onFinish={handleWinner} />
            {winner && showOverlay && (
                <View style={styles.overlay}>
                    <View style={styles.winnerContainer}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={styles.winnerText}>Winner!</Text>
                            <Entypo name='circle-with-cross' size={25} color={"white"}
                                style={{
                                    position: "absolute",
                                    padding: 0,
                                    margin: 0,
                                    left: screenWidth*0.48
                                }} 
                                onPress={() => setShowOverlay(false)} />
                        </View>
                        <Pressable
                            onPress={() => router.push({
                                    pathname: '/InfoPage',
                                    params: { id: winner.id },
                                })}
                            onLongPress={() => {setAddToListModal(true);}}
                        >
                            <View style={[appStyles.cardContainer, {width: screenWidth*0.7, alignSelf: "center"}]}>
                                <Image source={{ uri: getPosterByContent(winner) }} style={appStyles.cardPoster} />
                                <View style={[appStyles.cardContent]}>
                                    <Text style={[appStyles.cardTitle, {paddingBottom: 5}]}>{winner.title.split(":").length == 0 ? winner.title : winner.title.split(":")[0]}</Text>
                                    <Text style={appStyles.cardRating}>⭐ 4.2</Text>
                                </View>
                                <Heart 
                                    heartColor={(heartColors && heartColors[winner.id]) || unselectedHeartColor}
                                    size={35}
                                    onPress={() => moveItemToFavoriteList(winner.id)}
                                />
                            </View>
                        </Pressable>
                    </View>
                </View>
            )}

            {/* Move Modal */}
            {winner && (
                <Modal
                    transparent={true}
                    visible={addToListModal}
                    animationType="fade"
                    onRequestClose={() => setAddToListModal(false)}
                >
                    <Pressable
                    style={appStyles.modalOverlay}
                    onPress={() => setAddToListModal(false)}
                    >
                    <View style={appStyles.modalContent}>
                        <Text style={appStyles.modalTitle}>
                        Move "{winner?.title}" to:
                        </Text>
                        {winner && Object.keys(lists).slice(0,3).map((tab, index) => (
                        tab === "Favorite" ? (
                            <View key={`LandingPage-${winner.id}-heart-${index}`} style={{paddingTop: 10}}>
                            <Heart 
                                heartColor={heartColors[winner?.id] || unselectedHeartColor}
                                size={35}
                                onPress={() => moveItemToFavoriteList(winner?.id)}
                            />
                            </View>
                        ) : (
                            <TouchableOpacity
                                key={`LandingPage-${winner.id}-${tab}-${index}`}
                                style={[appStyles.modalButton, isItemInList(winner, tab, lists) && appStyles.selectedModalButton]}
                                onPress={() => moveItemToList(winner, tab)}
                            >
                                <Text style={appStyles.modalButtonText}>
                                {tab} {isItemInList(winner, tab, lists) ? "✓" : ""}
                                </Text>
                            </TouchableOpacity>
                        )
                        ))}
                    </View>
                    </Pressable>
                </Modal>
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute', // Makes the view overlay the entire screen
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center', // Centers the content vertically
        alignItems: 'center', // Centers the content horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background
        zIndex: 100, // Ensures the overlay is above other elements
      },
    winnerContainer: {
        height: screenHeight*0.25,
        width: screenWidth*0.85,
        marginTop: "100%",
        backgroundColor: Colors.unselectedColor,
        alignItems: "center",
        borderRadius: 10,
      },
      winnerText: {
        color: "#fff",
        fontSize: 40,
        fontFamily: RalewayFont,
        textAlign: "center",
        paddingVertical: 20,
      },
});

export default SpinnerPage;