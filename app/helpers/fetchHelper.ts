import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Content, PosterContent, Posters, StreamingOption } from '../types/contentType';


import db from '../data/db.json';
import { RAPIDAPI_KEY, TMDB_BEARER_TOKEN } from '@/keys';
import { Filter, Genres, PaidOptions, Services, Types } from '../types/filterTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '@/Global';
import { TMDB } from '../types/tmdbType';

// While the app is running, this api 
const API_BASE_URL = 'https://streaming-availability.p.rapidapi.com/shows/search/';
// ******* DO NOT PUSH UR API KEY *******
const API_HEADERS = {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
};


const filePath = `${FileSystem.documentDirectory}db.json`;
const CURRENT_DB_VERSION = 1.3;

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
    }

    // Check if version exists and matches
    if (fileDb && typeof fileDb === 'object' && fileDb.version && fileDb.version >= CURRENT_DB_VERSION) {
        // console.log("returning at new content");
        return fileDb.data as Content[]; // only return the data
    }
    else {
      // the db is null so we need to reset it, so reset the tabs too since they are stale now
      console.log('Fetch Helper; clearing tabs and database');
      fileDb = null;
      await AsyncStorage.removeItem(STORAGE_KEY);
      await FileSystem.writeAsStringAsync(filePath, "");
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
      return false;
    }

    // Filter out any content already in the database
    const uniqueNewContents = newContents.filter(
      (newContent) => !currFileData.some((existingContent) => existingContent.id === newContent.id)
    );

    if (uniqueNewContents && uniqueNewContents.length === 0) {
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

    console.log(`Database successfully updated with ${newContents.length} new items:`);
    newContents.forEach((content) => console.log(`- ${content.title}`, filePath));

    return true;
  } catch (error) {
    console.error('Error loading db.json:', error.message);
    return false;
  }
};

export const updatePosterInDB = async (newContent: Content, url: string, vertical = true): Promise<boolean> => {
  try {
    if (!newContent) {
      console.warn('No new content to update.');
      return false;
    }

    const currFileData: Content[] = await loadDbFile();
    if (!currFileData || !Array.isArray(currFileData)) {
      console.warn('Failed to load local db.json or invalid data format.');
      return false;
    }

    // Find the index of the existing content by ID
    const existingIndex = currFileData.findIndex((existingContent) => existingContent.id === newContent.id);

    if (existingIndex !== -1) {
      // Update the poster path for the existing content
      if (vertical) {
        currFileData[existingIndex].imageSet.verticalPoster = {
          ...currFileData[existingIndex].imageSet.verticalPoster,
          w360: url, // Update the vertical poster path (adjust the resolution as needed)
        };
      } else {
        currFileData[existingIndex].imageSet.horizontalPoster = {
          ...currFileData[existingIndex].imageSet.horizontalPoster,
          w1080: url, // Update the horizontal poster path (adjust the resolution as needed)
        };
      }
    } else if (newContent) {
      // Add the new content to the database
      currFileData.push(newContent);
    }

    // Write updated data back to the db.json file
    const updatedDb: { version: number; data: Content[] } = {
      version: CURRENT_DB_VERSION,
      data: currFileData,
    };

    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(updatedDb));

    console.log(`Database successfully updated with poster for content ID: ${newContent.id}`);
    return true;
  } catch (error) {
    console.error('Error updating db.json:', error.message);
    return false;
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
        if (!usedIndexes.has(randomIndex) && allContent[randomIndex]) {
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


const getPosterURI = async (imdbID: string): Promise<Posters> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: TMDB_BEARER_TOKEN
    }
  };

  const baseURL = "https://api.themoviedb.org/3/find/";
  const ending = "?external_source=imdb_id";
  
  try {
    const response = await fetch(`${baseURL}${imdbID}${ending}`, options);
    const data: TMDB = await response.json();

    if (data.tv_results.length > 0) {
      const tvResult = data.tv_results[0];
      return {
        vertical: tvResult.poster_path || "",
        horizontal: tvResult.backdrop_path || "",
      };
    } else if (data.movie_results.length > 0) {
      const movieResult = data.movie_results[0];
      return {
        vertical: movieResult.poster_path || "",
        horizontal: movieResult.backdrop_path || "",
      };
    }

    return { vertical: "", horizontal: "" }; // No results found
  } catch (err) {
    console.error("Error in getPosterURI:", err);
    return { vertical: "", horizontal: "" }; // Error case
  }
};

async function getGoodPoster(url: string, imdbID: string, vertical = true) : Promise<string | null> {
  const isBadPoster = url.startsWith("https://www."); // good posters are cdn. or image.
  if (!isBadPoster) return null;

  console.log(`bad poster found for ${url}`);

  const posters: Posters = await getPosterURI(imdbID);
  
  const baseURL = vertical
    ? "https://image.tmdb.org/t/p/w500/"
    : "https://image.tmdb.org/t/p/w1280/";

  const posterPath = vertical ? posters.vertical : posters.horizontal;

  return posterPath.length > 0 ? baseURL + posterPath : null;

}

export const getPostersFromContent = async (content: Content): Promise<Posters> => {
  try {
    if (!content) {
      console.log(`content passed in is null in getPostersFromContent`);
      return { vertical: '', horizontal: '' };
    }

    const resolutionVertical = 'w360';
    const resolutionHorizontal = 'w1080';

    let verticalPoster: string | null = null;
    let horizontalPoster: string | null = null;

    // Fetch vertical poster
    if (content.imageSet?.verticalPoster?.[resolutionVertical]) {
      verticalPoster = await getGoodPoster(
        content.imageSet.verticalPoster[resolutionVertical],
        content.imdbId
      );

      if (verticalPoster) {
        const success = await updatePosterInDB(content, verticalPoster, true);
        if (!success) {
          verticalPoster = content.imageSet.verticalPoster[resolutionVertical];
        }
      } else {
        verticalPoster = content.imageSet.verticalPoster[resolutionVertical];
      }
    }

    // Fetch horizontal poster
    if (content.imageSet?.horizontalPoster?.[resolutionHorizontal]) {
      horizontalPoster = await getGoodPoster(
        content.imageSet.horizontalPoster[resolutionHorizontal],
        content.imdbId,
        false
      );

      if (horizontalPoster) {
        const success = await updatePosterInDB(content, horizontalPoster, false);
        if (!success) {
          horizontalPoster = content.imageSet.horizontalPoster[resolutionHorizontal];
        }
      } else {
        horizontalPoster = content.imageSet.horizontalPoster[resolutionHorizontal];
      }
    }

    // console.log(`Vertical Poster: ${verticalPoster}, Horizontal Poster: ${horizontalPoster}`);

    return {
      vertical: verticalPoster || '',
      horizontal: horizontalPoster || '',
    };
  } catch (error) {
    console.log('Error fetching the poster in getPosterByContent:', error.message);
    return { vertical: '', horizontal: '' };
  }
};


const mapFiltersToApiParams = (filter: Filter) => {
  return {
    genres: filter.selectedGenres && filter.selectedGenres.length > 0 ? filter.selectedGenres.join(',') : undefined,
    show_type: filter.selectedTypes && filter.selectedTypes.length > 0 ? filter.selectedTypes.join(',') : undefined,
    paid_options: filter.selectedPaidOptions && filter.selectedPaidOptions.length > 0 ? filter.selectedPaidOptions.join(',') : undefined,
    services: filter.selectedServices && filter.selectedServices.length > 0 ? filter.selectedServices.join(',') : undefined,
  };
};

const isFilterEmpty = (filter: Filter) => {
  return filter.selectedGenres.length === 0 && filter.selectedTypes.length === 0 && 
         filter.selectedServices.length === 0 && filter.selectedPaidOptions.length === 0;
};

const fetchWithFilters = async (filter: Filter): Promise<Content[]> => {

  // use the ... spread to only include it if I want to
  const options = {
    method: 'GET',
    url: `${API_BASE_URL+"filters"}`,
    params: {
      country: 'us',
      series_granularity: 'show',
      ...filter.selectedGenres.length > 0 && { genres: filter.selectedGenres.join(',') },
      order_direction: 'desc',
      order_by: 'popularity_1year',
      ...filter.selectedGenres.length > 0 && { genres_relation: 'or' }, // include content from any selected genre
      output_language: 'en',
      ...filter.selectedServices.length > 0 && { catalogs: filter.selectedServices.join(',') },
      ...filter.selectedTypes.length === 1 && { show_type: filter.selectedTypes[0] } // Include only if exactly one type is specified
    },
    headers: API_HEADERS
  };

  try {
    const response = await axios.request(options);
    const data = response.data;
    if (!data || !Array.isArray(data.shows)) {
      console.warn(`No results found for filters`);
      return [];
    }
    
    const shows: Content[] = data.shows;
    console.log(`Fetched ${shows.length} content for filters`);
    return shows;
  } catch (error) {
    console.error(`Error fetching data with filters:`, error.message);
    return [];
  }
};


const fetchWithKeywordOnly = async (keyword: string): Promise<Content[] | null> => {
  const options = {
    method: 'GET',
    url: `${API_BASE_URL+"title"}`,
    params: {
      country: 'us',
      title: keyword,
      series_granularity: 'show',
      output_language: 'en'
    },
    headers: API_HEADERS
  };

  try {
    // console.log(`Fetching data with keyword only: ${keyword}`);
    const response = await axios.request(options);

    const data: Content[] = response.data;
    if (!data) {
      console.warn(`No results found for keyword: "${keyword}"`);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching data with keyword: "${keyword}":`, error.message);
    return null;
  }
};

const filterContents = (contents: Content[], filter: Filter): Content[] => {
  const { selectedGenres, selectedTypes, selectedServices, selectedPaidOptions } = filter;

  return contents.filter((content) => {
    const genres = content.genres?.map((g) => g.id.toLowerCase()) || [];
    const services = Object.values(content.streamingOptions?.us || {})
      .map((o) => o.service.id.toLowerCase());
    const paidOptions = Object.values(content.streamingOptions?.us || {})
      .map((o) => o.type.toString().toLowerCase());
    const types = [content.showType?.toLowerCase()].filter(Boolean);

    const matchFilter = (items: string[], filters: string[] | undefined) => {
      if (!filters || filters.length === 0) return true; // No filter, always match
      if (filters.length === 1) {
        // Must contain the single filter
        return items.includes(filters[0].toLowerCase());
      } else {
        // Must contain at least one of the filters
        return filters.some((f) => items.includes(f.toLowerCase()));
      }
    };

    const matchGenres = matchFilter(genres, selectedGenres);
    const matchTypes = matchFilter(types, selectedTypes);
    const matchServices = matchFilter(services, selectedServices);
    const matchPaidOptions = matchFilter(paidOptions, selectedPaidOptions);

    return matchGenres && matchTypes && matchServices && matchPaidOptions;
  });
};

const sortResults = (keyword: string, allResults: Content[]) : Content[] => {
  const sortedResults: Content[] = allResults.sort((a, b) => {
    const keywordLower = keyword.toLowerCase();
    const irrelevantWordsRegex = /^(the |a |an )/i;

    const stripIrrelevantWords = (text: string) =>
        text.toLowerCase().replace(irrelevantWordsRegex, '');

    const adjustedKeywordLower = irrelevantWordsRegex.test(keywordLower)
        ? keywordLower // Keep the keyword as is if it contains irrelevant words
        : stripIrrelevantWords(keywordLower);

    const aStripped = stripIrrelevantWords(a.title);
    const bStripped = stripIrrelevantWords(b.title);

    const aExactMatch = aStripped === adjustedKeywordLower;
    const bExactMatch = bStripped === adjustedKeywordLower;

    if (aExactMatch && !bExactMatch) {
        return -1; // Exact match should come first
    } else if (!aExactMatch && bExactMatch) {
        return 1; // Exact match should come first
    }

    const aMatches = aStripped.includes(adjustedKeywordLower);
    const bMatches = bStripped.includes(adjustedKeywordLower);

    if (aMatches && !bMatches) {
        return -1; // a should come before b
    } else if (!aMatches && bMatches) {
        return 1; // b should come before a
    }

    // Remove leading irrelevant words for alphabetical sorting
    return aStripped.localeCompare(bStripped);
  });

  return sortedResults;
};

const getUniqueResults = (contents: Content[]): Content[] => {
  return contents.reduce((unique, content) => {
    if (content && !unique.some((item) => item.id === content.id)) {
      unique.push(content);
    }
    return unique;
  }, [] as Content[]);
};

export const filterLocalDB = async (keyword: string, filter: Filter) : Promise<Content[]> => {
  try {
      const data: Content[] = await loadDbFile();
      if (!data) {
        console.warn('Failed to load db.json.');
        return [];
      }
      if (!Array.isArray(data)) {
        console.warn('Invalid data format in db.json. Expected an array.');
        return [];
      }
      
      const filteredResults: Content[] = data.length > 0 ? filterContents(data, filter) : [];

      const sortedResults: Content[] = filteredResults.length > 0 ? sortResults(keyword, filteredResults) : [];

      const uniqueResults: Content[] = sortedResults.length > 0 ? getUniqueResults(sortedResults) : [];

      return uniqueResults || [];
    
  } catch (error) {
    console.log(`Error filtering local db for ${keyword} and filtersa:`, error.message);
    return [];
  }
};

export const searchByKeywords = async (keyword: string, filter: Filter): Promise<PosterContent[] | null> => {
  try {
    if (!keyword) { keyword = ""; }
    else { keyword = keyword.toLowerCase().trim() || ""; }

    let apiResults: Content[] = [];
    // const filteredLocalData: Content[] = isFilterEmpty(filter) ? await filterLocalDB(keyword, filter) || [] : []; // dont use local data with filters (it gives bad results because we dont know how to rank results. thats why google is so good)
    // const filteredLocalData: Content[] = await filterLocalDB(keyword, filter) || [];
    const filteredLocalData: Content[] = [];
    

      // Fetch data from the API based on the presence of filters
      if (isFilterEmpty(filter)) {
        // No filters provided, use fetchWithKeywordOnly
        console.log(`Fetching data for keyword only: ${keyword}`);
        const apiKeywordResults: Content[] | null = await fetchWithKeywordOnly(keyword) || null;
        if (apiKeywordResults && apiKeywordResults.length > 0) {
          // console.log(`Fetching this content: ${apiKeywordResults.map((result) => result.title).join(', ')} from this keyword: ${keyword}`);
          // apiResults.push(keywordResults)
          apiKeywordResults.forEach((result) => {
            if (result) {
              apiResults.push(result);
            }  
          })
        }
      } 
      else {
        // filter is not empty, meaning that no local data was used so apiResults is empty
        let keywordResults: Content[] | null = null;
        if (keyword.length > 0) {
          keywordResults = await fetchWithKeywordOnly(keyword) || null;
          if (keywordResults && keywordResults.length > 0) {
            // console.log(`Fetching this content:  ${keywordResults.map((result) => result.title).join(', ')} from this keyword: ${keyword}`);
            // wait to check with the filters before adding
          }
        }
        // Filters are provided, use fetchWithFilters
        console.log(`Fetching data for keyword with filters: ${keyword}`);
        const filterResults: Content[] = await fetchWithFilters(filter) || [];
        if (filterResults.length <= 0 && keywordResults && keywordResults.length > 0) {
          // apiResults.push(keywordResult);
          keywordResults.forEach((result) => {
            if (result) {
              apiResults.push(result);
            }  
          })
        }
        else if (filterResults.length >= 0 && keywordResults && keywordResults.length > 0) {
           // Now, check if the keyword result satisfies the applied filters

            const thisFilteredContent: Content[] = filterContents(keywordResults, filter);
            if (thisFilteredContent && thisFilteredContent.length > 0) {
              thisFilteredContent.forEach((result) => {
                if (result) {
                  apiResults.push(result);
                }
              })
            }

        } else if (filterResults.length >= 0 && (!keyword || keyword.length <= 0)) {
          // if there are filter results and no keyword search, then return the filter results
          apiResults = filterResults; 
        }
      }      

      // Add any unique new items from API results to the database
      if (apiResults.length > 0) {
        const newContents = apiResults.filter(
          (apiContent) => !(filteredLocalData || []).some((localContent) => localContent.id === apiContent.id)
        );

        if (newContents.length > 0) {
          console.log(`Adding ${newContents.length} new items to the database.`);
          if (!await updateDB(newContents)) { // update the db with new items found in search
            console.log("failed to fully update the db with new content");
          }
          else {
            console.log('successfully updated');
          }
        }
        else {
          console.log(`no new contents`);
        }
      }

    // console.log(`About to merge all filtered data: ${filteredLocalData.length} apiResults: ${apiResults.length}`);
    // Merge local data and API results (avoid duplicates by ID)
    const allResults = [...(filteredLocalData || []), ...(apiResults || [])].reduce((unique, content) => {
      if (content && !unique.some((item) => item.id === content.id)) {
        unique.push(content);
      }
      return unique;
    }, [] as Content[]);

    // console.log("merged all results");

    // console.log(`about to sort all results: ${allResults.length}`);

    const sortedResults: Content[] = sortResults(keyword, allResults);

    // console.log("sorted them");
  

    // console.log("about to get posters");

    const posterContentResults = await Promise.all(
      sortedResults.map(async (content: Content) => {
        const posters = await getPostersFromContent(content);
        return { ...content, posters };
      })
    );

    // console.log("done getting posters and returning now");

    return posterContentResults;
  } catch (error) {
    console.error(`Error searching for "${keyword}":`, error.message);
    return null;
  }
};

export default {};