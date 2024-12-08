import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, TouchableOpacity, Dimensions, Pressable, Modal, FlatList, Alert, TextInput } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import StarRating from 'react-native-star-rating-widget';
import Heart from './components/heartComponent';
import { Content } from './types/contentType';
import { useLocalSearchParams, usePathname } from 'expo-router/build/hooks';
import { getContentById, getPosterByContent, getRandomContent } from './helpers/fetchHelper';
import { MaterialIcons } from '@expo/vector-icons';
import { appStyles, RalewayFont } from '@/styles/appStyles';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '@/Global';
import { isItemInList } from './helpers/listHelper';
import { WatchList } from './types/listsType';

const screenWidth = Dimensions.get("window").width;
const scale = 1;
const selectedHeartColor = "#FF2452";
const unselectedHeartColor = "#ECE6F0";

const REVIEW_STORAGE_KEY = 'movie_reviews';

interface InfoPageParams {
  id?: string;
}

// Prevent splash screen from hiding until everything is loaded
SplashScreen.preventAutoHideAsync();

function InfoPage() {
  const pathname = usePathname();

  const { id } = useLocalSearchParams() as InfoPageParams;
  const contentID = id ? id.toString() : null;

  const [content, setContent] = useState<Content>();

  const [isLoading, setIsLoading] = useState(true);
  
  const [rating, setRating] = useState(2.5); // this is the default rating

  const [lists, setLists] = useState<WatchList>({
    Planned: [],
    Watching: [],
    Completed: [],
    Favorite: [],
  });
  // const [watchList, setWatchList] = useState<Set<string>>();
  const [addToListModal, setAddToListModal] = useState(false);

  const [heartColors, setHeartColors] = useState<{[key: string]: string}>();

  const [activeTab, setActiveTab] = useState<string>('About');

   // Reviews
   const [reviews, setReviews] = useState([]);
   const [newReviewText, setNewReviewText] = useState('');
   const [newReviewRating, setNewReviewRating] = useState(0);
   const [addReviewModal, setAddReviewModal] = useState(false);
 
   const [recommendedContent, setRecommendedContent] = useState<Content[]>([]);
   const [selectedRecommendation, setSelectedRecommendation] = useState<Content | null>(null);
   const [infoModalVisible, setInfoModalVisible] = useState(false);

   type Review = {
    contentTitle: any;
    id: string;
    user: string;
    text: string;
    rating: number;
    avatar: string;
    contentID: string; // ID of the movie or show this review is for
  };

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

      setInfoModalVisible(false);
  
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
      
      setAddToListModal(false);
      setInfoModalVisible(false);
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

  useEffect(() => {
    const getContentObject = async () => {
      try {
        if (pathname === "/InfoPage" && contentID) {
          setActiveTab('About');
          const getContent = await getContentById(contentID);
          if (getContent) {
            setContent(getContent);

            try {
              const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
              if (savedTabs) {
                const parsedTabs = JSON.parse(savedTabs);
                setLists(parsedTabs);
                const savedHeartColors = Object.values(parsedTabs).flat().reduce<{ [key: string]: string }>((acc) => {
                  acc[getContent.id] = parsedTabs.Favorite.some((fav) => fav.id === getContent.id)
                    ? selectedHeartColor
                    : unselectedHeartColor;
                  return acc;
                }, {});
                setHeartColors(savedHeartColors);
              }
            } catch (error) {
              console.error("Error loading library content:", error);
            }

            const randomContent = await getRandomContent(4);
            if (randomContent) {
              setRecommendedContent(randomContent);
            }

            // Load and filter reviews for the current content
            const storedReviews = await AsyncStorage.getItem(REVIEW_STORAGE_KEY);
            if (storedReviews) {
              const parsedReviews = JSON.parse(storedReviews);
              const filteredReviews = parsedReviews.filter((review) => review.contentID === contentID);
              setReviews(filteredReviews);
            }
          } else {
            console.log(`Content not found for ID: ${contentID}`);
          }
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setIsLoading(false);
        await SplashScreen.hideAsync();
      }
    };

    getContentObject();
  }, [pathname, contentID]);

  const handleAddReview = async () => {
    if (!newReviewText || newReviewRating <= 0) {
      Alert.alert('Error', 'Please provide a review text and a rating.');
      return;
    }

    const newReview = {
      id: `${Date.now()}`,
      user: '@currentuser',
      text: newReviewText,
      rating: newReviewRating,
      avatar: 'https://via.placeholder.com/50',
      contentID,
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);

    try {
      const storedReviews = await AsyncStorage.getItem(REVIEW_STORAGE_KEY);
      const allReviews = storedReviews ? JSON.parse(storedReviews) : [];
      const updatedAllReviews = [...allReviews, newReview];
      await AsyncStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(updatedAllReviews));
      Alert.alert('Success', 'Your review has been added!');
    } catch (error) {
      console.error('Error saving review:', error);
    }

    setNewReviewText('');
    setNewReviewRating(0);
    setAddReviewModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'About':
        return (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.text}>{content.overview}</Text>
            <Text style={styles.sectionTitle}>More Info</Text>
            <Text style={styles.text}>{
                content.genres.map((genre) => (
                    genre.name
                  )).join(' | ')}
            </Text>
            <Text style={styles.sectionTitle}>Cast</Text>
            <Text style={styles.text}>
              {content.cast.join(' | ')}
            </Text>
          </View>
        );
        case 'Reviews':
          return (
            <View style={styles.content}>
              <Text style={[styles.sectionTitle, { paddingBottom: 10 }]}>Reviews</Text>
              {reviews.length === 0 ? (
                <Text style={styles.text}>No reviews yet. Be the first to add one!</Text>
              ) : (
                <FlatList
                  data={reviews}
                  renderItem={({ item }) => (
                    <View style={appStyles.reviewCard}>
                      <Image source={{ uri: item.avatar }} style={appStyles.avatar} />
                      <View style={appStyles.reviewTextContainer}>
                        <Text style={appStyles.reviewUser}>{item.user}</Text>
                        <Text style={appStyles.reviewText}>{item.text}</Text>
                        <View style={appStyles.ratingContainer}>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <MaterialIcons
                              key={index}
                              name={index < item.rating ? 'star' : 'star-border'}
                              size={16}
                              color="#FFD700"
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
              )}
              <Button title="Add Review" onPress={() => setAddReviewModal(true)} />
  
              <Modal
                transparent
                visible={addReviewModal}
                animationType="slide"
                onRequestClose={() => setAddReviewModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add a Review</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Write your review..."
                      placeholderTextColor="#aaa"
                      value={newReviewText}
                      onChangeText={setNewReviewText}
                    />
                    <Text style={styles.ratingLabel}>Rating:</Text>
                    <View style={styles.ratingInput}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Text
                          key={index}
                          style={[
                            styles.ratingStar,
                            { color: index < newReviewRating ? '#FFD700' : '#aaa' },
                          ]}
                          onPress={() => setNewReviewRating(index + 1)}
                        >
                          ★
                        </Text>
                      ))}
                    </View>
                    <View style={styles.modalButtons}>
                      <Button title="Cancel" onPress={() => setAddReviewModal(false)} />
                      <Button title="Submit" onPress={handleAddReview} />
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          );
      case 'Recommended':
        return (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <Text style={styles.text}>Explore more movies like this!</Text>
            <FlatList
              data={recommendedContent}
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={appStyles.movieCard}
                  onPress={() => router.push({
                                      pathname: '/InfoPage',
                                      params: { id: item.id },
                                    })}
                  onLongPress={() => {setSelectedRecommendation(item); setInfoModalVisible(true);}}
                >
                  <Image
                    source={{uri: getPosterByContent(item)}}
                    style={appStyles.movieImage}
                  />
                  <Text style={appStyles.movieTitle}>{item.title}</Text>
                </Pressable>
              )}
            />
          </View>
        );
        default:
          break;
      }
    };
  
    if (isLoading) {
      return null; // Prevent rendering until loaded
    }

   // Render function for reviews
   const renderReview = ({ item }: {item: Review}) => {

    return (
      <View style={appStyles.reviewCard}>
        <Image source={{ uri: item.avatar }} style={appStyles.avatar} />
        <View style={appStyles.reviewTextContainer}>
          <Text style={appStyles.reviewUser}>{item.user}</Text>
          <Text style={appStyles.reviewText}>{item.text}</Text>
          <Text style={appStyles.reviewMovie}>
            Movie: {item.contentTitle.length > 0 ? item.contentTitle : "Unknown"}
          </Text>
          <View style={appStyles.ratingContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <MaterialIcons
                key={index}
                name={index < item.rating ? "star" : "star-border"}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
        </View>
      </View>
    );
  };
  
  if (isLoading) {
    return null; // Prevent rendering until loaded
  }

  return (
    <View style={styles.screen} >
      <ScrollView >
        <View style={styles.movieContainer}>
          {/* Movie Poster */}
          <Image source={{ uri: getPosterByContent(content) }} style={styles.posterImage} />
          {/* Movie Info */}
          <View style={styles.infoSection}>
            <Text style={styles.title}>{content && content.title}</Text>
            <View style={styles.attributeContainer} >
              {/* <Text style={styles.rating}>⭐ 4.7/5</Text> */}
              <StarRating
                rating={rating}
                onChange={setRating}
              />
            </View>
            <View style={styles.attributeContainer} >
              <TouchableOpacity
                style={styles.button}
                onPress={() => setAddToListModal(true)}
              >
                <Text style={styles.buttonText}>Add to List</Text>
              </TouchableOpacity>

              <Modal
                transparent={true}
                visible={addToListModal}
                animationType="fade"
                onRequestClose={() => setAddToListModal(false)}
              >
                {/* so that the modal will close when u tap outside */}
                <Pressable
                  style={styles.modalOverlay}
                  onPress={() => setAddToListModal(false)}
                >
                  <View style={styles.modalContent}>
                    {Object.keys(lists).slice(0,3).map((list, index) => (
                      <Pressable 
                        key={index}
                        style={[styles.optionPressable, isItemInList(content, list, lists) && styles.selectedOptionPressable]} 
                        onPress={() => moveItemToList(content, list)}
                      >
                        <Text style={styles.optionText}>
                          {list} {isItemInList(content, list, lists) ? "✓" : ""}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </Pressable>
              </Modal>
              <Heart 
                  heartColor={(heartColors && heartColors[content.id]) || unselectedHeartColor}
                  size={45}
                  onPress={() => moveItemToFavoriteList(content.id)}
              />
            </View>
          </View>
        </View>

        <View style={styles.tabContainer}>
          {['About', 'Reviews', 'Recommended'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}
      </ScrollView>

      {/* Move Modal */}
      {selectedRecommendation && (
        <Modal
            transparent={true}
            visible={infoModalVisible}
            animationType="fade"
            onRequestClose={() => setInfoModalVisible(false)}
          >
            <Pressable
              style={appStyles.modalOverlay}
              onPress={() => setInfoModalVisible(false)}
            >
              <View style={appStyles.modalContent}>
                <Text style={appStyles.modalTitle}>
                  Move "{selectedRecommendation?.title}" to:
                </Text>
                {selectedRecommendation && Object.keys(lists).map((tab, index) => (
                  tab === "Favorite" ? (
                    <View key={`LandingPage-${selectedRecommendation.id}-heart-${index}`} style={{paddingTop: 10}}>
                      <Heart 
                        heartColor={heartColors[selectedRecommendation?.id] || unselectedHeartColor}
                        size={35}
                        onPress={() => moveItemToFavoriteList(selectedRecommendation?.id)}
                      />
                    </View>
                  ) : (
                     <TouchableOpacity
                        key={`LandingPage-${selectedRecommendation.id}-${tab}-${index}`}
                        style={[appStyles.modalButton, isItemInList(selectedRecommendation, tab, lists) && appStyles.selectedModalButton]}
                        onPress={() => moveItemToList(selectedRecommendation, tab)}
                      >
                        <Text style={appStyles.modalButtonText}>
                          {tab} {isItemInList(selectedRecommendation, tab, lists) ? "✓" : ""}
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
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 16, 
        backgroundColor: Colors.backgroundColor,
    },
    movieContainer: {
      // backgroundColor: "white",
      paddingVertical: "4%",
      borderRadius: 15,
      marginVertical: "5%",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5, // For Android shadow
    },
    attributeContainer: {
      flexDirection: 'row', 
      columnGap: 15, 
      paddingTop: 10,
      alignContent: "center"
    },
    posterImage: {
      width: 200,
      height: 300,
      borderRadius: 10,
      marginBottom: 16,
    },
    infoSection: {
      alignItems: "center", // Centers text under the poster
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      color: "white",
      fontFamily: RalewayFont
    },
    rating: {
      fontSize: 16,
      color: Colors.reviewTextColor,
      marginTop: 4,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 16,
    },
    tabContainer: {
      flexDirection: 'row',
      columnGap: 10,
      borderRadius: 8,
      marginTop: 16,
    },
    tab: {
      padding: 12,
      alignItems: 'center',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      backgroundColor: Colors.unselectedColor,
    },
    activeTab: {
      backgroundColor: Colors.selectedColor,
    },
    tabText: {
      color: Colors.reviewTextColor,
      fontSize: 16,
      fontWeight: 'bold',
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    content: {
      padding: 16,
      marginBottom: 100,
      backgroundColor: Colors.selectedColor,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 8,
      color: 'white',
    },
    text: {
      fontSize: 14,
      color: Colors.reviewTextColor,
      marginVertical: 4,
      paddingBottom: 10,
    },
    castContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 8,
    },
    button: {
      backgroundColor: Colors.buttonColor,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 10,
      width: 200,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: Colors.cardBackgroundColor,
      borderRadius: 10,
      padding: 20,
      width: 250,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    optionPressable: {
      backgroundColor: Colors.unselectedColor,
      width: "90%",
      borderRadius: 10,
      margin: 5
    },
    selectedOptionPressable: {
      backgroundColor: Colors.selectedColor,
    },
    optionText: {
      fontSize: 16,
      color: "white",
      paddingVertical: 10,
      textAlign: "center",
      width: "100%",
    },
    textInput: {
      backgroundColor: '#333',
      color: '#fff',
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
    },
    ratingLabel: {
      color: '#fff',
      fontSize: 16,
      marginBottom: 10,
    },
    ratingInput: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    ratingStar: {
      fontSize: 30,
      marginHorizontal: 5,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff', // Adjust this to match your color scheme
      marginBottom: 15,
      textAlign: 'center',
    },
});

export default InfoPage;
