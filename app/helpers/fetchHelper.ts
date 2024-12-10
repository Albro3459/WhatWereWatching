import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Content, StreamingOption } from '../types/contentType';


import db from '../data/db.json';
import { API_KEY } from '@/apiKey';
import { Filter, Genres, PaidOptions, Services, Types } from '../types/filterTypes';

// While the app is running, this api 
const API_BASE_URL = 'https://streaming-availability.p.rapidapi.com/shows/search/title';
// ******* DO NOT PUSH UR API KEY *******
const API_HEADERS = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
};


const filePath = `${FileSystem.documentDirectory}db.json`;
const CURRENT_DB_VERSION = 1.01

// these interact with the actual file

export const loadDbFile = async (): Promise<Content[] | null> => {
  try {
    // Check if the file is already in a writable directory
    const fileExists = await FileSystem.getInfoAsync(filePath);
    let fileDb: { version?: number; data?: Content[] } | null = null;

    if (fileExists.exists) {
      // console.log('File already exists in writable directory:', filePath);
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      
      try {
        fileDb = JSON.parse(fileContent);
      } catch (error) {
        console.error('Error parsing existing db.json:', error.message);
        fileDb = null;
      }
      // Check if version exists and matches
      if (fileDb && typeof fileDb === 'object' && fileDb.version) {
        if (fileDb.version >= CURRENT_DB_VERSION) {
          // console.log("returning at new content");
          return fileDb.data as Content[]; // only return the data
        }
      }
    }

    // Either the file doesn't exist, or the version is outdated. Recopy it.
    let validData: Content[] = Array.isArray(db)
      ? db // If db is an array, use it directly
      : Array.isArray((db as { data?: Content[] }).data) // Check if `db` has a valid `data` field
      ? (db as { data?: Content[] }).data as Content[]
      : []; 

    // Either the file doesn't exist, or the version is outdated. Recopy it.
    const updatedDb: { version: number; data: Content[] } = {
      version: CURRENT_DB_VERSION,
      data: fileDb && Array.isArray(fileDb.data) ? fileDb.data : validData
    };

    const updatedDbString = JSON.stringify(updatedDb);

    // Copy the file to a writable directory
    await FileSystem.writeAsStringAsync(filePath, updatedDbString);

    console.log('Database updated or created:', filePath);

    // console.log("returning at the end");
    return updatedDb.data;
  } catch (error) {
    console.error('Error loading db.json:', error.message);
    return null;
  }
};

export const updateDB = async (newContents: Content[]): Promise<Boolean> => {
  try {
    if (!newContents || newContents.length <= 0) { 
      console.warn('No new content to add.');
      return false; 
    }

    const currFileData: Content[] = await loadDbFile();
    if (!currFileData || !Array.isArray(currFileData)) {
      console.warn('Failed to load local db.json or invalid data format.');
      return null;
    }

    // Filter out any content already in the database
    const uniqueNewContents = newContents.filter(
      (newContent) => !currFileData.some((existingContent) => existingContent.id === newContent.id)
    );

    if (uniqueNewContents.length === 0) {
      console.log('No new unique items to add to the database.');
      return true;
    }

    // Add unique new content to the current file data
    currFileData.push(...uniqueNewContents);

    const updatedDb: { version: number; data: Content[] } = {
      version: CURRENT_DB_VERSION,
      data: currFileData
    };

    // Copy the file to a writable directory
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(updatedDb));

    console.log(`Database successfully updated with ${newContents.length} new items:`, filePath);
    newContents.forEach((content) => console.log(`- ${content.title}`));

    return true;
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


// old, outdate, and will no longer work, since we switched to searching with the API for better results
// export const searchByKeywords = async (keywords: string, filter: string = "") : Promise<Content[] | null> => {
//   try {
//     if (keywords.length >= 0) {
//       const data: Content[] = await loadDbFile();
//       if (!data) {
//         console.warn('Failed to load db.json.');
//         return null;
//       }
//       if (!Array.isArray(data)) {
//         console.warn('Invalid data format in db.json. Expected an array.');
//         return null;
//       }

//       const keywordArray = keywords.toLowerCase().split(" ");
//       const filters = filter ? filter.split(",").map((f) => f.trim().toLowerCase()) : [];
//       const uniqueResults: Set<string> = new Set(); // used to check for uniqueness

//       const results: Content[] = data.filter((content: Content) => {
//         const contentFields = [
//           content.title?.toLowerCase(),
//           content.originalTitle?.toLowerCase(),
//           content.overview?.toLowerCase(),
//           content.showType?.toLowerCase(),
//           ...(content.cast?.map((c) => c.toLowerCase()) || []),
//           ...(content.directors?.map((d) => d.toLowerCase()) || []),
//           ...(content.genres?.map((g) => g.name.toLowerCase()) || []),
//           ...(Object.values(content.streamingOptions?.us || {}).flatMap((option) => [
//             option.service.name.toLowerCase(),
//             option.type.toString().toLowerCase(),
//           ])),
//         ];

//         // Check if ANY keyword matches any field
//         const keywordMatches: boolean = keywordArray.length > 0 ? keywordArray.some((keyword) =>
//           contentFields.some((field) => field?.includes(keyword))
//         ): false;

//         // using every to be strict with filers
        // const filterMatches: boolean =
        //   filters.length === 0 ||
        //   filters.every((filterValue) =>
        //     (filterValue === 'series' || filterValue === 'movie') ? contentFields.includes(filterValue) :
        //     contentFields.some((field) => field && field.includes(filterValue))
        //   );

//         // Add to results if it matches and is not already in the Set
//         if ((keywordArray.length > 0 ? keywordMatches && filterMatches : filterMatches) && !uniqueResults.has(content.id)) {
//           uniqueResults.add(content.id); // Track unique content by ID
//           return true; // Include in results
//         }
//         return false; // Exclude duplicates
//       });

//       return results.sort((a, b) => a.title.localeCompare(b.title));
//     }
//   } catch (error) {
//     console.log(`Error searching for ${keywords}:`, error.message);
//     return null;
//   }
// };

const mapFiltersToApiParams = (filter: Filter) => {
  const genres = filter.selectedGenres.map((genre) =>
    Genres.find((g) => g.label === genre)?.value
  ).filter(Boolean);

  const types = filter.selectedTypes.map((type) =>
    Types.find((t) => t.label === type)?.value
  ).filter(Boolean);

  const paidOptions = filter.selectedPaidOptions.map((option) =>
    PaidOptions.find((p) => p.label === option)?.value
  ).filter(Boolean);

  const services = filter.selectedServices.map((service) =>
    Services.find((s) => s.label === service)?.value
  ).filter(Boolean);

  return {
    genres: genres.join(',') || undefined,
    show_type: types.join(',') || undefined,
    paid_options: paidOptions.join(',') || undefined,
    services: services.join(',') || undefined,
  };
};

const fetchWithFilters = async (keywords: string, filter: Filter): Promise<Content[]> => {

  const options = {
    method: 'GET',
    url: 'https://streaming-availability.p.rapidapi.com/shows/search/filters',
    params: {
      country: 'us',
      series_granularity: 'show',
      genres: filter.selectedGenres.join(','),
      order_direction: 'asc',
      genres_relation: 'or', // include content from any selected genre
      output_language: 'en',
      catalogs: filter.selectedServices.join(','),
      show_type: filter.selectedTypes.length != 1 ? "" : filter.selectedTypes[0] // leave blank for both shows and movies
    },
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
    }
  };

  try {
    console.log(`Fetching data with keywords and filters: ${keywords}`);
    const response = await axios.request(options);
    return response.data.results || []; // Adjust based on actual API response
  } catch (error) {
    console.error(`Error fetching data with keywords "${keywords}" and filters:`, error.message);
    return [];
  }
};


const fetchWithKeywordOnly = async (keyword: string): Promise<Content[]> => {
  const options = {
    method: 'GET',
    url: 'https://streaming-availability.p.rapidapi.com/shows/search/title',
    params: {
      country: 'us',
      title: keyword,
      series_granularity: 'show',
      output_language: 'en'
    },
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
    }
  };

  try {
    console.log(`Fetching data with keyword only: ${keyword}`);
    const response = await axios.request(options);
    return response.data.results || []; // Adjust based on actual API response
  } catch (error) {
    console.error(`Error fetching data with keywords "${keyword}":`, error.message);
    return [];
  }
};



export const searchByKeywords = async (keyword: string, filter: Filter): Promise<Content[] | null> => {
  try {
    if (keyword.length === 0) {
      console.warn('No keywords provided.');
      return null;
    }

    // Fetch data from the API based on the presence of filters
    let apiResults: Content[] = [];
    if (Object.values(filter).every((arr) => arr.length === 0)) {
      // No filters provided, use fetchWithKeywordOnly
      console.log(`Fetching data for keyword only: ${keyword}`);
      apiResults = await fetchWithKeywordOnly(keyword) || [];
    } else {
      // Filters are provided, use fetchWithFilters
      console.log(`Fetching data for keyword with filters: ${keyword}`);
      apiResults = await fetchWithFilters(keyword, filter) || [];
    }

    // Fetch local data from the database
    const localData: Content[] = await loadDbFile();
    if (!localData || !Array.isArray(localData)) {
      console.warn('Failed to load local db.json or invalid data format.');
      // return apiResults; // Return only API results if local data fails
    }

    // Merge local data and API results (avoid duplicates by ID)
    const allResults = [...(localData || []), ...apiResults].reduce((unique, content) => {
      if (!unique.some((item) => item.id === content.id)) {
        unique.push(content);
      }
      return unique;
    }, [] as Content[]);

    // Add new items from API results to the database
    const newContents = apiResults.filter(
      (apiContent) => !(localData || []).some((localContent) => localContent.id === apiContent.id)
    );

    if (newContents.length > 0) {
      console.log(`Adding ${newContents.length} new items to the database.`);
      await updateDB(newContents); // update the db with new items found in search
    }

    // Apply local filtering logic
    const keywordArray = keyword.toLowerCase().split(" ");
    const uniqueResults: Set<string> = new Set();

    const finalResults: Content[] = allResults.filter((content: Content) => {
      const contentFields = [
        content.title?.toLowerCase(),
        content.originalTitle?.toLowerCase(),
        content.overview?.toLowerCase(),
        content.showType?.toLowerCase(),
        ...(content.cast?.map((c) => c.toLowerCase()) || []),
        ...(content.directors?.map((d) => d.toLowerCase()) || []),
        ...(content.genres?.map((g) => g.name.toLowerCase()) || []),
        ...(Object.values(content.streamingOptions?.us || {}).flatMap((option) => [
          option.service.id.toLowerCase(),
          option.type.toString().toLowerCase(),
        ])),
      ];

      // Check if ANY keyword matches any field
      const keywordMatches = keywordArray.some((keyword) =>
        contentFields.some((field) => field?.includes(keyword))
      );

      // Map filters to API parameters and check matches
      const filterParams = mapFiltersToApiParams(filter);
      const filterMatches =
        !filterParams.genres && !filterParams.show_type && !filterParams.services && !filterParams.paid_options
          ? true // No filters
          : Object.entries(filterParams).every(([key, value]) =>
              value?.split(',').some((filterValue) =>
                contentFields.some((field) => field?.includes(filterValue))
              )
            );

      // Add to results if it matches and is not already in the Set
      if (keywordMatches && filterMatches && !uniqueResults.has(content.id)) {
        uniqueResults.add(content.id); // Track unique content by ID
        return true;
      }
      return false;
    });

    return finalResults.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error(`Error searching for "${keyword}":`, error.message);
    return null;
  }
};

export default {};