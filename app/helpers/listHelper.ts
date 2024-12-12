import AsyncStorage from "@react-native-async-storage/async-storage";
import { Content, PosterContent } from "../types/contentType";
import { PosterList, WatchList } from "../types/listsType";
import { getPostersFromContent } from "./fetchHelper";
import { STORAGE_KEY } from "@/Global";
import { Colors } from "@/constants/Colors";

// The words list and tabs are interchangebale unfortunately.
// I know its confusing but in the library they're the tabs at the top, but they're like Watchlists like on youtube


// can only be in one of these at a time
export const INDEPENDENT_TABS = ["Planned", "Watching", "Completed"];
export const FAVORITE_TAB = "Favorite";

export const DEFAULT_TABS: WatchList | PosterList = { Favorite: [], Planned: [], Watching: [], Completed: [] };

// MOVING BETWEEN LISTS HELPERS:

export const handleFavoriteTab = async (item: Content, targetTab: string, tabs: any,
                                        setTabs: React.Dispatch<React.SetStateAction<WatchList>>, 
                                        setPosterTabs: React.Dispatch<React.SetStateAction<{[key: string]: PosterContent[];}>> | null, 
                                        setHeartColors:  (value: React.SetStateAction<{[key: string]: string;}>) => void | null
                                      ) => {
  try {
    if (targetTab !== FAVORITE_TAB) {
      return;
    }

    // Update heartColors
    setHeartColors((prevColors = {}) => ({
      ...prevColors,
      [item.id]: prevColors[item.id] === Colors.selectedHeartColor ? Colors.unselectedHeartColor : Colors.selectedHeartColor,
    }));

    // Check if the item is already in the Favorite tab
    const isFavorite = tabs.Favorite.some((fav) => fav.id === item.id);

    // Update the Favorite tab
    const updatedFavorites = isFavorite
      ? tabs.Favorite.filter((content) => content.id !== item.id) // Remove if already in Favorites
      : [...tabs.Favorite, item]; // Add if not in Favorites

    const updatedTabs = {
      ...tabs,
      Favorite: updatedFavorites,
    };
    
    setTabs(updatedTabs);
    if (setPosterTabs) {
      const newPosterLists = await turnTabsIntoPosterTabs(updatedTabs);
      setPosterTabs(newPosterLists);
    }

    // Save updated tabs to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));

  } catch (error) {
    console.error("Error updating Favorites:", error);
    // Alert.alert("Error", "Unable to update Favorites. Please try again.");
  }
};

export const handleUserCreatedTab = async (item: Content, targetTab: string, tabs: any,
                                          setTabs: React.Dispatch<React.SetStateAction<WatchList>>, 
                                          setPosterTabs: React.Dispatch<React.SetStateAction<{[key: string]: PosterContent[];}>> | null
                                        ) => {
    try {
      if (INDEPENDENT_TABS.includes(targetTab) || targetTab === FAVORITE_TAB) {
        return;
      }

      console.log(`Working on moving content to: ${targetTab}`);

      if (!tabs[targetTab]) {
        tabs[targetTab] = [];
      }
      
      // Check if the item is already in the tab
      const isAlreadyInList = tabs[targetTab].some((content) => content.id === item.id);

      // Update the Favorite tab
      const updatedTab = isAlreadyInList
        ? tabs[targetTab].filter((content) => content.id !== item.id) // Remove if already in tab
        : [...tabs[targetTab], item]; // Add if not in tab

      const updatedTabs = {
        ...tabs,
        [targetTab]: updatedTab, // need the brackets to use the variable :)
      };
      
      setTabs(updatedTabs);
      if (setPosterTabs) {
        const newPosterLists = await turnTabsIntoPosterTabs(updatedTabs);
        setPosterTabs(newPosterLists);
      }

      // Save updated tabs to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));

      console.log(`Finished moving content to: ${targetTab}`);

    } catch (error) {
      console.error(`Error updating tab: ${targetTab}:`, error);
    }
};


// Moves item between lists:
    // item can only be in one of planned, watching or completed at one time, besides favorite
    // if item wants to go to the same tab it is in, it removes it
    // if favorite is changed, the heart color is toggles=d
export const moveItemToTab = async (item: Content, targetTab: string, 
                                    setTabs: React.Dispatch<React.SetStateAction<WatchList>>, 
                                    setPosterTabs: React.Dispatch<React.SetStateAction<{[key: string]: PosterContent[];}>> | null, 
                                    setModalsFalse: React.Dispatch<React.SetStateAction<boolean>>[],
                                    setHeartColors:  (value: React.SetStateAction<{[key: string]: string;}>) => void | null
                                  ) => {
  try {
    if (!item) { return null; }

    const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
    const tabs: WatchList = savedTabs 
                            ? { ...DEFAULT_TABS, ...JSON.parse(savedTabs) } // Merge defaults with saved data
                            : DEFAULT_TABS;

    if (!INDEPENDENT_TABS.includes(targetTab) && targetTab != FAVORITE_TAB) {
      console.log(`Requested to move content to: ${targetTab}`);
      await handleUserCreatedTab(item, targetTab, tabs, setTabs, setPosterTabs);
      setModalsFalse.forEach((setFunc) => setFunc(false));
      return;
    }
    
    if (setHeartColors || targetTab === FAVORITE_TAB) {
      handleFavoriteTab(item, targetTab, tabs, setTabs, setPosterTabs, setHeartColors);
      setModalsFalse.forEach((setFunc) => setFunc(false));
      return;
    }

    // Check if any of the independent or source tabs contain it
    const sourceTabs = Object.keys(tabs).filter(
      (tab) => INDEPENDENT_TABS.includes(tab) && tabs[tab].some((content) => content.id === item.id)
    );

    let updatedTabs = { ...tabs };

    // Remove from all source tabs
    for (const sourceTab of sourceTabs) {
      updatedTabs[sourceTab] = updatedTabs[sourceTab].filter((c) => c.id !== item.id);
    }

    // If target is one of the source tabs, we’ve effectively just removed it from there, so stop
    if (sourceTabs.includes(targetTab)) {
      setTabs(updatedTabs);
      if (setPosterTabs) {
        const newPosterLists = await turnTabsIntoPosterTabs(updatedTabs);
        setPosterTabs(newPosterLists);
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));
      setModalsFalse.forEach((setFunc) => setFunc(false));
      return;
    }

    // Add the item to the target tab (if not Favorite, just add)
    if (targetTab !== FAVORITE_TAB) {
      updatedTabs[targetTab] = [...updatedTabs[targetTab], item];
    }

    setTabs(updatedTabs);
    if (setPosterTabs) {
      const newPosterLists = await turnTabsIntoPosterTabs(updatedTabs);
      setPosterTabs(newPosterLists);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));
    setModalsFalse.forEach((setFunc) => setFunc(false));

  } catch (error) {
    console.error("Error updating tabs:", error);
  }
};


// Creating a new list
export const createNewList = async (tabName: string, 
                                    setTabs: React.Dispatch<React.SetStateAction<WatchList>>,
                                    setPosterTabs: React.Dispatch<React.SetStateAction<WatchList>> | null
                                  ) => {
    if (!tabName || tabName.length <= 0 || INDEPENDENT_TABS.includes(tabName) || tabName === FAVORITE_TAB) {
      console.warn(`${tabName} is an illegal tab name`);
      return;
    }

    tabName = tabName.trim();

    console.log(`Requested to create new tab: ${tabName}`);
    
    try {
      // Get current tabs
      const savedTabs = await AsyncStorage.getItem(STORAGE_KEY);
      const tabs = savedTabs 
                ? { ...DEFAULT_TABS, ...JSON.parse(savedTabs) } // Merge defaults with saved data
                : DEFAULT_TABS;

      // Check if tab with tabname already exists
      if (tabs[tabName]) {
        console.warn(`A tab with the name "${tabName}" already exists`);
        return;
      }

      // if not, create the tab by saving to async storage
      let sortedTabs = {
        ...tabs, // Preserve existing tabs
        [tabName]: [], // Add the new tab
      };
      sortedTabs = sortTabs(sortedTabs); // sort the tabs! favorite stays last
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sortedTabs));

      setTabs(sortedTabs);
      if (setPosterTabs) {
        setPosterTabs(sortedTabs);
      }
      console.log(`New tab created: ${tabName}`);
    } catch(error) {
      console.error(`Failed to create a new tab with the name "${tabName}"`);
      return;
    }
};

// Helping functions:

// Makes sure that the Favorite tab is last
export const sortTabs = (tabs: WatchList | PosterList): WatchList | PosterList => {
  const sortedKeys = Object.keys(tabs).filter((tab) => tab !== FAVORITE_TAB);
  if (tabs[FAVORITE_TAB]) {
    // sortedKeys.push(FAVORITE_TAB); // Add FAVORITE_TAB at the end if it exists
    sortedKeys.unshift(FAVORITE_TAB); // Prepend FAVORITE_TAB to the array
  }

  const sortedTabs: WatchList | PosterList = {};
  sortedKeys.forEach((key) => {
    sortedTabs[key] = tabs[key];
  });

  return sortedTabs as WatchList | PosterList;
};



// Check if item is in a list
export const isItemInList = (content: Content, list: string, lists) : boolean => {
  if (!content) { 
    console.log('Content is null');
    return false; 
  }
  if (!lists) { 
    console.log('Tabs is null');
    return false; 
  }
  if (!lists[list]) { 
    console.log('TAB INDEX is null');
    return false; 
  }
  return lists[list].some((item) => item.id === content.id);
};

// Add on the posters to the content
export const turnTabsIntoPosterTabs = async (tabs: WatchList) => {
  const updatedPosterLists = await Promise.all(
    Object.keys(tabs).map(async (tabKey) => {
      if (!tabs[tabKey] || tabs[tabKey].length === 0) {
        // console.warn(`No data for tab: ${tabKey}`);
        return { [tabKey]: [] };
      }

      const posterContents = await Promise.all(
        tabs[tabKey].map(async (content) => {
          try {
            const posters = await getPostersFromContent(content);
            return { ...content, posters };
          } catch (error) {
            console.error(`Error fetching posters for content ID: ${content.id}`, error);
            return { ...content, posters: null };
          }
        })
      );

      return { [tabKey]: posterContents };
    })
  );

  return updatedPosterLists.reduce((acc, tab) => ({ ...acc, ...tab }), {});
};



export default {};