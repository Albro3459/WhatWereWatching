import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, Pressable, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { Heart } from './components/heartComponent';

const screenWidth = Dimensions.get("window").width;
const scale = .75;
const selectedHeartColor = "#FF2452";
const unselectedHeartColor = "#ECE6F0";

const SearchPage = () => {
  const [searchText, setSearchText] = useState('');
  const [favoriteMovies, setFavoriteMovies] = useState<Set<string>>(new Set());

  const [heartColors, setHeartColors] = useState<{ [key: string]: string }>({
    '1': unselectedHeartColor,
    '2': unselectedHeartColor,
    '3': unselectedHeartColor,
  });

  const toggleHeartColor = (id: string) => {
    setHeartColors((prevColors) => ({
      ...prevColors,
      [id]: prevColors[id] === selectedHeartColor ? unselectedHeartColor : selectedHeartColor,
    }));
  };

  const movies = [
    {
      id: '1',
      title: 'Joker',
      description: 'A gritty character study of Arthur Fleck.',
      rating: 4.8,
      poster: require('../assets/images/posters/joker.png'),
    },
    {
      id: '2',
      title: 'Elf',
      description: 'A funny Christmas adventure.',
      rating: 4.6,
      poster: require('../assets/images/posters/elf.png'),
    },
    {
      id: '3',
      title: 'Shrek',
      description: 'An ogre’s hilarious journey to rescue a princess.',
      rating: 4.9,
      poster: require('../assets/images/posters/shrek.png'),
    },
  ];

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

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={90}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          {/* Search Bar */}
          <TextInput
            style={styles.searchBar}
            placeholder="Search for a movie..."
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            
          />

          {/* Movie Cards */}
          <FlatList
            data={filteredMovies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={item.poster} style={styles.poster} />
                <View style={styles.cardContent}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.rating}>⭐ {item.rating}</Text>
                </View>
                <Heart 
                  heartColor={heartColors[item.id]}
                  screenWidth={screenWidth}
                  scale={scale}
                  onPress={() => toggleFavorite(item.id)}
                />
              </View>
            )}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    padding: 16,
    paddingTop: 50,
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