# WhatWereWatching

 * With this [Movie and TV API](https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability/playground/apiendpoint_14b2f4b9-8801-499a-bcb7-698e550f9253) we can query for Movies and TV shows based on title, genre, catalog (streaming service), type (movie or show), and more.

 * We can use the tmbd id we get to grab the image from the [TMBD API](https://developer.themoviedb.org/reference/discover-movie) where we can use the type (movie or show) and tmbd id to get the image.
   * it will return the image path like this: /8cdWjvZQUExUUTzyp4t6EDMubfO.jpg and we just append that to https://image.tmdb.org/t/p/w500 to get https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg for the image.

 * I think we should just create a wrapper API in either python, JS, or C# to pass in either title, genre, catalog, or type and then our API will handle the calls for to the first API and the tmdb api for the image and send those back.

 * We also need a table or db for user data like accounts, reviews, movie/show lists, favorites maybe, etc.
