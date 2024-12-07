import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, Pressable, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, ScrollView } from 'react-native';
import { Heart } from './components/heartComponent';
import { Content } from './types/contentType';
import { getPosterByContent, getRandomContent } from './helpers/fetchHelper';
import { router } from 'expo-router';


// TODO:
//  - ADD FILTERING
//    - by genre, or show/movie


const screenWidth = Dimensions.get("window").width;
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
            <Pressable onPress={() => router.push({
                                    pathname: '/InfoPage',
                                    params: { id: item.content.id },
                                  })}
              >
              <View style={styles.card}>
                <Image source={{ uri: getPosterByContent(item.content) }} style={styles.poster} />
                <View style={styles.cardContent}>
                  <Text style={styles.title}>{item.content.title}</Text>
                  <Text style={styles.description}>{item.content.overview}</Text>
                  <Text style={styles.rating}>⭐ {item.rating}</Text>
                </View>
                <Heart 
                  heartColor={heartColors[item.id]}
                  screenWidth={screenWidth}
                  scale={scale}
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackgroundColor,
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  poster: {
    height: 80,
    width: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: '#FFD700', // Gold star color
  },
});

export default SearchPage;