import AsyncStorage from "@react-native-async-storage/async-storage";
import { Content, PosterContent } from "../types/contentType";
import { WatchList } from "../types/listsType";
import { getPostersFromContent } from "./fetchHelper";
import { STORAGE_KEY } from "@/Global";
import { Colors } from "@/constants/Colors";

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


// MOVING BETWEEN LISTS HELPERS:

// togles the heart color
// export const toggleHeartColors = (id: string, setHeartColors:  (value: React.SetStateAction<{[key: string]: string;}>) => void) => {
//   setHeartColors((prevColors = {}) => ({
//     ...prevColors,
//     [id]: prevColors[id] === Colors.selectedHeartColor ? Colors.unselectedHeartColor : Colors.selectedHeartColor,
//   }));
// };

export const handleFavoriteTab = async (item: Content, targetTab: string, tabs: any,
                                        setTabs: React.Dispatch<React.SetStateAction<WatchList>>, 
                                        setPosterTabs: React.Dispatch<React.SetStateAction<{[key: string]: PosterContent[];}>> | null, 
                                        setHeartColors:  (value: React.SetStateAction<{[key: string]: string;}>) => void | null
                                      ) => {
  try {
    if (targetTab !== "Favorite") {
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

    return;

  } catch (error) {
    console.error("Error updating Favorites:", error);
    // Alert.alert("Error", "Unable to update Favorites. Please try again.");
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
    const tabs = savedTabs ? JSON.parse(savedTabs) : { Planned: [], Watching: [], Completed: [], Favorite: [] };

    if (setHeartColors) {
      handleFavoriteTab(item, targetTab, tabs, setTabs, setPosterTabs, setHeartColors);
      setModalsFalse.forEach((setFunc) => setFunc(false));
      return;
    }

    // Identify all source tabs (excluding Favorite) containing the item
    const sourceTabs = Object.keys(tabs).filter(
      (tab) => tab !== "Favorite" && tabs[tab].some((content) => content.id === item.id)
    );

    let updatedTabs = { ...tabs };

    // Remove from all source tabs
    for (const sourceTab of sourceTabs) {
      updatedTabs[sourceTab] = updatedTabs[sourceTab].filter((c) => c.id !== item.id);
    }

    // If target is one of the source tabs, we’ve effectively just removed it from there, so stop
    if (sourceTabs.includes(targetTab)) {
      setTabs(updatedTabs);
      const newPosterLists = await turnTabsIntoPosterTabs(updatedTabs);
      if (setPosterTabs) {
        const newPosterLists = await turnTabsIntoPosterTabs(updatedTabs);
        setPosterTabs(newPosterLists);
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTabs));
      setModalsFalse.forEach((setFunc) => setFunc(false));
      return;
    }

    // Add the item to the target tab (if not Favorite, just add)
    if (targetTab !== "Favorite") {
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


export default {};