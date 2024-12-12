// import axios from 'axios';
// import fs from 'fs/promises';
// import path from 'path';
// import { movies, tvShows } from '../data/moviesAndTvShows';

// ////// pulls data from the api into the db.json file

// ///////////// ********** COMMENT THIS OUT TO RUN THE PROJECT. IT WONT RUN UNLESS ITS COMMENTED OUT ********

// ///// RUN THIS IN THE TERMINAL TO USE:
// ///// npm run populate-db

// import { RAPIDAPI_KEY } from '@/keys';

// const dbFilePath = path.join(__dirname, '..', 'data', 'db.json');

// const API_BASE_URL = 'https://streaming-availability.p.rapidapi.com/shows/search/title';
// // ******* DO NOT PUSH UR API KEY *******
// const API_HEADERS = {
//     'x-rapidapi-key': 'YOUR API KEY',
//     'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
// };

  
// const checkDBFile = async () => {
//     try {
//         // Create and initialize the db with default content only if it doesn't exist
//         await fs.writeFile(dbFilePath, JSON.stringify({ data: [] }, null, 2), { flag: 'wx' });
//         console.log('db.json file created with default content.');
//         return true;
//     } catch (error: any) {
//         if (error.code === 'EEXIST') {
//             console.log('db.json file already exists. No action needed.');
//             return null;
//         } else {
//             console.error('Error creating db.json file:', error);
//             return null;
//         }
//     }
//   };

// // Function to fetch data for a single title
// const fetchTitle = async (title: string) => {
    
//     const options = {
//         method: 'GET',
//         url: API_BASE_URL,
//         params: {
//             country: 'us',
//             title: title,
//             series_granularity: 'show',
//             output_language: 'en'
//         },
//         headers: API_HEADERS
//     };

//     try {
//         console.log(`Fetching data for: ${title}`);
//         const response = await axios.request(options);
//         const data = response.data[0];

//         return data;
//     } catch (error) {
//         console.error(`Error fetching data for "${title}":`, error.message);
//         return null;
//     }
// };

// const fetchData = async () => {
//     if (API_HEADERS['x-rapidapi-key'] === 'YOUR API KEY') {
//         console.error('You need your own API key');
//         return;
//     }

//     if (await checkDBFile()) {
    
//         console.log("Fetching data from the API");
//         let data: string[] = [];

//         for (const movie of movies) {
//             data.push(await fetchTitle(movie));
//         }
//         for (const tvShow of tvShows) {
//             data.push(await fetchTitle(tvShow));
//         }
//         console.log("Finished fetching data");

//         // Write the data to db.json, if the file doesn't already exist
//         console.log("Writing data to db.json");
//         await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
//         console.log('Data successfully written to db.json');
//     }
// }

// fetchData();

export default {};