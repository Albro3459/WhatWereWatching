import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, TouchableOpacity, Dimensions, Pressable, Modal, FlatList, Alert, TextInput, Linking } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import StarRating from 'react-native-star-rating-widget';
import Heart from './components/heartComponent';
import { Content, PosterContent, Service, StreamingOption } from './types/contentType';
import { useLocalSearchParams, usePathname } from 'expo-router/build/hooks';
import { getContentById, getPostersFromContent, getRandomContent } from './helpers/fetchHelper';
import { MaterialIcons } from '@expo/vector-icons';
import { appStyles, RalewayFont } from '@/styles/appStyles';
import { router } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Global, STORAGE_KEY } from '@/Global';
import { DEFAULT_TABS, FAVORITE_TAB, isItemInList, moveItemToTab, sortTabs, turnTabsIntoPosterTabs } from './helpers/listHelper';
import { PosterList, WatchList } from './types/listsType';

const screenWidth = Dimensions.get("window").width;

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

  const [content, setContent] = useState<PosterContent>();

  type ServiceType = { serviceID: string, price: string, darkThemeImage: string, link: string };
  const streamingServices: () => { freeServices: ServiceType[]; paidServices: ServiceType[] } = () => {
    const set = new Set<string>(); // Use a Set to track unique service names
  
    const serviceObjects: ServiceType[] = Object.values(content.streamingOptions || {}).flatMap((options: StreamingOption[]) => 
      options.map((option: StreamingOption) => {
        const service = option.service;
        const images = service?.imageSet; // Check if ImageSet exists
        const uniqueKey = service?.id || ''; // Use serviceID as unique identifier
  
        if (!set.has(uniqueKey)) {
          set.add(uniqueKey); // Add to Set to ensure uniqueness
          return {
            serviceID: uniqueKey,
            price: getServicePrice(option),
            darkThemeImage: images?.darkThemeImage || '', // Safely access darkThemeImage
            link: option.link || '',
          };
        }
        return null; // Exclude duplicates
      }).filter((item): item is ServiceType => item !== null) // Remove null entries
    );

    const freeServices: ServiceType[] = serviceObjects.filter((service) => service.price === '0');
    const paidServices: ServiceType[] = serviceObjects.filter((service) => service.price != '0');

    return { freeServices, paidServices} ;
  };

  const [isLoading, setIsLoading] = useState(true);
  
  const [rating, setRating] = useState(2.5); // this is the default rating

  const [lists, setLists] = useState<WatchList>(DEFAULT_TABS);
  const [posterLists, setPosterLists] = useState<PosterList>(DEFAULT_TABS as PosterList);

  const [addToListModal, setAddToListModal] = useState(false);

  const [heartColors, setHeartColors] = useState<{[key: string]: string}>();

  const [activeTab, setActiveTab] = useState<string>('About');

   // Reviews
   const [reviews, setReviews] = useState([]);
   const [newReviewText, setNewReviewText] = useState('');
   const [newReviewRating, setNewReviewRating] = useState(0);
   const [addReviewModal, setAddReviewModal] = useState(false);
 
   const [recommendedContent, setRecommendedContent] = useState<PosterContent[]>([]);
   const [selectedRecommendation, setSelectedRecommendation] = useState<PosterContent | null>(null);
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


  const getServicePrice = (option: StreamingOption) : string => {
    const service = option.service;
    if (service && option.price && option.price.amount && option.price.currency === "USD") {
      const priceAmount = parseFloat(option.price.amount);
      if (!isNaN(priceAmount)) {
        return priceAmount === 0 ? "0" : `From $${priceAmount.toFixed(2)}`
      }
    }
    return "0";
  };

  const toHoursAndMinutes = (runtime) => {
    if (!runtime) { return "N/A" }
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const getContentObject = async () => {
      try {
        if (pathname === "/InfoPage" && contentID) {
          setActiveTab('About');
          const getContent = await getContentById(contentID);
          if (getContent) {
            // console.log(`Getting content for ${getContent.title}`);
            const posters = await getPostersFromContent(getContent);
            const updatedContent: PosterContent = { ...getContent, posters };
            setContent(updatedContent);

            try {
              const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
              if (savedTabs) {
                const parsedTabs: WatchList = savedTabs
                            ? sortTabs({ ...DEFAULT_TABS, ...JSON.parse(savedTabs) }) // Ensure tabs are sorted
                            : DEFAULT_TABS;
                setLists(parsedTabs);
                const savedHeartColors = Object.values(parsedTabs).flat().reduce<{ [key: string]: string }>((acc) => {
                  acc[getContent.id] = parsedTabs.Favorite.some((fav) => fav.id === getContent.id)
                    ? Colors.selectedHeartColor
                    : Colors.unselectedHeartColor;
                  return acc;
                }, {});
                setHeartColors(savedHeartColors);
              }
            } catch (error) {
              console.error("Error loading library content:", error);
            }

            const randomContent = await getRandomContent(5);
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
  }, [contentID]);

  const handleAddReview = async () => {
    if (!newReviewText || newReviewRating <= 0) {
      Alert.alert('Error', 'Please provide a review text and a rating.');
      return;
    }

    const newReview = {
      id: `${Date.now()}`,
      user: `@${Global.username || "currentuser"}`,
      text: newReviewText.trim(),
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

            <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
              <Text style={styles.sectionTitle}>Rating:  </Text>
              {Array.from({ length: 5 }).map((_, index) => {
                const rating = parseFloat((content.rating / 20).toFixed(2)); // Calculate the rating on a 5-star scale
                const isFullStar = index < Math.floor(rating); // Full star if index is less than integer part of rating
                const isHalfStar = index >= Math.floor(rating) && index < rating; // Half star if index is fractional

                return (
                  <MaterialIcons
                    key={index}
                    name={isFullStar ? 'star' : isHalfStar ? 'star-half' : 'star-border'}
                    size={16}
                    color="#FFD700"
                  />
                );
              })}
            </View>

            <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
              <Text style={styles.sectionTitle}>{`${content.showType.charAt(0).toUpperCase() + content.showType.slice(1).toLowerCase()}:`}</Text>
              <Text style={[styles.text, {fontSize: 18, paddingLeft: 15, paddingTop: 10, textAlign: 'center', textAlignVertical: "center"}]}>
                  {
                    content.showType === 'movie' ? (
                      content.runtime ? toHoursAndMinutes(content.runtime) : ""
                    ) : (
                      content.seasonCount && content.episodeCount ? `Seasons: ${content.seasonCount}  |  Episodes: ${content.episodeCount}` : ""
                    )
                  }
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.text}>{content.overview}</Text>

            <Text style={styles.sectionTitle}>Where to Watch</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', columnGap: 10, padding: 10 }}>
              {streamingServices().freeServices.map((service, index) => (
                <Pressable
                  key={index}
                  style={{
                    maxWidth: screenWidth / 5,
                    maxHeight: 50,
                    margin: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    if (service.link) {
                      Linking.openURL(service.link).catch(err => console.error("Failed to open URL:", err));
                    } else {
                      console.log("No link available");
                    }
                  }}
                >
                  <SvgUri
                    uri={service.darkThemeImage}
                    width={screenWidth / 5}
                    height={screenWidth / 5}
                  />
                </Pressable>
              ))}
              {streamingServices().paidServices.map((service, index) => (
                <Pressable
                  key={index}
                  style={{
                    maxWidth: screenWidth / 5,
                    maxHeight: 50,
                    margin: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    if (service.link) {
                      Linking.openURL(service.link).catch(err => console.error("Failed to open URL:", err));
                    } else {
                      console.log("No link available");
                    }
                  }}
                >
                  <SvgUri
                    uri={service.darkThemeImage}
                    width={screenWidth / 5}
                    height={screenWidth / 5}
                  />
                  <Text style={{color: Colors.reviewTextColor, fontSize: 12, marginTop: -10, paddingBottom: 10}}>{service.price}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Genre</Text>
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
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  data={reviews}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={appStyles.reviewCard}>
                      <Image source={{ uri: item.avatar }} style={appStyles.avatar} />
                      <View style={appStyles.reviewTextContainer}>
                        <Text style={appStyles.reviewUser}>{item.user}</Text>
                        <Text style={appStyles.reviewText}>{item.text}</Text>
                        <View style={appStyles.ratingContainer}>
                          {/* {Array.from({ length: 5 }).map((_, index) => (
                            <MaterialIcons
                              key={index}
                              name={index < item.rating ? 'star' : 'star-border'}
                              size={16}
                              color="#FFD700"
                            />
                          ))} */}
                          {Array.from({ length: 5 }).map((_, index) => {
                            const isFullStar = index < Math.floor(item.rating); // Full star if index is less than integer part of rating
                            const isHalfStar = index >= Math.floor(item.rating) && index < item.rating; // Half star if index is fractional

                            return (
                              <MaterialIcons
                                key={index}
                                name={isFullStar ? 'star' : isHalfStar ? 'star-half' : 'star-border'}
                                size={16}
                                color="#FFD700"
                              />
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  )}
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
                      multiline={true}
                      style={styles.textInput}
                      placeholder="Write your review..."
                      placeholderTextColor="#aaa"
                      value={newReviewText}
                      onChangeText={setNewReviewText}
                    />
                    <Text style={styles.ratingLabel}>Rating:</Text>
                    <View style={styles.ratingInput}>
                      {/* {Array.from({ length: 5 }).map((_, index) => (
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
                      ))} */}
                      <StarRating
                        rating={newReviewRating}
                        onChange={setNewReviewRating}
                      />
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
                    source={{uri: item && item.posters.vertical }}
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

  //  // Render function for auto generated reviews
  //  const renderReview = ({ item }: {item: Review}) => {

  //   return (
  //     <View style={appStyles.reviewCard}>
  //       <Image source={{ uri: item.avatar }} style={appStyles.avatar} />
  //       <View style={appStyles.reviewTextContainer}>
  //         <Text style={appStyles.reviewUser}>{item.user}</Text>
  //         <Text style={appStyles.reviewText}>{item.text}</Text>
  //         <Text style={appStyles.reviewMovie}>
  //           Movie: {item.contentTitle.length > 0 ? item.contentTitle : "Unknown"}
  //         </Text>
  //         <View style={appStyles.ratingContainer}>
  //           {Array.from({ length: 5 }).map((_, index) => (
  //             <MaterialIcons
  //               key={index}
  //               name={index < item.rating ? "star" : "star-border"}
  //               size={16}
  //               color="#FFD700"
  //             />
  //           ))}
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };
  
  if (isLoading) {
    return null; // Prevent rendering until loaded
  }

  return (
    <View style={styles.screen} >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.movieContainer}>
          {/* Movie Poster */}
          <Image source={{ uri: content && content.posters.vertical }} style={styles.posterImage} />
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
                    {Object.keys(lists).filter((list) => list !== FAVORITE_TAB).map((list, index) => (
                      <Pressable 
                        key={index}
                        style={[styles.optionPressable, isItemInList(content, list, lists) && styles.selectedOptionPressable]} 
                        // onPress={() => moveItemToList(content, list)}
                        onPress={async () => await moveItemToTab(content, list, setLists, setPosterLists, [setAddToListModal], null)}
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
                  heartColor={(heartColors && heartColors[content.id]) ||Colors.unselectedHeartColor}
                  size={45}
                  // onPress={() => moveItemToFavoriteList(content.id)}
                  onPress={async () => await moveItemToTab(content, FAVORITE_TAB, setLists, setPosterLists, [setAddToListModal], setHeartColors)}
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
              {selectedRecommendation && (
                <>
                  {/* Render all tabs except FAVORITE_TAB */}
                  {Object.keys(lists)
                    .filter((tab) => tab !== FAVORITE_TAB)
                    .map((tab, index) => (
                      <TouchableOpacity
                        key={`LandingPage-${selectedRecommendation.id}-${tab}-${index}`}
                        style={[
                          appStyles.modalButton,
                          isItemInList(selectedRecommendation, tab, lists) && appStyles.selectedModalButton,
                        ]}
                        onPress={async () => await moveItemToTab(selectedRecommendation, tab, setLists, setPosterLists, [setInfoModalVisible], null)}
                      >
                        <Text style={appStyles.modalButtonText}>
                          {tab} {isItemInList(selectedRecommendation, tab, lists) ? "✓" : ""}
                        </Text>
                      </TouchableOpacity>
                    ))}

                  {/* Render FAVORITE_TAB at the bottom */}
                  {lists[FAVORITE_TAB] && (
                    <View
                      key={`LandingPage-${selectedRecommendation.id}-heart`}
                      style={{ paddingTop: 10 }}
                    >
                      <Heart
                        heartColor={
                          heartColors[selectedRecommendation?.id] || Colors.unselectedHeartColor
                        }
                        size={35}
                        onPress={async () => await moveItemToTab(selectedRecommendation, FAVORITE_TAB, setLists, setPosterLists, [setInfoModalVisible], setHeartColors)}
                      />
                    </View>
                  )}
                </>
              )}
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
      width: screenWidth*0.8,
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
      borderRadius: 8,
      marginBottom: 20,
      width: "100%",
      minHeight: 50,
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
