import { Content } from "../types/contentType";
import { WatchList } from "../types/listsType";
import { getPostersFromContent } from "./fetchHelper";

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
          console.warn(`No data for tab: ${tabKey}`);
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