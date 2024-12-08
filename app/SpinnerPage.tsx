import React, { useEffect, useState } from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import { GestureHandlerRootView} from 'react-native-gesture-handler';

import { Spinner } from './components/spinnerComponent';
import { Content } from './types/contentType';
import { getContentById, getRandomContent } from './helpers/fetchHelper';
import { usePathname } from 'expo-router';
import moviesAndTvShows from './data/moviesAndTvShows';
import { Colors } from '@/constants/Colors';

const SpinnerPage = () => {
    const pathname = usePathname();

    const [moviesAndShows, setMoviesAndShows] = useState<Content[]>([]);   

    const [winner, setWinner] = useState<Content | null>(null);

    const handleWinner = (selectedWinner: Content) => {
        setWinner(selectedWinner); // Update state with the winner
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
                {winner && (
                    <View style={styles.winnerContainer}>
                        <Text style={styles.winnerText}>You should watch: {winner.title}</Text>
                    </View>
                )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    winnerContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: "#6c6c91",
        borderRadius: 5,
      },
      winnerText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
      },
});

export default SpinnerPage;