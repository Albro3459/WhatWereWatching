import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, FlatList, Image, TouchableOpacity, Pressable } from "react-native";
import { Card, Title, Button, Searchbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, router, usePathname } from "expo-router";
import { Colors } from "@/constants/Colors";
import { getContentById, getPosterByContent, getRandomContent } from "./helpers/fetchHelper";
import { Content } from "./types/contentType";
import { appStyles } from "@/styles/appStyles";

function LandingPage () {
    const pathname = usePathname();
  
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
                  color="#FFD700"
                />
              ))}
            </View>
          </View>
        </View>
      );
    };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>WELCOME BACK JOHN!</Text>
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
      {/* Filter Section */}
      {/* <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>FILTER</Text>
        <View style={styles.filterOptions}>
          <View>
            <Text style={styles.filterText}>Genre</Text>
            <Text style={styles.filterText}>Fantasy | Action | Romance</Text>
          </View>
          <View>
            <Text style={styles.filterText}>Media Type</Text>
            <Text style={styles.filterText}>Movies | Shows</Text>
          </View>
          <Button mode="contained" style={styles.filterButton} onPress={() => router.push('/SearchPage')}>
            Search
          </Button>
        </View>
      </View> */}
      <Pressable style={styles.filterButton} onPress={() => router.push('/SearchPage')}>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>Search</Text>
      </Pressable>
    </ScrollView>
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
    fontSize: 24,
    fontWeight: "bold",
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
    marginTop: 10,
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
});

export default LandingPage;

