import React, { useEffect, useRef, useState } from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Pressable, Alert, Modal, FlatList, TextInput, Keyboard, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import { GestureHandlerRootView, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { Spinner } from './components/spinnerComponent';
import { Content, PosterContent, Posters } from './types/contentType';
import { getContentById, getPostersFromContent, searchByKeywords } from './helpers/fetchHelper';
import { router, SplashScreen, usePathname } from 'expo-router';
import moviesAndTvShows from './data/moviesAndTvShows';
import { Colors } from '@/constants/Colors';
import { appStyles, RalewayFont } from '@/styles/appStyles';
import Heart from './components/heartComponent';
import { Entypo, Feather } from '@expo/vector-icons';
import { PosterList, WatchList } from './types/listsType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClearLoadState, Global, STORAGE_KEY } from '@/Global';
import { DEFAULT_TABS, FAVORITE_TAB, isItemInList, moveItemToTab, sortTabs, turnTabsIntoPosterTabs } from './helpers/listHelper';
import { parse } from '@babel/core';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Prevent splash screen from hiding until everything is loaded
SplashScreen.preventAutoHideAsync();

const SpinnerPage = () => {
    const pathname = usePathname();

    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const [moviesAndShows, setMoviesAndShows] = useState<PosterContent[]>([]);   
    const [searchedContent, setSearchedContent] = useState<PosterContent[]>([]);

    const [winner, setWinner] = useState<PosterContent | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);

    const [inputText, setInputText] = useState<string>("");
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);


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

    const handleEditModalClose = () => {
      // console.log("handle modal close");
    
      setEditModalVisible(false);
    };

    const handleSearchModalClose = () => {
      // console.log("handle modal close");
      setInputText(""); // Clear the input text
      Keyboard.dismiss(); 
      setSearchModalVisible(false);
    };

    const handleAddSegment = async (input: string) => {
      try {
        // console.log(`inpput text: ${input}`);
        await addSegment(input); // Perform your logic
      } catch (error) {
        console.error("Error adding segment:", error);
        Alert.alert("Error", "Failed to add the segment. Please try again.");
      }
    };

    // Function to add a movie to the wheel
    const addSegment = async (inputText) => {
      if (!inputText || inputText.trim() === "") {
        handleSearchModalClose();
        Alert.alert("Input Error", "Please enter a movie name.");
        return;
      }
      
      handleSearchModalClose();

      console.log("isSearching");
      setIsSearching(true);
      try {
        const results = await searchByKeywords(inputText, {
          selectedGenres: [],
          selectedTypes: [],
          selectedServices: [],
          selectedPaidOptions: []
        });

        console.log(`${results.length} results for ${inputText}`);
        
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
      } finally {
        console.log("isNoLongerSearching");
        setIsSearching(false);
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
        if (pathname === "/SpinnerPage" && selectedLists.length > 0) {
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
              if (searchedContent && searchedContent.length > 0) {
                searchedContent.forEach((content) => allContent.push(content));
              }

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

    useEffect(() => {
      setAddToListModal(false);
      setEditModalVisible(false);
      setDropDownOpen(false);
      const loadContent = async () => {
        if (pathname === "/SpinnerPage") {
          Global.backPressLoadLibrary = true;
          try {
            // Load saved tabs from AsyncStorage
            const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedTabs) {
              const parsedTabs: WatchList = savedTabs
                          ? sortTabs({ ...DEFAULT_TABS, ...JSON.parse(savedTabs) }) // Ensure tabs are sorted
                          : DEFAULT_TABS;
              setLists(parsedTabs);   
  
              // Initialize heartColors based on the Favorite tab
              const savedHeartColors = Object.values(parsedTabs).flat().reduce<{ [key: string]: string }>((acc, content: Content) => {
                acc[content.id] = parsedTabs.Favorite.some((fav) => fav.id === content.id)
                  ? Colors.selectedHeartColor
                  : Colors.unselectedHeartColor;
                return acc;
              }, {});
              setHeartColors(savedHeartColors);
            }
            Global.backPressLoadSpinner = false;
          } catch (error) {
            console.error('Error loading library content:', error);
          } finally {
            setIsLoading(false);
            await SplashScreen.hideAsync();
          }
        }
      };
  
      loadContent();
    }, [pathname]); // need this to reload coming back from info page

    if (isLoading) {
      return null; // Show splashcreen until loaded
    }

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
            <Pressable style={styles.inputContainer} onPress={() => {setDropDownOpen(false); setSearchModalVisible(true);}}>
              <View style={{paddingTop: 10, paddingRight: 15}}>
                <Feather name="search" size={28} color="white" />
              </View>
              <Text
                style={[styles.input, {flex: 1, paddingTop: 15}]}
              >
              {inputText && inputText.length > 0 ? inputText : "Find shows or movies to add..."}
              </Text>  
              {/* <TouchableOpacity style={styles.addButton} 
                onPress={() => setSearchModalVisible(true)}
                // onPress={async () => await addSegment(inputText)}
                >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity> */}
              {moviesAndShows && moviesAndShows.length > 0 && (
              <TouchableOpacity style={styles.addButton} 
                onPress={() => {setDropDownOpen(false); setEditModalVisible(true);}}
                // onPress={async () => await addSegment(inputText)}
                >
                <Text style={styles.addButtonText}>Edit</Text>
              </TouchableOpacity>
              )}
            </Pressable>
          </View>

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
                          onPress={() => {
                              Global.backPressLoadSpinner = true;
                              router.push({
                                    pathname: '/InfoPage',
                                    params: { id: winner.id },
                                })  
                            }}
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
              onRequestClose={handleSearchModalClose}
            >
              <Pressable onPress={() => { Keyboard.dismiss(); handleSearchModalClose(); }}>
                <View style={styles.modalOverlay}>
                  <View style={{ marginBottom: screenHeight*1.2, flexDirection: "column"}}>
                    <View style={[styles.modalInput, {zIndex: 10}]}>
                      <TextInput
                        style={[styles.input, {width: screenWidth * 0.7},]}
                        placeholder="Search..."
                        placeholderTextColor="#aaa"
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={async () => {
                          // setIsSearching(true);
                          try {
                            await handleAddSegment(inputText);
                          } finally {
                            // setIsSearching(false);
                          }
                        }}
                        returnKeyType="search"
                        autoFocus
                      />
                      <TouchableOpacity style={styles.addButton} onPress={async () => {
                                                                              setIsSearching(true);
                                                                              try {
                                                                                await handleAddSegment(inputText);
                                                                              } finally {
                                                                                setIsSearching(false);
                                                                              }
                                                                            }}>
                        <Text style={styles.addButtonText}>Add</Text>
                      </TouchableOpacity>
                    </View>                               
                  </View>
                </View>
              </Pressable>

              {/* Loading Overlay */}
              {isSearching && (
                <View style={styles.loadingOverlay}>
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Searching...</Text>
                  </View>
                </View>
              )}
            </Modal>


            {moviesAndShows && moviesAndShows.length > 0 && (
              <Modal
                visible={isEditModalVisible}
                transparent
                animationType="fade"
                onRequestClose={handleEditModalClose}
              >
                  <View style={styles.modalOverlay}>
                    <View style={[styles.modalLayout]}>                      
                        <View style={[styles.modalContainer, { height: 65*(moviesAndShows.length) + 100 }]}>

                        <View style={{marginTop: -8, zIndex: 1000}}>
                          <Entypo name='circle-with-cross' size={30} color={Colors.buttonColor}
                                  style={{
                                      position: "absolute",
                                      padding: 0,
                                      margin: 0,
                                      left: screenWidth*0.74
                                  }} 
                                  onPress={handleEditModalClose} />
                        </View>

                        <Text style={{fontFamily: RalewayFont, textAlign: "center", fontSize: 22, paddingTop: 30}}>Delete any wheel items:</Text>
                        
                        <View style={{paddingTop: 25, maxHeight: screenHeight*0.5}}>
                          <FlatList
                            data={moviesAndShows}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                              <View style={styles.segmentItem}>
                                <Text style={[styles.segmentText]}>{item.title}</Text>
                                <TouchableOpacity onPress={() => removeSegment(item)}>
                                  <Text style={styles.removeButton}>Remove</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                            style={[styles.list]}
                            ListEmptyComponent={
                              <Text style={styles.emptyText}>No movies added to the wheel yet.</Text>
                            }
                          />
                          <View style={{marginBottom: -screenHeight}}></View>

                          </View>

                        </View>                                
                    </View>
                  </View>    
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
        maxHeight: screenHeight*0.44,
        marginBottom: 20,
      },
      segmentItem: {
        flexDirection: "row",
        width: "95%",
        alignSelf: "center",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.unselectedColor,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
      },
      segmentText: {
        color: "#fff",
        fontSize: 16,
        flexWrap: "wrap",
        maxWidth: "80%", 
        paddingRight: 10
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
        paddingTop: screenHeight,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalLayout: {width: screenWidth, marginBottom: screenHeight*1.6, flexDirection: "column", alignItems: "center"},
      modalContainer: {
        backgroundColor: "white",
        opacity: 50,
        borderRadius: 10,
        padding: 20,
        width: '90%',
        minHeight: 100, 
        maxHeight: screenHeight*0.6, 
        marginBottom: 0, 
      },
      modalInput: {
        flexDirection: "row",
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

      loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingContainer: {
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
      },
});

export default SpinnerPage;