import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, TouchableOpacity, Dimensions, Pressable, Modal } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { Heart } from './components/heartComponent';

const screenWidth = Dimensions.get("window").width;
const scale = 1;
const selectedHeartColor = "#FF2452";
const unselectedHeartColor = "#ECE6F0";

const InfoPage = () => {
  const [rating, setRating] = useState(2.5); // this is the default rating

  const watchItems = ["Planned", "Watching", "Completed"];
  const [watchList, setWatchList] = useState<Set<string>>();
  const [addToListModal, setAddToListModal] = useState(false);

  const [heartColor, setHeartColor] = useState<string>(unselectedHeartColor);

  const [activeTab, setActiveTab] = useState('About');

  const addItemToList = (item: string, list: Set<string>, setList: React.Dispatch<React.SetStateAction<Set<string>>>, setModalFunc: React.Dispatch<React.SetStateAction<boolean>>) => {
    setModalFunc(false);
    if (list) {
      if (list.has(item)) {
        const newList = new Set(list);
        newList.delete(item);
        setList(newList);
      }
      else {
        setList(new Set([...list, item]));
      }
    }
    else {
      setList(new Set(item));
    }
  };

  const isItemInList = (item: string, list: Set<string>) => {
    return list && list.has(item);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'About':
        return (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.text}>
              Shipwrecked on a deserted island, a robot named Roz must learn to adapt to its new surroundings...
            </Text>
            <Text style={styles.sectionTitle}>More Info</Text>
            <Text style={styles.text}>Animation | Sci-Fi | Survival</Text>
            <Text style={styles.sectionTitle}>Cast</Text>
            <View style={styles.castContainer}>
              {/* Add images of cast */}
            </View>
          </View>
        );
      case 'Reviews':
        return (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Text style={styles.text}>No reviews yet. Be the first to add one!</Text>
          </View>
        );
      case 'Recommended':
        return (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <Text style={styles.text}>Explore more movies like this!</Text>
          </View>
        );
      default:
        return null;
    }
  };

  
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.movieContainer}>
        {/* Movie Poster */}
        <Image source={require('../assets/images/posters/getOut.png')} style={styles.posterImage} />
        {/* Movie Info */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>Get Out</Text>
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
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setAddToListModal(false)} // Close modal when tapping outside
              >
                <View style={styles.modalContent}>
                  {watchItems.map((item, index) => (
                    <Pressable 
                      key={index}
                      style={[styles.optionPressable, isItemInList(item, watchList) && styles.selectedOptionPressable]} 
                      onPress={() => addItemToList(item, watchList, setWatchList, setAddToListModal)}
                    >
                      <Text style={styles.optionText}>
                        {item} {isItemInList(item, watchList) ? "✓" : ""}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Pressable>
            </Modal>
            <Heart 
                heartColor={heartColor}
                screenWidth={screenWidth}
                scale={scale}
                onPress={() => (setHeartColor(heartColor === selectedHeartColor ? unselectedHeartColor : selectedHeartColor))}
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
  );
};

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
      fontFamily: "Raleway_800ExtraBold"
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
      marginVertical: 4,
      color: Colors.reviewTextColor,
    },
    castContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 8,
    },
    heartContainer: {
      width: (screenWidth / 10) * scale,
      height: ((4 * screenWidth) / 50) * scale,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center"
    },
    heartLeft: {
      width: 0.079 * screenWidth * scale,
      height: (screenWidth / 20) * scale,
      backgroundColor: "#FDB0C0",
      borderTopLeftRadius: 25,
      borderBottomLeftRadius: 25,
      transform: [{ rotate: "45deg" }],
      position: "absolute",
      left: 0,
    },
    heartRight: {
      width: 0.079 * screenWidth * scale,
      height: (screenWidth / 20) * scale,
      backgroundColor: "#FDB0C0",
      borderTopRightRadius: 25,
      borderBottomRightRadius: 25,
      transform: [{ rotate: "-45deg" }],
      position: "absolute",
      right: 0,
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
});

export default InfoPage;
