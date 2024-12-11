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
import { router, usePathname } from 'expo-router';
import Heart from './components/heartComponent';
import { Content, PosterContent } from './types/contentType';
import { appStyles } from '@/styles/appStyles';
import { STORAGE_KEY } from '@/Global';
import { Colors } from '@/constants/Colors';
import { WatchList } from './types/listsType';
import { isItemInList, moveItemToTab, turnTabsIntoPosterTabs } from './helpers/listHelper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const scale = .75;
const selectedHeartColor = "#FF2452";
const unselectedHeartColor = "#ECE6F0";

// Prevent splash screen from hiding until everything is loaded
SplashScreen.preventAutoHideAsync();

const LibraryPage = () => {
  const pathname = usePathname();
  const pagerViewRef = useRef(null);

  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [libraryModal, setLibraryModal] = useState(false);

  const [activeTab, setActiveTab] = useState(0);

  const [tabs, setTabs] = useState<WatchList>({
    Planned: [],
    Watching: [],
    Completed: [],
    Favorite: [],
  });
  const [posterTabs, setPosterTabs] = useState<{
    [key: string]: PosterContent[];
  }>({});

  const [heartColors, setHeartColors] = useState<{ [key: string]: string }>({});  

  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PosterContent>(null);
  const [moveModalVisible, setMoveModalVisible] = useState(false);

  useEffect(() => {
    setMoveModalVisible(false);
    const loadContent = async () => {
      if (pathname === "/LibraryPage") {
        try {
          // Load saved tabs from AsyncStorage
          const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
          if (savedTabs) {
            const parsedTabs: WatchList = JSON.parse(savedTabs);
            setTabs(parsedTabs);

            const newPosterLists = await turnTabsIntoPosterTabs(parsedTabs);
            setPosterTabs(newPosterLists);            

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
        } finally {
          setIsLoading(false);
          await SplashScreen.hideAsync();
        }
      }
    };

    loadContent();
  }, []);  


  const handleTabPress = async (index) => {
    setActiveTab(index);
    pagerViewRef.current?.setPage(index);

    const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedTabs) {
      const parsedTabs: WatchList = JSON.parse(savedTabs);
      setTabs(parsedTabs);
      const newPosterLists = await turnTabsIntoPosterTabs(parsedTabs);
      setPosterTabs(newPosterLists);
    }
  };

  const renderTabContent = (tabData: PosterContent[], tab) => {
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
        keyExtractor={(item, index) => `${item.id}-${index}-${tab}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieCard}
            onPress={() => {
                router.push({
                pathname: '/InfoPage',
                params: { id: item.id },
              });
              // console.log(`Library clicked on: title ${item.title} | id ${item.id} `);
            }}
            onLongPress={() => {
              setSelectedItem(item);
              setMoveModalVisible(true);
            }}
          >
            <Image
              source={{
                  uri: item.posters?.vertical || 
                      (console.log(`Library poster missing for: ${item.title} | poster: ${item.posters?.vertical}`), 
                        // reloadMissingImages(item), 
                        "https://example.com/default-image.jpg")
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
      <View style={[styles.tabBar]}>
      {/* <View style={[{backgroundColor: Colors.tabBarColor, paddingVertical: 10, paddingLeft: 60, flexDirection: "row", justifyContent: "center", alignItems: "center", alignSelf: "center"}]}> */}
        {Object.keys(tabs).map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabItem, activeTab === index && styles.activeTabItem]}
            onPress={async () => await handleTabPress(index)}
          >
            <Text
              style={[styles.tabText, activeTab === index && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        {/* <DropDownPicker
            multiple={true}
            min={0}
            theme="DARK"
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
            placeholder='Select a list to shuffle...'
            style={{backgroundColor: Colors.unselectedColor, width: "85%"}}

            open={dropDownOpen}
            setOpen={setDropDownOpen}
            value={selectedList}
            setValue={setSelectedList}
            items={Object.keys(tabs).map((tab) => ({ label: tab, value: tab }))}
          />

          <View style={{marginLeft: -40, paddingRight: 40 }}>
            <Ionicons name="add-circle-outline" size={35} color="white" />
          </View> */}
      </View>

      {/* Pager View */}
      <PagerView
        style={{ flex: 1, marginTop: 20, marginBottom: 50 }}
        initialPage={0}
        key={Object.keys(posterTabs).join('-')}
        ref={pagerViewRef}
        onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
      >
        {Object.keys(posterTabs).map((tab, index) => (
          <View key={tab}>{renderTabContent(posterTabs[tab], tab)}</View>
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
                      // onPress={async () => await moveItemToFavoriteTab(selectedItem?.id)}
                      onPress={async () => await moveItemToTab(selectedItem, tab, setTabs, setPosterTabs, [setMoveModalVisible], setHeartColors)}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    key={`LandingPage-${selectedItem.id}-${tab}-${index}`}
                    style={[appStyles.modalButton, isItemInList(selectedItem, tab, tabs) && appStyles.selectedModalButton]}
                    onPress={async () => await moveItemToTab(selectedItem, tab, setTabs, setPosterTabs, [setMoveModalVisible], null)}
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
