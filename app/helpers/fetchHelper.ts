import * as FileSystem from 'expo-file-system';
import axios, { all } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Content, PosterContent, Posters, StreamingOption } from '../types/contentType';
import db from '../data/db.json';
import { RAPIDAPI_KEY, TMDB_BEARER_TOKEN } from '@/keys';
import { Filter, Genres, PaidOptions, Services, Types } from '../types/filterTypes';
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
const CURRENT_DB_VERSION = 2.0;

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
      console.log('Fetch Helper: clearing tabs and database');
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
export const getRandomContent = async (count: number): Promise<PosterContent[] | null> => {
  try {
    const data: Content[] = await loadDbFile();
    if (!data) return null;
    if (!Array.isArray(data)) return null;

    // No filters applied, so filterContents should return everything.
    const filter: Filter = { selectedGenres: [], selectedTypes: [], selectedServices: [], selectedPaidOptions: [] };
    const allContent = filterContents(data, filter);

    // Pre-filter by year and posters
    const eligibleContent: PosterContent[] = [];
    for (const item of allContent) {
      if (item.releaseYear >= 2000 && item.rating >= 75) {
        const posters = await getPostersFromContent(item);
        if (posters.horizontal.length > 0 && posters.vertical.length > 0) {
          eligibleContent.push({ ...item, posters });
        }
      }
    }

    if (count > eligibleContent.length) {
      console.warn('Requested count exceeds available filtered content.');
      return null;
    }

    const selectedContent: PosterContent[] = [];
    const usedIndexes = new Set<number>();

    while (selectedContent.length < count) {
      const randomIndex = Math.floor(Math.random() * eligibleContent.length);
      if (!usedIndexes.has(randomIndex)) {
        selectedContent.push(eligibleContent[randomIndex]);
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

  // console.log(`bad poster found for ${url}`);

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

const isFilterEmpty = (filter: Filter) => {
  return filter.selectedGenres.length === 0 && filter.selectedTypes.length === 0 && 
         filter.selectedServices.length === 0 && filter.selectedPaidOptions.length === 0;
};


// THE API CANNOT FILTER BY PAID TYPE LIKE free or rent or buy or subscription. idk why its retarded
const fetchWithFilters = async (filter: Filter): Promise<Content[]> => {

  // gets services in this format: for free: netflix, for rent: netflix.rent, then makes them comma separated
  const getServiceTypes = (): string => {
    let outputText: string = "";
    const services: string[] = filter.selectedServices && filter.selectedServices.length > 0
                    ? filter.selectedServices
                    : Services.map((service) => service.value);

    const paidOptions: string[] = filter.selectedPaidOptions || filter.selectedPaidOptions; // empty means free

    services.map((service) => {
        for (const option of paidOptions) {
          outputText += `${service}${option ? `.${option}` : ""},`;
        }
      })
      .join(",");

    return outputText.slice(0, -1); // remove the trailing comma
  };

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
      ...getServiceTypes() && { catalogs: getServiceTypes() },
      ...filter.selectedTypes.length === 1 && { show_type: filter.selectedTypes[0] } // Include only if exactly one type is specified
    },
    headers: API_HEADERS
  };

  try {
    console.log('fetching with these filters', {
      country: 'us',
      series_granularity: 'show',
      ...filter.selectedGenres.length > 0 && { genres: filter.selectedGenres.join(',') },
      order_direction: 'desc',
      order_by: 'popularity_1year',
      ...filter.selectedGenres.length > 0 && { genres_relation: 'or' }, // include content from any selected genre
      output_language: 'en',
      ...getServiceTypes() && { catalogs: getServiceTypes() },
      ...filter.selectedTypes.length === 1 && { show_type: filter.selectedTypes[0] } // Include only if exactly one type is specified
    });

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

const sortResults = (keyword: string, allResults: Content[]): Content[] => {
  const irrelevantWordsRegex = /\b(the|a|an|of)\b/gi;
  const punctuationRegex = /[',\.\/#!?$%\^&\*;:{}=\-_`~()\[\]]/g;

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .replace(punctuationRegex, '')     // Remove punctuation
      .replace(irrelevantWordsRegex, '') // Remove irrelevant words
      .replace(/\s+/g, ' ')              // Normalize spaces
      .trim() || '';

  const adjustedKeyword = normalizeText(keyword);

  // removes irrelevant results
  const filterIrrelevantResults: Content[] = allResults.filter(item =>
    normalizeText(item.title).includes(adjustedKeyword) ||
    normalizeText(item.originalTitle).includes(adjustedKeyword) ||
    normalizeText(item.overview).includes(adjustedKeyword) ||
    item.cast?.some(member => normalizeText(member).includes(adjustedKeyword)) ||
    item.directors?.some(director => normalizeText(director).includes(adjustedKeyword))
  );

  return allResults.sort((a, b) => {
    // if (a.title === "the wolf of wallstreet") {
    //   console.log(`a: ${normalizeText(a.title)}`);
    // }
    // else if (b.title === "the wolf of wallstreet") {
    //   console.log(`b: ${normalizeText(a.title)}`);
    // }
    const aNorm = normalizeText(a.title);
    const bNorm = normalizeText(b.title);

    const aExact = aNorm === adjustedKeyword;
    const bExact = bNorm === adjustedKeyword;

    // Exact matches first
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    const aMatches = aNorm.includes(adjustedKeyword);
    const bMatches = bNorm.includes(adjustedKeyword);

    // Partial matches next
    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;

    // Finally, sort alphabetically
    return aNorm.localeCompare(bNorm);
  });
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
    console.log(`Error filtering local db for ${keyword} and filters:`, error.message);
    return [];
  }
};

export const searchByKeywords = async (keyword: string, filter: Filter): Promise<PosterContent[] | null> => {
  try {
    if (!keyword) { keyword = ""; }
    else { keyword = keyword.toLowerCase().trim() || ""; }

    if (keyword.length === 0 && isFilterEmpty(filter)) { return null; }

    let apiResults: Content[] = [];

    const filteredLocalData: Content[] = await filterLocalDB(keyword, filter) || [];    

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
            // console.log('successfully updated the database');
          }
        }
        else {
          // console.log(`no new contents`);
        }
      }

    // console.log(`About to merge all filtered data: ${filteredLocalData.length} apiResults: ${apiResults.length}`);
    // // Merge local data and API results (avoid duplicates by ID)
    const allResults = [...(filteredLocalData || []), ...(apiResults || [])].reduce((unique, content) => {
      if (content && !unique.some((item) => item.id === content.id)) {
        unique.push(content);
      }
      return unique;
    }, [] as Content[]);

    // console.log(`all results ${allResults.length} left FOR ${keyword}`);

    const sortedResults: Content[] = sortResults(keyword, allResults);

    // console.log(`sorted results ${sortedResults.length} FOR ${keyword}`);

    const posterContentResults = await Promise.all(
      sortedResults.slice(0,20).map(async (content: Content) => {
        const posters = await getPostersFromContent(content);
        return { ...content, posters };
      })
    );

    // console.log(`RETURNING ${posterContentResults.length} RESULTS FOR ${keyword}`);

    return posterContentResults;
  } catch (error) {
    console.error(`Error searching for "${keyword}":`, error.message);
    return null;
  }
};

export default {};