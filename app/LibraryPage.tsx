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
  TextInput,
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
import { PosterList, WatchList } from './types/listsType';
import { createNewList, DEFAULT_TABS, FAVORITE_TAB, isItemInList, moveItemToTab, sortTabs, turnTabsIntoPosterTabs } from './helpers/listHelper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Prevent splash screen from hiding until everything is loaded
SplashScreen.preventAutoHideAsync();

const LibraryPage = () => {
  const pathname = usePathname();
  const pagerViewRef = useRef(null);

  // const [selectedList, setSelectedList] = useState<string[]>([]);
  // const [dropDownOpen, setDropDownOpen] = useState(false);
  // const [libraryModal, setLibraryModal] = useState(false);

  const [activeTab, setActiveTab] = useState(0);

  const [tabs, setTabs] = useState<WatchList>(DEFAULT_TABS);
  const [posterTabs, setPosterTabs] = useState<PosterList>(DEFAULT_TABS as PosterList);
  const [newListName, setNewListName] = useState<string>("");
  const [createNewListModal, setCreateNewListModal] = useState(false);

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
            const parsedTabs: WatchList = savedTabs 
                            ? { ...DEFAULT_TABS, ...JSON.parse(savedTabs) } // Merge defaults with saved data
                            : DEFAULT_TABS;
            setTabs(parsedTabs);

            const newPosterLists = await turnTabsIntoPosterTabs(parsedTabs);
            setPosterTabs(newPosterLists);            

            // Initialize heartColors based on the Favorite tab
            const savedHeartColors = Object.values(parsedTabs).flat().reduce<{ [key: string]: string }>((acc, content: Content) => {
              acc[content.id] = parsedTabs.Favorite.some((fav) => fav.id === content.id)
                ? Colors.selectedHeartColor
                : Colors.unselectedHeartColor;
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


  const handelCreateNewTab = async (newTabName: string) => {
    if (newTabName.trim()) {
      const newTabIndex: number = Object.keys(tabs).length;
      await createNewList(newListName, setTabs, setPosterTabs);
      setNewListName("");
      setCreateNewListModal(false);
      setActiveTab(newTabIndex);
      pagerViewRef.current?.setPage(newTabIndex);
    }
  };


  const handleTabPress = async (index) => {
    setActiveTab(index);
    pagerViewRef.current?.setPage(index);

    const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedTabs) {
      const parsedTabs: WatchList = savedTabs 
                            ? { ...DEFAULT_TABS, ...JSON.parse(savedTabs) } // Merge defaults with saved data
                            : DEFAULT_TABS;
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

  if (isLoading) {
    return null; // Show splashcreen until loaded
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
      {/* Tab Bar */}
      <View style={[styles.tabBar, {flexDirection: 'row', columnGap: 10}]}>
        {/* {Object.keys(tabs).map((tab, index) => (
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
        ))} */}

        <FlatList
          data={Object.keys(sortTabs(tabs))}
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          keyExtractor={(tab, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.tabItem, activeTab === index && styles.activeTabItem, {paddingHorizontal: 10}]}
              onPress={async () => await handleTabPress(index)}
            >
              <Text
                style={[styles.tabText, activeTab === index && styles.activeTabText]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
        <Pressable onPress={() => setCreateNewListModal(true)} >
          <View style={{ }}>
              <Ionicons name="add-circle-outline" size={35} color="white" />
          </View> 
        </Pressable>
      </View>
        
      {/* Create List Modal */}
      <Modal
        transparent={true}
        visible={createNewListModal}
        animationType="fade"
        onRequestClose={() => setCreateNewListModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCreateNewListModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New List</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter list name"
              value={newListName}
              onChangeText={setNewListName}
            />
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setCreateNewListModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.addButton}
                onPress={async () => await handelCreateNewTab(newListName) }
              >
                <Text style={styles.addButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Pager View */}
      <PagerView
        style={{ flex: 1, marginTop: 20, marginBottom: 50 }}
        initialPage={0}
        key={Object.keys(posterTabs).join('-')}
        ref={pagerViewRef}
        onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
      >
        {Object.keys(sortTabs(posterTabs)).map((tab) => (
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
              {selectedItem && Object.keys(sortTabs(tabs)).map((tab, index) => (
                tab === FAVORITE_TAB ? (
                  <View key={`LandingPage-${selectedItem.id}-heart-${index}`} style={{paddingTop: 10}}>
                    <Heart 
                      heartColor={heartColors[selectedItem?.id] || Colors.unselectedHeartColor}
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
  },
  addButton: {
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
  },
});

export default LibraryPage;
