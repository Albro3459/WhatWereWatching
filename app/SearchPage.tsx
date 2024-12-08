import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, Pressable, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, ScrollView, Alert, Modal } from 'react-native';
import Heart from './components/heartComponent';
import { Content } from './types/contentType';
import { getContentById, getPosterByContent, getRandomContent, searchByKeywords } from './helpers/fetchHelper';
import { router, usePathname } from 'expo-router';
import { appStyles } from '@/styles/appStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '@/Global';


// TODO:
//  - ADD FILTERING
//    - by genre, or show/movie


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const scale = .75;
const selectedHeartColor = "#FF2452";
const unselectedHeartColor = "#ECE6F0";

const SearchPage = () => {
  const pathname = usePathname();
  const [searchText, setSearchText] = useState('');
  const [favoriteMovies, setFavoriteMovies] = useState<Set<string>>(new Set());

  const [heartColors, setHeartColors] = useState<{ [key: string]: string }>();

  const [lists, setLists] = useState({
    Planned: [],
    Watching: [],
    Completed: [],
    Favorite: [],
  });
  const [selectedResult, setSelectedResult] = useState<Content>(null);
  const [addSearchToListModal, setSearchAddToListModal] = useState(false);

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

      setSearchAddToListModal(false);
  
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
      
      setSearchAddToListModal(false);
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

  const search = async (searchText: string) => {
    setSearchText(searchText);
    const contents = await searchByKeywords(searchText);
    if (contents) {
      const mappedMovies = contents.map((content, index) => ({
        id: content.id,
        rating: 4 + ((index + 2) * 3) * 0.01,
        content: content,
      }));
      setMovies(mappedMovies);

      try {
        // Load saved tabs from AsyncStorage
        const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTabs) {
          const parsedTabs = JSON.parse(savedTabs);
          setLists(parsedTabs);
          // Initialize heartColors based on the Favorite tab
          const savedHeartColors = Object.values(parsedTabs).flat().reduce<{ [key: string]: string }>((acc, content: Content) => {
            acc[content.id] = parsedTabs.Favorite.some((fav) => fav.id === content.id)
              ? selectedHeartColor
              : unselectedHeartColor;
            return acc;
          }, {});
          setHeartColors(savedHeartColors);
        }
      } catch (error) {
        console.error('Error loading library content:', error);
      }
    }
  };

  return (
    <View style={[styles.container]}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a movie..."
          placeholderTextColor={Colors.reviewTextColor}
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
                        params: { id: item.id },
                    })}
                  onLongPress={() => {setSelectedResult(item.content); setSearchAddToListModal(true);}}
              >
              <View style={appStyles.cardContainer}>
                <Image source={{ uri: getPosterByContent(item.content) }} style={appStyles.cardPoster} />
                <View style={appStyles.cardContent}>
                  <Text style={appStyles.cardTitle}>{item.content.title}</Text>
                  <Text style={[appStyles.cardDescription, {paddingLeft: 10}]}>{item.content.overview}</Text>
                  <Text style={appStyles.cardRating}>⭐ {item.rating}</Text>
                </View>
                <Heart 
                  heartColor={(heartColors && heartColors[item.id]) || unselectedHeartColor}
                  size={40}
                  onPress={() => moveItemToFavoriteList(item.id)}
                />
              </View>
            </Pressable>
          )}
      />

      {/* Move Modal */}
      {selectedResult && (
        <Modal
            transparent={true}
            visible={addSearchToListModal}
            animationType="fade"
            onRequestClose={() => setSearchAddToListModal(false)}
          >
            <Pressable
              style={appStyles.modalOverlay}
              onPress={() => setSearchAddToListModal(false)}
            >
              <View style={appStyles.modalContent}>
                <Text style={appStyles.modalTitle}>
                  Move "{selectedResult?.title}" to:
                </Text>
                {selectedResult && Object.keys(lists).map((tab, index) => (
                  tab === "Favorite" ? (
                    <View key={`LandingPage-${selectedResult.id}-heart-${index}`} style={{paddingTop: 10}}>
                      <Heart 
                        heartColor={heartColors[selectedResult?.id] || unselectedHeartColor}
                        size={35}
                        onPress={() => moveItemToFavoriteList(selectedResult?.id)}
                      />
                    </View>
                  ) : (
                     <TouchableOpacity
                        key={`LandingPage-${selectedResult.id}-${tab}-${index}`}
                        style={appStyles.modalButton}
                        onPress={() => moveItemToList(selectedResult, tab)}
                      >
                        <Text style={appStyles.modalButtonText}>{tab}</Text>
                      </TouchableOpacity>
                  )
                ))}
              </View>
            </Pressable>
        </Modal>
      )}

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