# WhatWereWatching

## Overview
**WhatWereWatching** is a **React Native & TypeScript** app built with **Expo Go**. It helps users discover movies & TV shows, create watchlists, find streaming options, and even use a fun spinner to pick something to watch.  
 * This project was built along with [@jslade4](https://github.com/jslade4) for our **Interface Design and Technology** class. 

## Screen Shots
<div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 60px;">
   <img src="https://github.com/user-attachments/assets/3312ab7c-03c2-4072-b652-78143612bf43" alt="Library" height="400"/>
   <img src="https://github.com/user-attachments/assets/7ae6c02c-2262-4343-8302-c5efb9d6fe77" alt="Search" height="400"/>
   <img src="https://github.com/user-attachments/assets/15b8477c-9e0c-476e-a2b3-96c70d9f7399" alt="Spinner" height="400"/>
</div>

## Installation

Follow these steps to set up and run What Were Watching locally:

### 1. Clone the repository
```sh
git clone https://github.com/Albro3459/WhatWereWatching.git
```

### 2. Navigate into the project directory
```sh
cd WhatWereWatching
```

### 3. Install dependencies
```sh
npm install
```

### 4. Install the Expo Go app on your phone
Download and install the Expo Go app from the App Store (iOS) or Google Play Store (Android).

### 5. Start the development server
```sh
npm start
```

### 6. Run the app on your device
- **On iPhone:** Scan the QR code with the iPhone Camera app.
- **On Android:** Open the Expo Go app and scan the QR code using the camera in the app.

## API Setup
The app requires connecting to two APIs.

### 1️. Obtain API Keys
- **[TMDB API](https://developer.themoviedb.org/reference/intro/getting-started)** – Get a **Bearer Token**.
- **[RapidAPI](https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability/playground/apiendpoint_14b2f4b9-8801-499a-bcb7-698e550f9253)** – Get an **API Key**.

### 2. Configure API Credentials
Create a `keys.ts` file in the project root and **add it to .gitignore**.

```typescript
export const RAPIDAPI_KEY = "...";
export const TMDB_BEARER_TOKEN = "...";
```

<br></br>
