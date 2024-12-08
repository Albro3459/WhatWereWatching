import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, FlatList, Image, TouchableOpacity, Pressable, Dimensions, Alert, Modal } from "react-native";
import { Card, Title, Button, Searchbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, router, usePathname } from "expo-router";
import { Colors } from "@/constants/Colors";
import { getContentById, getPosterByContent, getRandomContent } from "./helpers/fetchHelper";
import { Content } from "./types/contentType";
import { appStyles, RalewayFont } from "@/styles/appStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Heart from "./components/heartComponent";
import { Global, STORAGE_KEY } from "@/Global";
import { isItemInList } from "./helpers/listHelper";


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const scale = .75;
const selectedHeartColor = "#FF2452";
const unselectedHeartColor = "#ECE6F0";

const LIBRARY_OVERLAY_HEIGHT = screenHeight*.095

function LandingPage () {
    const pathname = usePathname();

    const [name, setName] = useState<string>(Global.name);

    const tabList = ["Planned", "Watching", "Completed", "Favorite"];
    const [heartColors, setHeartColors] = useState<{ [key: string]: string }>({});  
    const [isLoading, setIsLoading] = useState(true);
    const [selectedContent, setSelectedContent] = useState<Content>(null);
    const [listModalVisible, setListModalVisible] = useState(false);

    // State to manage the currently displayed movie
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [carouselContent, setCarouselContent] = useState<Content[]>([]);
    const [moviesAndShows, setMoviesAndShows] = useState<Content[]>([]);    
    
    type Review = {
      id: string;
      user: string;
      text: string;
      rating: number;
      avatar: string;
      contentID: string,
      contentTitle: string
    };
    // Array of reviews
    const [reviews, setReviews] = useState<Review[]>([
      {
        id: "1",
        user: "@larryjustice",
        text: "The movie made me shed so many tears.",
        rating: 5,
        avatar: "https://via.placeholder.com/50",
        contentID: "110",
        contentTitle: ""
      },
      {
        id: "2",
        user: "@janedoe",
        text: "A fantastic emotional journey.",
        rating: 4,
        avatar: "https://via.placeholder.com/50",
        contentID: "146",
        contentTitle: ""
      },
      {
        id: "3",
        user: "@movielover",
        text: "A must-watch for everyone!",
        rating: 5,
        avatar: "https://via.placeholder.com/50",
        contentID: "396",
        contentTitle: ""
      },
      {
        id: "4",
        user: "@cinemafan",
        text: "Visually stunning and heartfelt.",
        rating: 4,
        avatar: "https://via.placeholder.com/50",
        contentID: "462",
        contentTitle: ""
      },
    ]);

    useEffect(() => {
      const fetchProfile = () => {
          if (pathname === "/LandingPage") {
              setName(Global.name);
          }
      };  
      fetchProfile();
  }, [pathname, Global.name]);

    useEffect(() => {
      setListModalVisible(false);
      const loadContent = async () => {
        if (pathname === "/LandingPage") {
          try {
            // Load saved tabs from AsyncStorage
            // console.log('LandingPage: Loading async storage ');
            const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedTabs) {
              const parsedTabs = JSON.parse(savedTabs);

              // Extract only favorites initially
              const savedHeartColors = (parsedTabs.Favorite || []).reduce((acc, content) => {
                acc[content.id] = selectedHeartColor;
                // console.log(
                //   `Setting Heart Color: ID=${content.id}, Title="${content.title}", HeartColor=${selectedHeartColor}`
                // );
                return acc;
              }, {});
              setHeartColors(savedHeartColors || {});
            }
          } catch (error) {
            console.error('Error loading library content:', error);
          } finally {
            setIsLoading(false);
          }
        }
      };
  
      loadContent();
    }, [pathname]);
  
    const moveItemToFavoriteTab = async (id: string) => {
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
    
        // Save updated tabs to AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));
    
        // Show success alert
        Alert.alert(
          "Success",
          isFavorite
            ? `Removed "${item.title}" from Favorites`
            : `Added "${item.title}" to Favorites`
        );
    
        setListModalVisible(false); // Close the modal
      } catch (error) {
        console.error("Error updating Favorites:", error);
        Alert.alert("Error", "Unable to update Favorites. Please try again.");
      }
    };
  
    const moveItemToTab = async (item: Content, targetTab: string) => {
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
    
        // Save updated tabs back to AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));
    
        // Show success alert
        Alert.alert(
          "Success",
          isItemInTargetTab
            ? `Removed "${item.title}" from "${targetTab}"`
            : `Moved "${item.title}" to "${targetTab}"`
        );
    
        // Close the modal
        setListModalVisible(false);
      } catch (error) {
        console.error("Error updating tabs:", error);
      }
    };
    

    // Function to handle the Next button
    const handleNextMovie = () => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselContent.length); // Loop back to the first movie
    };
  
    // Function to handle the Previous button
    const handlePreviousMovie = () => {
      setCarouselIndex((prevIndex) =>
        prevIndex === 0 ? carouselContent.length - 1 : prevIndex - 1
      );
    };

    useEffect(() => {
      const fetchRecommendedMovies  = async () => {
        if (pathname === "/LandingPage") {
          if (!moviesAndShows || moviesAndShows.length == 0) {

            const randomContent = await getRandomContent(10);
            if (randomContent) {
              setMoviesAndShows(randomContent.slice(0, 5));
              setCarouselContent(randomContent.slice(5, 9));
            }
            
            const updatedReviews = await Promise.all(
              reviews.map(async (review) => {
                const content = await getContentById(review.contentID);
                // console.log(`review id: ${review.id} has title ${content.title}`);
                return {
                  ...review,
                  contentTitle: content?.title || "Unknown",
                };
              })
            );
            setReviews(updatedReviews);
          }
        }
      }
      fetchRecommendedMovies();
    }, [pathname]);     

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
                  color={Colors.goldColor}
                />
              ))}
            </View>
          </View>
        </View>
      );
    };

  return (
    <View style={styles.container} >
      <ScrollView style={{ marginBottom: LIBRARY_OVERLAY_HEIGHT}} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeText}>WELCOME BACK {Global.name.length > 0 ? Global.name.toUpperCase() : "USER"}!</Text>
        {/* Trending Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRENDING</Text>
          <Pressable onPress={() => router.push({
                                    pathname: '/InfoPage',
                                    params: { id: carouselContent[carouselIndex].id },
                    })}>
            <Card style={styles.trendingCard}>
              <Image source={{ uri: getPosterByContent(carouselContent[carouselIndex], false)}} style={styles.trendingImage} />
              <Card.Content>
                <Title style={styles.trendingTitle}>
                  {carouselContent && carouselContent[carouselIndex] && carouselContent[carouselIndex].title}
                </Title>
              </Card.Content>
            </Card>
          </Pressable>

          {/* Circular Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              onPress={handlePreviousMovie}
              style={styles.circleButton}
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextMovie} style={styles.circleButton}>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Most Recommended Section */}
        <View style={[styles.section, { height: 200 }]}>
          <Text style={styles.sectionTitle}>MOST RECOMMENDED</Text>
          <FlatList
            data={moviesAndShows}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.movieCard}
                onPress={() => router.push({
                        pathname: '/InfoPage',
                        params: { id: item.id },
                      })}
                onLongPress={() => {
                  setSelectedContent(item);
                  setListModalVisible(true);
                }}
              >
                <Image
                  source={{uri: getPosterByContent(item)}}
                  style={styles.movieImage}
                />
                <Text style={styles.movieTitle}>{item.title}</Text>
              </Pressable>
            )}
          />
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOP REVIEWS</Text>
          <FlatList
            data={reviews}
            renderItem={renderReview}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
          />
        </View>

      </ScrollView>

      {/* Move Modal */}
      {selectedContent && (
        <Modal
            transparent={true}
            visible={listModalVisible}
            animationType="fade"
            onRequestClose={() => setListModalVisible(false)}
          >
            <Pressable
              style={appStyles.modalOverlay}
              onPress={() => setListModalVisible(false)}
            >
              <View style={appStyles.modalContent}>
                <Text style={appStyles.modalTitle}>
                  Move "{selectedContent?.title}" to:
                </Text>
                {selectedContent && tabList.map((tab, index) => (
                  tab === "Favorite" ? (
                    <View key={`LandingPage-${selectedContent.id}-heart-${index}`} style={{paddingTop: 10}}>
                      <Heart 
                        heartColor={heartColors[selectedContent?.id] || unselectedHeartColor}
                        size={35}
                        onPress={() => moveItemToFavoriteTab(selectedContent?.id)}
                      />
                    </View>
                  ) : (
                     <TouchableOpacity
                        key={`LandingPage-${selectedContent.id}-${tab}-${index}`}
                        style={[appStyles.modalButton, isItemInList(selectedContent, tab, tabList) && appStyles.selectedModalButton]}
                        onPress={() => moveItemToTab(selectedContent, tab)}
                      >
                        <Text style={appStyles.modalButtonText}>
                          {tab} {isItemInList(selectedContent, tab, tabList) ? "✓" : ""}
                        </Text>
                      </TouchableOpacity>
                  )
                ))}
              </View>
            </Pressable>
        </Modal>
      )}

      <View style={styles.libraryOverlay}>
          <TouchableOpacity
            style={styles.libraryButton}
            onPress={() => router.push('/LibraryPage')} // Navigate to the Library page
            >
              <Text style={styles.libraryButtonText}>Library</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 26,
    // fontWeight: "bold",
    fontFamily: RalewayFont,
    color: "#fff",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  trendingCard: {
    backgroundColor: Colors.cardBackgroundColor,
    borderRadius: 10,
  },
  trendingImage: {
    height: 200,
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  trendingTitle: {
    color: "#fff",
    top: 8,
    fontFamily: RalewayFont,
    textAlign: "center",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 13,
  },
  circleButton: {
    width: 50,
    height: 50,
    backgroundColor: Colors.buttonColor,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  movieCard: {
    width: 11*7,
    marginRight: 15,
    overflow: "hidden"
  },
  movieImage: {
    height: 16*7,
    aspectRatio: 11 / 16,
    borderRadius: 8,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  filterSection: {
    backgroundColor: Colors.cardBackgroundColor,
    padding: 20,
    borderRadius: 10,
    marginBottom: 50
  },
  filterOptions: {
    marginTop: 10,
  },
  filterText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  filterButton: {
    backgroundColor: Colors.buttonColor,
    width: 125,
    height: 50,
    borderRadius: 10,

    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 60,    
    
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  libraryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: LIBRARY_OVERLAY_HEIGHT,
    backgroundColor: Colors.tabBarColor,
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  libraryButton: {
    width: screenWidth*.5,
    height: screenHeight*.06,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: Colors.selectedTabColor, 
    alignContent: "center",
    justifyContent: "center"
  },
  libraryButtonText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: RalewayFont,
    textAlign:"center",
  },
});

export default LandingPage;

