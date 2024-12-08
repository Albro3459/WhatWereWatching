import React, { useEffect, useState } from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Pressable} from 'react-native';
import { GestureHandlerRootView, TouchableWithoutFeedback} from 'react-native-gesture-handler';

import { Spinner } from './components/spinnerComponent';
import { Content } from './types/contentType';
import { getContentById, getPosterByContent, getRandomContent } from './helpers/fetchHelper';
import { router, usePathname } from 'expo-router';
import moviesAndTvShows from './data/moviesAndTvShows';
import { Colors } from '@/constants/Colors';
import { appStyles } from '@/styles/appStyles';
import Heart from './components/heartComponent';
import { Entypo } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const scale = .75;
const selectedHeartColor = "#FF2452";
const unselectedHeartColor = "#ECE6F0";

const SpinnerPage = () => {
    const pathname = usePathname();

    const [moviesAndShows, setMoviesAndShows] = useState<Content[]>([]);   

    const [winner, setWinner] = useState<Content | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [heartColor, setHeartColor] = useState(selectedHeartColor);

    const handleWinner = (selectedWinner: Content) => {
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
                        >
                            <View style={[appStyles.cardContainer, {width: screenWidth*0.7, alignSelf: "center"}]}>
                                <Image source={{ uri: getPosterByContent(winner) }} style={appStyles.cardPoster} />
                                <View style={[appStyles.cardContent]}>
                                    <Text style={[appStyles.cardTitle, {paddingBottom: 5}]}>{winner.title.split(":").length == 0 ? winner.title : winner.title.split(":")[0]}</Text>
                                    <Text style={appStyles.cardRating}>⭐ 4.2</Text>
                                </View>
                                <Heart 
                                    heartColor={heartColor}
                                    screenWidth={screenWidth}
                                    scale={scale}
                                    onPress={() => setHeartColor(heartColor === selectedHeartColor ? unselectedHeartColor : selectedHeartColor)}
                                />
                            </View>
                        </Pressable>
                    </View>
                </View>
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute', // Makes the view overlay the entire screen
        // paddingBottom: "100%",
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
        fontFamily: 'Raleway_800ExtraBold',
        textAlign: "center",
        paddingVertical: 20,
      },
});

export default SpinnerPage;