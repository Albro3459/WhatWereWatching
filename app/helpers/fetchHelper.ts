import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { movies, tvShows} from '../data/moviesAndTvShows';
import { Content, StreamingOption } from '../types/contentType';
// import db from '../../assets/data/db.json';
import db from '../data/db.json';


const filePath = `${FileSystem.documentDirectory}db.json`;

// these interact with the actual file

export const loadDbFile = async (): Promise<any | null> => {
  try {
    // Check if the file is already in a writable directory
    const fileExists = await FileSystem.getInfoAsync(filePath);
    if (fileExists.exists) {
      // console.log('File already exists in writable directory:', filePath);
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      return JSON.parse(fileContent);
    }

    // Copy the file to a writable directory
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(db));

    console.log('File copied to writable directory:', filePath);

    // Read and return the file content
    const fileContent = await FileSystem.readAsStringAsync(filePath);
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading db.json:', error.message);
    return null;
  }
};

// Function to fetch a movie or TV show by its ID
export const getContentById = async (ID: string): Promise<Content | null> => {
  try {
    if (!ID) {
      console.log("ID is null");
      return null;
    }
    // Read the file content
    const data = await loadDbFile();
    if (!data) {
      console.log('Failed to load db.json.');
      return null;
    }

    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.log('Invalid data format in db.json. Expected an array.');
      return null;
    }

    // Find the content by its ID
    const content = data.find((item) => item.id === ID);
    if (!content) {
      console.log(`Content with ID ${ID} not found.`);
      return null;
    }

    return content;
  } catch (error) {
    console.error('Error fetching content by ID:', error.message);
    return null; // Return null on error instead of throwing
  }
};

// Function to fetch a random selection of movies and TV shows
export const getRandomContent = async (count: number): Promise<Content[] | null> => {
    try {
      const data: Content[] = await loadDbFile();
      if (!data) {
        console.warn('Failed to load db.json.');
        return null;
      }
  
      if (!Array.isArray(data)) {
        console.warn('Invalid data format in db.json. Expected an array.');
        return null;
      }
  
      // Filter to include only movies and TV shows
      const allContent = data.filter(
        (item) => item.showType === 'movie' || item.showType === 'series'
      );
  
      if (count > allContent.length) {
        console.warn('Requested count exceeds the total number of available content.');
        return null;
      }
  
      const selectedContent: Content[] = [];
      const usedIndexes = new Set<number>();
  
      while (selectedContent.length < count) {
        // Generate a random index and use modulo to loop around if needed
        const randomIndex = Math.floor(Math.random() * allContent.length);
  
        // Ensure no duplicates
        if (!usedIndexes.has(randomIndex)) {
          selectedContent.push(allContent[randomIndex]);
          usedIndexes.add(randomIndex);
        }
      }
  
      return selectedContent;
    } catch (error) {
      console.warn('Error fetching random content:', error.message);
      return null;
    }
};

// helpers
export const getPosterByContent = (content: Content, vertical = true) => {
    try {
        if (content) {
            // Validate nested properties
            let resolution = 'w360';
            let posterData = content.imageSet?.verticalPoster?.[resolution];

            if (!vertical) {
                resolution = 'w1080'
                posterData = content.imageSet?.horizontalPoster?.[resolution];
            }

            if (posterData) {
                // console.log(`poster url: ${posterData}`);
                return posterData;
            } else {
                console.log(`${(vertical ? `Vertical ${resolution}` : `Horizontal ${resolution}`)} poster resolution not found for ID: ${content.id}`);
                return null;
            }
        }
        else {
            // console.log(`content passed in is null in getPosterByContent`);
            return null;
        }
    } catch (error) {
      console.log('Error fetching the poster in getPosterByContent:', error.message);
      return null;
    }
};

export const searchByKeywords = async (keywords: string, filter: string = "") => {
  try {
    if (keywords.length > 0) {
      const data: Content[] = await loadDbFile();
      if (!data) {
        console.warn('Failed to load db.json.');
        return null;
      }
      if (!Array.isArray(data)) {
        console.warn('Invalid data format in db.json. Expected an array.');
        return null;
      }

      const keywordArray = keywords.toLowerCase().split(" ");

      let results: Content[] = [];

      // Filter data based on keywords
      results = data.filter((content) => {
        const contentFields = [
          content.title?.toLowerCase(),
          content.originalTitle?.toLowerCase(),
          content.overview?.toLowerCase(),
          ...(content.cast?.map((c) => c.toLowerCase()) || []),
          ...(content.directors?.map((d) => d.toLowerCase()) || []),
          ...(content.genres?.map((g) => g.name.toLowerCase()) || []),
          ...(Object.values(content.streamingOptions?.us || {}).flatMap((option) => [
            option.service.name.toLowerCase(),
            option.type.toString().toLowerCase(),
          ])),
        ];

        // Check if any keyword matches any field
        return keywordArray.some((keyword) =>
          contentFields.some((field) => field?.includes(keyword))
        );
      });

      return results;
    }
  } catch (error) {
    console.log(`Error searching for ${keywords}:`, error.message);
    return null;
  }
};

export default {};