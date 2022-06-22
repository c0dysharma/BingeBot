const axios = require('axios').default;
const { allGenres } = require('./constants');
const createContent = require('./content');
require('dotenv').config()


const createPageUrl = "https://api.telegra.ph/createPage";
const pageParams = {
  access_token: process.env.TELEGRAPH_TOKEN,
  title: "Result",
  author_name: "Binge Bot",
  content: ""

}

async function createPage(response) {
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

    currentMovie.title = movie.name || movie.title;
    currentMovie.year = (movie.release_date || movie.first_air_date).split('-')[0];
    currentMovie.rating = movie.vote_average;
    currentMovie.genres = [...new Set(movieGenres)];  // to remove duplicates

    results.push(currentMovie);
  }

  // Create page
  pageParams.content = JSON.stringify(createContent(results));
  try {
    const res = await axios.post(createPageUrl, pageParams);
    console.log(res.data.result.url);
    return res.data.result.url;

  } catch (error) {
    console.log("Error Ocurred while creating telegraph-> ", error);
  }
}

module.exports = createPage;