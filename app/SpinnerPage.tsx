import React, { useEffect, useRef, useState } from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Pressable, Alert, Modal, FlatList, TextInput, Keyboard, KeyboardAvoidingView} from 'react-native';
import { GestureHandlerRootView, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { Spinner } from './components/spinnerComponent';
import { Content, PosterContent, Posters } from './types/contentType';
import { getContentById, getPostersFromContent, searchByKeywords } from './helpers/fetchHelper';
import { router, usePathname } from 'expo-router';
import moviesAndTvShows from './data/moviesAndTvShows';
import { Colors } from '@/constants/Colors';
import { appStyles, RalewayFont } from '@/styles/appStyles';
import Heart from './components/heartComponent';
import { Entypo } from '@expo/vector-icons';
import { PosterList, WatchList } from './types/listsType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '@/Global';
import { DEFAULT_TABS, FAVORITE_TAB, isItemInList, moveItemToTab, sortTabs, turnTabsIntoPosterTabs } from './helpers/listHelper';
import { parse } from '@babel/core';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SpinnerPage = () => {
    const pathname = usePathname();

    const [moviesAndShows, setMoviesAndShows] = useState<PosterContent[]>([]);   
    const [searchedContent, setSearchedContent] = useState<PosterContent[]>([]);

    const [winner, setWinner] = useState<PosterContent | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);

    const [inputText, setInputText] = useState<string>("");
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);


    // const [heartColor, setHeartColor] = useState(unselectedHeartColor);
    const [heartColors, setHeartColors] = useState<{[key: string]: string}>();

    const [selectedLists, setSelectedLists] = useState<string[]>([]);
    const [lists, setLists] = useState<WatchList>(DEFAULT_TABS);
    const [posterLists, setPosterLists] = useState<PosterList>(DEFAULT_TABS as PosterList);
    const [dropDownOpen, setDropDownOpen] = useState(false);

    const [addToListModal, setAddToListModal] = useState(false);

    const getContentObject = async (content: Content) => {
        try {
            // Load saved tabs from AsyncStorage
            const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
        
            if (savedTabs && content) {
                const parsedTabs: WatchList = savedTabs
                                ? sortTabs({ ...DEFAULT_TABS, ...JSON.parse(savedTabs) }) // Ensure tabs are sorted
                                : DEFAULT_TABS;
                setLists(parsedTabs);
                const newPosterLists = await turnTabsIntoPosterTabs(parsedTabs);
                setPosterLists(newPosterLists);

                // Initialize heartColors based on the Favorite tab
                const savedHeartColors = Object.values(parsedTabs).flat().reduce<{ [key: string]: string }>((acc) => {
                acc[content.id] = parsedTabs.Favorite.some((fav) => fav.id === content.id)
                    ? Colors.selectedHeartColor
                    : Colors.unselectedHeartColor;
                return acc;
                }, {});
                setHeartColors(savedHeartColors);
            }
        } catch (error) {
            console.error("Error loading library content:", error);
        } 
    };

    const handleWinner = (selectedWinner: Content) => {

      setWinner({ ...selectedWinner, posters: null }); // Placeholder update
      setShowOverlay(true);
      const updateLists = async () => {
          try {
              await getContentObject(selectedWinner);
              const posters = await getPostersFromContent(selectedWinner);
              setWinner({ ...selectedWinner, posters }); // Update with full data
              console.log('Winner is:', selectedWinner.title); // Log the winner
          } catch (error) {
              console.error('Error updating lists:', error);
          }
      };

      updateLists();
    }; 

    const handleModalClose = () => {
      // inputRef.current?.blur(); // Blur the main input to prevent reopening the modal
      setSearchModalVisible(false);
    };

    const handleAddSegment = async () => {
      try {
        await addSegment(inputText); // Perform your logic
        setInputText(""); // Clear the input text
        handleModalClose();
        // setSearchModalVisible(false); // Hide the modal
      } catch (error) {
        console.error("Error adding segment:", error);
        Alert.alert("Error", "Failed to add the segment. Please try again.");
      }
    };

    // Function to add a movie to the wheel
    const addSegment = async (inputText) => {
      if (!inputText || inputText.trim() === "") {
        setInputText("");
        // setSearchModalVisible(false);
        // Alert.alert("Input Error", "Please enter a movie name.");
        return;
      }
      
      // setInputText("");
      // setSearchModalVisible(false);
      
      try {
        const results = await searchByKeywords(inputText, {
          selectedGenres: [],
          selectedTypes: [],
          selectedServices: [],
          selectedPaidOptions: []
        });
        
        if (results && results.length > 0) {
          setSearchedContent((prev) => 
            prev.some((movie) => movie.id === results[0].id) ? prev : [...prev, results[0]]
          );
          setMoviesAndShows((prev) => 
            prev.some((movie) => movie.id === results[0].id) ? prev : [...prev, results[0]]
          );
        } else {
          Alert.alert("No Results", "No matching results were found.");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        Alert.alert("Search Error", "Something went wrong. Please try again.");
      }
    };
    

    // Function to remove a movie from the wheel
    const removeSegment = (content: PosterContent) => {
      setSearchedContent((prev) => prev.filter((item) => item.id !== content.id));
      setMoviesAndShows((prev) => prev.filter((item) => item.id !== content.id));
      setSearchModalVisible(false);
    };

    useEffect(() => {
      const fetchListData = async () => {
        if (selectedLists.length > 0) {
          try {
            // Load saved tabs from AsyncStorage
            const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
      
            if (savedTabs) {
              // console.log("getting content from storage for info");
              const parsedTabs: WatchList = savedTabs
                                  ? sortTabs({ ...DEFAULT_TABS, ...JSON.parse(savedTabs) }) // Ensure tabs are sorted
                                  : DEFAULT_TABS;
              // console.log(`does the planned list exist: ${parsedTabs["Planned"]}`);
              setLists(parsedTabs);

              const newPosterLists = await turnTabsIntoPosterTabs(parsedTabs);
              setPosterLists(newPosterLists);

              const allContent = selectedLists.flatMap((listKey) => parsedTabs[listKey]);

              const uniqueContentMap = new Map(allContent.map((c) => [c.id, c]));
              const uniqueContent = Array.from(uniqueContentMap.values());

              const combinedPosterContent = await Promise.all(
                uniqueContent.map(async (content: Content) => {
                  const posters = await getPostersFromContent(content);
                  return { ...content, posters }; 
                })
              );

              setMoviesAndShows(combinedPosterContent);
              // console.log("SHOULD BE DATA");
            }
          } catch (error) {
            console.error("Error loading library content:", error);
          }
        } else {
          // console.log("NO DATA");
          setMoviesAndShows([]); // Reset when no list is selected
        }
      };

      fetchListData();
    }, [selectedLists]);


    return (
        <GestureHandlerRootView>
          <View style={{paddingHorizontal: 20, paddingTop: 30, marginBottom: -80, backgroundColor: Colors.backgroundColor}}>
            <DropDownPicker
                multiple={true}
                min={0}
                theme="DARK"
                mode="BADGE"
                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                placeholder='Select a list to shuffle...'
                style={{backgroundColor: Colors.tabBarColor}}

                open={dropDownOpen}
                setOpen={setDropDownOpen}
                value={selectedLists}
                setValue={setSelectedLists}
                items={Object.keys(lists).map((list) => ({ label: list, value: list }))}
              />
          </View>
          <Spinner 
            list={moviesAndShows} 
            onFinish={handleWinner} 
          />

          {/* Input Section */}
          <View>
            <Pressable style={styles.inputContainer} onPress={() => setSearchModalVisible(true)}>
              <Text
                style={[styles.input, {flex: 1, paddingTop: 15}]}
              >
              {inputText && inputText.length > 0 ? inputText : "Add a show or movie to the wheel"}
              </Text>  
              <TouchableOpacity style={styles.addButton} 
                onPress={() => setSearchModalVisible(true)}
                // onPress={async () => await addSegment(inputText)}
                >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </Pressable>
          </View>

          {/* List of Movies */}
          {/* {searchedContent && searchedContent.length > 0 && (
            <FlatList
              data={searchedContent}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.segmentItem}>
                  <Text style={styles.segmentText}>{item.title}</Text>
                  <TouchableOpacity onPress={() => removeSegment(item)}>
                    <Text style={styles.removeButton}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
              style={styles.list}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No movies added to the wheel yet.</Text>
              }
            />
          )} */}


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
                              <Image source={{ uri: winner.posters && winner.posters.vertical }} style={appStyles.cardPoster} />
                              <View style={[appStyles.cardContent]}>
                                  <Text style={[appStyles.cardTitle, {paddingBottom: 5}]}>{winner.title.split(":").length == 0 ? winner.title : winner.title.split(":")[0]}</Text>
                                  <Text style={appStyles.cardRating}>⭐ 4.2</Text>
                              </View>
                              <Heart 
                                  heartColor={(heartColors && heartColors[winner.id]) || Colors.unselectedHeartColor}
                                  size={35}
                                  // onPress={() => moveItemToFavoriteList(winner.id)}
                                  onPress={async () => await moveItemToTab(winner, FAVORITE_TAB, setLists, setPosterLists, [setAddToListModal], setHeartColors)}
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
                      {winner && Object.keys(lists).filter((list) => list !== FAVORITE_TAB).map((tab, index) => (
                      tab === FAVORITE_TAB ? (
                          <View key={`LandingPage-${winner.id}-heart-${index}`} style={{paddingTop: 10}}>
                          <Heart 
                              heartColor={heartColors[winner?.id] || Colors.unselectedHeartColor}
                              size={35}
                              // onPress={() => moveItemToFavoriteList(winner?.id)}
                              onPress={async () => await moveItemToTab(winner, tab, setLists, setPosterLists, [setAddToListModal], setHeartColors)}
                          />
                          </View>
                      ) : (
                          <TouchableOpacity
                              key={`LandingPage-${winner.id}-${tab}-${index}`}
                              style={[appStyles.modalButton, isItemInList(winner, tab, lists) && appStyles.selectedModalButton]}
                              // onPress={() => moveItemToList(winner, tab)}
                              onPress={async () => await moveItemToTab(winner, tab, setLists, setPosterLists, [setAddToListModal], null)}
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

          {/* Modal for Search */}
          <Modal
              visible={isSearchModalVisible}
              transparent
              animationType="fade"
              onRequestClose={handleModalClose}
            >
              <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); handleModalClose(); }}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalInput}>
                    <TextInput
                      style={[styles.input, {width: screenWidth * 0.7}]}
                      placeholder="Add a show or movie to the wheel"
                      placeholderTextColor="#aaa"
                      value={inputText}
                      onChangeText={setInputText}
                      onSubmitEditing={async () => {Keyboard.dismiss(); await handleAddSegment(); }}
                      returnKeyType="search"
                      autoFocus
                    />
                    <TouchableOpacity style={styles.addButton} onPress={async () => {Keyboard.dismiss(); await handleAddSegment(); }}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            


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

      inputContainer: {
        paddingHorizontal: 20,
        flexDirection: "row",
        marginTop: -50,
        paddingBottom: 50,
        width: "100%",
        backgroundColor: Colors.backgroundColor
      },
      input: {
        backgroundColor: "#4f4f77",
        color: Colors.reviewTextColor,
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        height: 50,
      },
      addButton: {
        backgroundColor: "#6c6c91",
        padding: 10,
        borderRadius: 5,
        height: 50,
        alignContent: "center",
        justifyContent: "center"
      },
      addButtonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center"
      },
      list: {
        flex: 1,
        width: "100%",
        marginBottom: 20,
      },
      segmentItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#4f4f77",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
      },
      segmentText: {
        color: "#fff",
        fontSize: 16,
      },
      removeButton: {
        color: "#ff4d4d",
        fontWeight: "bold",
      },
      emptyText: {
        color: "#aaa",
        textAlign: "center",
        marginTop: 20,
      },

      modalOverlay: {
        flex: 1,
        // flexDirection: "row",
        paddingTop: screenHeight,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalInput: {
        flexDirection: "row",
        paddingBottom: screenHeight,
      },
      modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
      },
});

export default SpinnerPage;