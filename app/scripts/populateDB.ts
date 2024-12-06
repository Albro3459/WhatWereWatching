import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

// pulls data from the api into the db.json file

// RUN THIS IN THE TERMINAL TO USE:
// npm run populate-db

const movies = [
    'Joker',
    'About Time',
    'The Notebook',
    'Star Wars',
    'Avengers: Endgame',
    'Dunkirk',
    'Get Out',
    'Inception',
    'The Dark Knight',
    'Interstellar',
    'The Godfather',
    'Pulp Fiction',
    'Fight Club',
    'The Shawshank Redemption',
    'The Matrix',
    'Forrest Gump',
    'Titanic',
    'La La Land',
    'Crazy Rich Asians',
    'Pride and Prejudice',
    'To All the Boys I’ve Loved Before',
    'The Hunger Games',
    'The Maze Runner',
    'The Lord of the Rings: The Fellowship of the Ring',
    'The Hobbit: An Unexpected Journey',
    'Pirates of the Caribbean: The Curse of the Black Pearl',
    'Black Panther',
    'Guardians of the Galaxy',
    'Captain Marvel',
    'Spider-Man: No Way Home',
    'Doctor Strange',
    'Wonder Woman',
    'The Suicide Squad',
    'Frozen',
    'Zootopia',
    'Minions'
];

const tvShows = [
    'Breaking Bad',
    'Friends',
    'The Office',
    'Stranger Things',
    'Game of Thrones',
    'The Crown',
    'Sherlock',
    'Bridgerton',
    'The Peaky Blinders',
    'Better Call Saul',
    'The Witcher',
    'Money Heist',
    'Narcos',
    'The Big Bang Theory',
    'How I Met Your Mother',
    'Modern Family'
];
  
const checkDBFile = async (filePath: string) => {
    try {
        // Create and initialize the db with default content only if it doesn't exist
        await fs.writeFile(filePath, JSON.stringify({ data: [] }, null, 2), { flag: 'wx' });
        console.log('db.json file created with default content.');
        return true;
    } catch (error: any) {
        if (error.code === 'EEXIST') {
            console.log('db.json file already exists. No action needed.');
            return null;
        } else {
            console.error('Error creating db.json file:', error);
            return null;
        }
    }
  };

const API_BASE_URL = 'https://streaming-availability.p.rapidapi.com/shows/search/title';
// ******* DO NOT PUSH UR API KEY *******
const API_HEADERS = {
    'x-rapidapi-key': 'lebron',
    'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
};

// Function to fetch data for a single title
const fetchTitle = async (title: string) => {
    
    const options = {
        method: 'GET',
        url: API_BASE_URL,
        params: {
            country: 'us',
            title: title,
            series_granularity: 'show',
            output_language: 'en'
        },
        headers: API_HEADERS
    };

    try {
        console.log(`Fetching data for: ${title}`);
        const response = await axios.request(options);
        const data = response.data[0];

        return data;
    } catch (error) {
        console.error(`Error fetching data for "${title}":`, error.message);
        return null;
    }
};

const fetchData = async () => {
    if (API_HEADERS['x-rapidapi-key'] === 'YOUR API KEY') {
        console.error('You need your own API key');
        return;
    }
    
    console.log("Fetching data from the API");
    let data: string[] = [];

    for (const movie of movies) {
        data.push(await fetchTitle(movie));
    }
    for (const tvShow of tvShows) {
        data.push(await fetchTitle(tvShow));
    }
    console.log("Finished fetching data");

    // Write the data to db.json, if the file doesn't already exist
    console.log("Writing data to db.json");
    const filePath = path.join(__dirname, '..', '..', 'db.json');
    if (await checkDBFile(filePath)) {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Data successfully written to db.json');
    }
}

fetchData();