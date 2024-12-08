import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, Pressable, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, ScrollView } from 'react-native';
import Heart from './components/heartComponent';
import { Content } from './types/contentType';
import { getPosterByContent, getRandomContent } from './helpers/fetchHelper';
import { router } from 'expo-router';
import { appStyles } from '@/styles/appStyles';


// TODO:
//  - ADD FILTERING
//    - by genre, or show/movie


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const scale = .75;
const selectedHeartColor = "#FF2452";
const unselectedHeartColor = "#ECE6F0";

const SearchPage = () => {
  const [searchText, setSearchText] = useState('');
  const [favoriteMovies, setFavoriteMovies] = useState<Set<string>>(new Set());

  const [heartColors, setHeartColors] = useState<{ [key: string]: string }>();

  const toggleHeartColor = (id: string) => {
    setHeartColors((prevColors) => ({
      ...prevColors,
      [id]: prevColors[id] === selectedHeartColor ? unselectedHeartColor : selectedHeartColor,
    }));
  };

  type Movie = {
    id: string;
    rating: number;
    content: Content | null;
  };
  const [movies, setMovies] = useState<Movie[]>([]);

  const toggleFavorite = (id: string) => {
    setFavoriteMovies((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
    toggleHeartColor(id);
  };

  // const filteredMovies = movies.filter((movie) =>
  //   movie.title.toLowerCase().includes(searchText.toLowerCase())
  // );

  const search = async (searchText: string) => {
    setSearchText(searchText);
    const contents = await getRandomContent(10);
    if (contents) {
      const mappedMovies = contents.map((content, index) => ({
        id: `${index}`,
        rating: 4 + ((index + 2) * 3) * 0.01,
        content: content,
      }));
      setMovies(mappedMovies);
  
      const heartColors = mappedMovies.reduce((acc, movie) => {
        acc[movie.id] = unselectedHeartColor;
        return acc;
      }, {});
      setHeartColors(heartColors);
    }
  };

  return (
    <View style={[styles.container]}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a movie..."
          placeholderTextColor="#ccc"
          value={searchText}
          onChangeText={async (text) => await search(text)}
        />

        {/* ADD FILTERING */}

        {/* Movie Cards */}
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
                  onPress={() => router.push({
                        pathname: '/InfoPage',
                        params: { id: item.content.id },
                    })}
              >
              <View style={appStyles.cardContainer}>
                <Image source={{ uri: getPosterByContent(item.content) }} style={appStyles.cardPoster} />
                <View style={appStyles.cardContent}>
                  <Text style={appStyles.cardTitle}>{item.content.title}</Text>
                  <Text style={appStyles.cardDescription}>{item.content.overview}</Text>
                  <Text style={appStyles.cardRating}>⭐ {item.rating}</Text>
                </View>
                <Heart 
                  heartColor={heartColors[item.id]}
                  size={40}
                  onPress={() => toggleFavorite(item.id)}
                />
              </View>
            </Pressable>
          )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    padding: 16,
    paddingVertical: 50,
  },
  searchBar: {
    backgroundColor: Colors.cardBackgroundColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: '#FFFFFF',
    marginBottom: 20,
    fontSize: 16,
  },
});

export default SearchPage;