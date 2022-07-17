const axios = require('axios').default;
const { telegraphCreatePageUrl, telegraphPageParams } = require('../config');
const { allGenres } = require('../constants');
const createContent = require('./content');
require('dotenv').config()

// calls telegra.ph API and creates page
async function createPage(response) {
  let myContent = telegraphPageParams;
  if (response.length == 0) return undefined;
  const results = [];

  for (let movie of response) {
    var movieGenres = [];

    for (let genreId of movie.genre_ids) {
      var currentMovie = {};
      for (let currentGenre of allGenres) {
        if (currentGenre.id.includes(genreId)) {
          movieGenres.push(currentGenre.name);
        }
      }
    }
    // create object for every movie/web series
    currentMovie.title = movie.name || movie.title;
    currentMovie.year = (movie.release_date || movie.first_air_date).split('-')[0];
    currentMovie.rating = movie.vote_average;
    currentMovie.genres = [...new Set(movieGenres)].join(', ');  // to remove duplicates
    currentMovie.overview = movie.overview;

    results.push(currentMovie);
  }

  // get result in required node element format
  myContent.content = JSON.stringify(createContent(results));
  try {
    const res = await axios.post(telegraphCreatePageUrl, myContent);  // creates actual page
    console.log(res.data.result.url);
    return res.data.result.url;

  } catch (error) {
    console.log("Error Ocurred while creating telegraph-> ", error);
  }
}

module.exports = createPage;