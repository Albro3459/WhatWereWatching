import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, FlatList, Image, TouchableOpacity, Pressable } from "react-native";
import { Card, Title, Button, Searchbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

const LandingPage = () => {
    // Array of trending movies
    const trendingMovies = [
      { id: "1", title: "The Wild Robot (2024)", image: require("../assets/images/wildrobot.jpg") },
      { id: "2", title: "Inside Out (2015)", image: require("../assets/images/insideout.jpg") },
      { id: "3", title: "Finding Nemo (2003)", image: require("../assets/images/nemo.jpeg") },
    ];
  
    // State to manage the currently displayed movie
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  
    // Function to handle the Next button
    const handleNextMovie = () => {
      setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % trendingMovies.length); // Loop back to the first movie
    };
  
    // Function to handle the Previous button
    const handlePreviousMovie = () => {
      setCurrentMovieIndex((prevIndex) =>
        prevIndex === 0 ? trendingMovies.length - 1 : prevIndex - 1
      );
    };
    const recommendedMovies = [
      { id: "1", title: "Joker", image: require("../assets/images/posters/joker.png") },
      { id: "2", title: "Elf", image: require("../assets/images/posters/elf.png") },
      { id: "3", title: "Shrek", image: require("../assets/images/posters/shrek.png") },
      { id: "4", title: "Star Wars", image: require("../assets/images/posters/starWars.png") },
      { id: "5", title: "Get Out", image: require("../assets/images/posters/getOut.png") },
      { id: "6", title: "Beauty and the Beast", image: require("../assets/images/posters/beautyAndTheBeast.png") },
    ];
    // Array of reviews
    const reviews = [
      {
        id: "1",
        user: "@larryjustice",
        text: "The movie made me shed so many tears.",
        rating: 5,
        avatar: "https://via.placeholder.com/50",
        movieId: "1",
      },
      {
        id: "2",
        user: "@janedoe",
        text: "A fantastic emotional journey.",
        rating: 4,
        avatar: "https://via.placeholder.com/50",
        movieId: "2",
      },
      {
        id: "3",
        user: "@movielover",
        text: "A must-watch for everyone!",
        rating: 5,
        avatar: "https://via.placeholder.com/50",
        movieId: "3",
      },
      {
        id: "4",
        user: "@cinemafan",
        text: "Visually stunning and heartfelt.",
        rating: 4,
        avatar: "https://via.placeholder.com/50",
        movieId: "1",
      },
    ];

    // Render function for reviews
    const renderReview = ({ item }) => {
      // Find the movie associated with the review
      const associatedMovie = trendingMovies.find((movie) => movie.id === item.movieId);
  
      return (
        <View style={styles.reviewCard}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.reviewTextContainer}>
            <Text style={styles.reviewUser}>{item.user}</Text>
            <Text style={styles.reviewText}>{item.text}</Text>
            <Text style={styles.reviewMovie}>
              Movie: {associatedMovie?.title || "Unknown"}
            </Text>
            <View style={styles.ratingContainer}>
              {Array.from({ length: 5 }).map((_, index) => (
                <MaterialIcons
                  key={index}
                  name={index < item.rating ? "star" : "star-border"}
                  size={16}
                  color="#FFD700" // Gold color for stars
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
        <Pressable onPress={() => (router.push('/InfoPage'))}>
          <Card style={styles.trendingCard}>
            <Image source={trendingMovies[currentMovieIndex].image} style={styles.trendingImage} />
            <Card.Content>
              <Title style={styles.trendingTitle}>
                {trendingMovies[currentMovieIndex].title}
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
      <View style={[styles.section, {height: "13%"}]}>
        <Text style={styles.sectionTitle}>MOST RECOMMENDED</Text>
        <FlatList
          data={recommendedMovies}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.movieCard} onPress={() => (router.push('/InfoPage'))}>
              <Image source={item.image} style={styles.movieImage} />
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
          keyExtractor={(item) => item.id}
        />
      </View>
      {/* Filter Section */}
      <View style={styles.filterSection}>
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
          <Button mode="contained" style={styles.filterButton}>
            Search
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

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
    height: 150,
    width: "100%",
    borderRadius: 10,
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
    // flexWrap: "wrap",
  },
  filterSection: {
    backgroundColor: Colors.cardBackgroundColor,
    padding: 20,
    borderRadius: 10,
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
    marginTop: 15,
    backgroundColor: Colors.buttonColor,
  },
  reviewCard: {
    flexDirection: "row",
    backgroundColor: Colors.cardBackgroundColor,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewTextContainer: {
    flex: 1,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  reviewText: {
    fontSize: 14,
    color: Colors.reviewTextColor,
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewMovie: {
    fontSize: 14,
    color: Colors.italicTextColor,
    marginBottom: 5,
    fontStyle: "italic",
  },
});

export default LandingPage;

