import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, Pressable, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, ScrollView, Alert, Modal } from 'react-native';
import Heart from './components/heartComponent';
import { Content, PosterContent } from './types/contentType';
import { getContentById, getPostersFromContent, searchByKeywords } from './helpers/fetchHelper';
import { router, usePathname } from 'expo-router';
import { appStyles } from '@/styles/appStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '@/Global';
import { WatchList } from './types/listsType';
import { isItemInList, turnTabsIntoPosterTabs } from './helpers/listHelper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather, Ionicons } from '@expo/vector-icons';
import FilterModal from './components/filterModalComponent';
import { Filter } from './types/filterTypes';


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
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPaidOptions, setSelectedPaidOptions] = useState([]);

  const [heartColors, setHeartColors] = useState<{ [key: string]: string }>();

  const [lists, setLists] = useState<WatchList>({
    Planned: [],
    Watching: [],
    Completed: [],
    Favorite: [],
  });
  const [posterLists, setPosterLists] = useState<{
    [key: string]: PosterContent[];
  }>({});

  const [selectedResult, setSelectedResult] = useState<Content>(null);
  const [addSearchToListModal, setSearchAddToListModal] = useState(false);

  type Movie = {
    id: string;
    rating: number;
    content: PosterContent | null;
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
      const newPosterLists = await turnTabsIntoPosterTabs(updatedTabs);
      setPosterLists(newPosterLists);

      // Save updated tabs to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));

      setSearchAddToListModal(false);
  
      // Show success alert
      // Alert.alert(
      //   "Success",
      //   isFavorite
      //     ? `Removed "${item.title}" from Favorites`
      //     : `Added "${item.title}" to Favorites`
      // );
  
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
      const newPosterLists = await turnTabsIntoPosterTabs(updatedTabs);
      setPosterLists(newPosterLists);
  
      // Save updated tabs back to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));
      
      setSearchAddToListModal(false);
      // Show success alert
      // Alert.alert(
      //   "Success",
      //   isItemInTargetTab
      //     ? `Removed "${item.title}" from "${targetTab}"`
      //     : `Moved "${item.title}" to "${targetTab}"`
      // );
  
    } catch (error) {
      console.error("Error updating tabs:", error);
    }
  };


  const handleFilterModalClose = (filter : Filter | null) => {
    setIsFilterModalVisible(false);
    if (!filter) { return; }
    setSelectedGenres(filter.selectedGenres);
    setSelectedTypes(filter.selectedTypes);
    setSelectedServices(filter.selectedServices);
    setSelectedPaidOptions(filter.selectedPaidOptions);
    // const filters = [...values.selectedGenres, ...values.selectedTypes, ...values.selectedServices, ...values.selectedPaidOptions].join(',');
    search(searchText || "", filter);
  };

  const search = async (searchText: string, filter: Filter) => {
    if (searchText.length <= 0 && filter.selectedGenres.length === 0 && 
        filter.selectedTypes.length === 0 && filter.selectedServices.length === 0 && filter.selectedPaidOptions.length === 0) {
        setMovies([]);
        return;
    }
    setSearchText(searchText);
    const contents: PosterContent[] = await searchByKeywords(searchText, filter);
    if (contents) {
      const mappedMovies = contents.map((content: PosterContent, index) => ({
        id: content.id,
        rating: (() => {
                    const result = 4 + ((index + 2) * 3) * 0.01;
                    return parseFloat(Math.min(result, 5).toFixed(2));
                  })(), // All this just to round to 2 decimals. God damn js can suck sometimes
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
        <View style={{flexDirection: "row", columnGap: 10, justifyContent: "center"}} >
          <Pressable style={{paddingTop: 5}} onPress={async () => await search(searchText, { selectedGenres, selectedTypes, selectedServices, selectedPaidOptions} as Filter )}>
            <Feather name="search" size={28} color="white" />
          </Pressable>
          <TextInput
            style={[styles.searchBar, {flex: 1}]}
            placeholder="Search for a movie..."
            placeholderTextColor={Colors.reviewTextColor}
            value={searchText}
            // onChangeText={async (text) => await search(text, { selectedGenres, selectedTypes, selectedServices, selectedPaidOptions} as Filter )}
            onChangeText={(text) => setSearchText(text)}
            //{/*// Trigger search on Enter */}
            onSubmitEditing={async () => await search(searchText, { selectedGenres, selectedTypes, selectedServices, selectedPaidOptions} as Filter )}
            returnKeyType="search" // makes the return key say search
            clearButtonMode='while-editing'
          />
          <Pressable onPress={() => setIsFilterModalVisible(true)}>
            <Ionicons name="filter-circle-outline" color={"white"} size={35} />
          </Pressable>
        </View>

        {/* ADD FILTERING */}
        <FilterModal visible={isFilterModalVisible} onClose={handleFilterModalClose} initialValues={ {selectedGenres, selectedTypes, selectedServices, selectedPaidOptions} } />

        {/* Movie Cards */}
        {(!movies || movies.length <= 0) ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: 'gray', textAlign: 'center' }}>
              {searchText.length <= 0 ? "Try Searching for a Show or Movie!" : "No Results :("}
            </Text>
          </View>
        ) : (
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
                  <Image source={{ uri: item.content.posters.vertical }} style={appStyles.cardPoster} />
                  <View style={appStyles.cardContent}>
                    <Text style={appStyles.cardTitle}>{item.content.title}</Text>
                    <Text style={[appStyles.cardDescription, {paddingHorizontal: 10}]}>{item.content.overview}</Text>
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
        )}

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
                        style={[appStyles.modalButton, isItemInList(selectedResult, tab, lists) && appStyles.selectedModalButton]}
                        onPress={() => moveItemToList(selectedResult, tab)}
                      >
                        <Text style={appStyles.modalButtonText}>
                          {tab} {isItemInList(selectedResult, tab, lists) ? "✓" : ""}
                        </Text>
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