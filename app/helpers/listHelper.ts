import { Content } from "../types/contentType";

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

  export default {};