import React, { useEffect, useState } from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import { GestureHandlerRootView} from 'react-native-gesture-handler';

import { Spinner } from './components/spinnerComponents';
import { Content } from './types/contentType';
import { getContentById, getRandomContent } from './helpers/fetchHelper';
import { usePathname } from 'expo-router';
import moviesAndTvShows from './data/moviesAndTvShows';

const SpinnerPage = () => {
    const pathname = usePathname();

    const [moviesAndShows, setMoviesAndShows] = useState<Content[]>([]);    

    useEffect(() => {
        const fetchContent  = async () => {
          if (pathname === "/SpinnerPage") {
            if (!moviesAndShows || moviesAndShows.length == 0) {
  
              const randomContent = await getRandomContent(15);
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
            <Spinner list={moviesAndShows} />
        </GestureHandlerRootView>
    );
  };

export default SpinnerPage;