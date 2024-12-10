import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  Alert,
  Pressable,
  Dimensions,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from "expo-splash-screen";
import { getPosterByContent } from './helpers/fetchHelper';
import { router, usePathname } from 'expo-router';
import Heart from './components/heartComponent';
import { Content } from './types/contentType';
import { appStyles } from '@/styles/appStyles';
import { STORAGE_KEY } from '@/Global';
import { Colors } from '@/constants/Colors';
import { WatchList } from './types/listsType';
import { isItemInList } from './helpers/listHelper';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const scale = .75;
const selectedHeartColor = "#FF2452";
const unselectedHeartColor = "#ECE6F0";

// Prevent splash screen from hiding until everything is loaded
SplashScreen.preventAutoHideAsync();

const LibraryPage = () => {
  const pathname = usePathname();
  const pagerViewRef = useRef(null);

  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState<WatchList>({
    Planned: [],
    Watching: [],
    Completed: [],
    Favorite: [],
  });
  const [heartColors, setHeartColors] = useState<{ [key: string]: string }>({});  

  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Content>(null);
  const [moveModalVisible, setMoveModalVisible] = useState(false);

  useEffect(() => {
    setMoveModalVisible(false);
    const loadContent = async () => {
      if (pathname === "/LibraryPage") {
        try {
          // Load saved tabs from AsyncStorage
          const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
          if (savedTabs) {
            const parsedTabs = JSON.parse(savedTabs);
            setTabs(parsedTabs);
            // Initialize heartColors based on the Favorite tab
            const savedHeartColors = Object.values(parsedTabs).flat().reduce<{ [key: string]: string }>((acc, content: Content) => {
              acc[content.id] = parsedTabs.Favorite.some((fav) => fav.id === content.id)
                ? selectedHeartColor
                : unselectedHeartColor;
              return acc;
            }, {});
            setHeartColors(savedHeartColors);
          }
          // We dont need random content anymore
          //  else {
          //   // If no saved data, load random content for "Planned" and "Watching"
          //   const plannedContent = await getRandomContent(8);
          //   const watchingContent = await getRandomContent(8);
          //   const heartColors = [...plannedContent, ...watchingContent].reduce((acc, content) => {
          //     acc[content.id] = unselectedHeartColor;
          //     return acc;
          //   }, {});
          //   setHeartColors(heartColors);

          //   setTabs(({
          //     Planned: plannedContent,
          //     Watching: watchingContent,
          //     Completed: [],
          //     Favorite: [],
          //   }));
          // }
        } catch (error) {
          console.error('Error loading library content:', error);
        } finally {
          setIsLoading(false);
          await SplashScreen.hideAsync();
        }
      }
    };

    loadContent();
  }, [pathname]);

  const saveTabsToStorage = async (updatedTabs) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));
    } catch (error) {
      console.error('Error saving tabs to storage:', error);
    }
  };

  const handleTabPress = (index) => {
    setActiveTab(index);
    pagerViewRef.current?.setPage(index);
  };

  const moveItemToFavoriteTab = (id: string) => {
    setHeartColors((prevColors = {}) => {
      const newColor = prevColors[id] === selectedHeartColor ? unselectedHeartColor : selectedHeartColor;
  
      setTabs((prevTabs) => {
        const item = Object.values(prevTabs)
          .flat()
          .find((content) => content.id === id);
  
        if (!item) return prevTabs;
  
        const isFavorite = newColor === selectedHeartColor;
  
        const updatedFavorites = isFavorite
          ? [...prevTabs.Favorite, item]
          : prevTabs.Favorite.filter((content) => content.id !== id);
  
        const updatedTabs = {
          ...prevTabs,
          Favorite: updatedFavorites,
        };
  
        saveTabsToStorage(updatedTabs); // Save updated state to AsyncStorage
        Alert.alert('Success', `${isFavorite ? "Added" : "Removed"} "${item.title}" ${isFavorite ? "to" : "from"} Favorite tab`);
        return updatedTabs;
      });
      
      setMoveModalVisible(false);
      return { ...prevColors, [id]: newColor };
    });
  };

  const moveItemToTab = (item: Content, targetTab) => {
    const sourceTab = Object.keys(tabs).find((tab) =>
      tabs[tab].some((content) => content.id === item.id)
    );

    if (sourceTab) {
      let updatedTabs;
      let deleted = false;
      if (sourceTab === targetTab) {
        updatedTabs = {
          ...tabs,
          [sourceTab]: tabs[sourceTab].filter((content) => content.id !== item.id),
        };
        deleted = true;
      }
      else {
        updatedTabs = {
          ...tabs,
          [sourceTab]: tabs[sourceTab].filter((content) => content.id !== item.id),
          [targetTab]: [...tabs[targetTab], item],
        };
      }

      setTabs(updatedTabs);
      saveTabsToStorage(updatedTabs); // Save updated state to AsyncStorage

      Alert.alert('Success', `${deleted ? "Removed" : "Moved"} "${item.title}" ${deleted ? "from" : "to"} "${targetTab}"`);
    }
    setMoveModalVisible(false);
  };

  const renderTabContent = (tabData) => {
    if (!tabData || tabData.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: 'gray', textAlign: 'center' }}>
            Your list is empty. Start adding items!
          </Text>
        </View>
      );
    }
  
    return (
      <FlatList
        data={tabData}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieCard}
            onPress={() => {
                router.push({
                pathname: '/InfoPage',
                params: { id: item.id },
              });
              console.log(`Library clicked on: title ${item.title} | id ${item.id} `);
            }}
            onLongPress={() => {
              setSelectedItem(item);
              setMoveModalVisible(true);
            }}
          >
            <Image
              source={{
                uri: getPosterByContent(item) || 'https://via.placeholder.com/100x150',
              }}
              style={styles.movieImage}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  // if (isLoading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <Text style={styles.loadingText}>Loading Library...</Text>
  //     </View>
  //   );
  // }

  if (isLoading) {
    return null; // Show splashcreen until loaded
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {Object.keys(tabs).map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabItem, activeTab === index && styles.activeTabItem]}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[styles.tabText, activeTab === index && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pager View */}
      <PagerView
        style={{ flex: 1, marginTop: 20, marginBottom: 50 }}
        initialPage={0}
        ref={pagerViewRef}
        onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
      >
        {Object.keys(tabs).map((tab, index) => (
          <View key={index}>{renderTabContent(tabs[tab])}</View>
        ))}
      </PagerView>

      {/* Move Modal */}
      {selectedItem && (
        <Modal
          transparent={true}
          visible={moveModalVisible}
          animationType="fade"
          onRequestClose={() => setMoveModalVisible(false)}
        >
          <Pressable
            style={appStyles.modalOverlay}
            onPress={() => setMoveModalVisible(false)}
          >
            <View style={appStyles.modalContent}>
              <Text style={appStyles.modalTitle}>
                Move "{selectedItem?.title}" to:
              </Text>
              {selectedItem && Object.keys(tabs).map((tab, index) => (
                tab === "Favorite" ? (
                  <View key={`LandingPage-${selectedItem.id}-heart-${index}`} style={{paddingTop: 10}}>
                    <Heart 
                      heartColor={heartColors[selectedItem?.id] || unselectedHeartColor}
                      size={35}
                      onPress={() => moveItemToFavoriteTab(selectedItem?.id)}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    key={`LandingPage-${selectedItem.id}-${tab}-${index}`}
                    style={[appStyles.modalButton, isItemInList(selectedItem, tab, tabs) && appStyles.selectedModalButton]}
                    onPress={() => moveItemToTab(selectedItem, tab)}
                  >
                  <Text style={appStyles.modalButtonText}>
                    {tab} {isItemInList(selectedItem, tab, tabs) ? "✓" : ""}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBarColor,
    justifyContent: 'center',
    alignItems: "center",
    padding: 20,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  activeTabItem: { backgroundColor: Colors.selectedTabColor },
  tabText: { color: Colors.reviewTextColor, fontSize: 14 },
  activeTabText: { color: 'white', fontWeight: 'bold' },
  movieCard: { flex: 1, margin: 5, alignItems: 'center', paddingBottom: 10 },
  movieImage: { aspectRatio: 11/16, minWidth: screenWidth/3.3, minHeight: screenWidth / 2.2,  borderRadius: 10 },
  movieTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
  },
});

export default LibraryPage;
