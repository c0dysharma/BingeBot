require('dotenv').config()
const { allGenres, countries, entertainment } = require('./constants');
const createPage = require('./telegraph')

// Movies and Tv shows
const discoverMovieBaseUrl = "https://api.themoviedb.org/3/discover/movie";
const discoverTvBaseUrl = "https://api.themoviedb.org/3/discover/tv";

// custom filters
const indianLanguages = "hi|kn|ml|ta|te";

const movieParams = {
  params: {
    api_key: process.env.API_KEY,
    language: "en-US",
    sort_by: "popularity.desc",
    page: 1,
    with_genres: "",
    with_original_language: ""
  }
}

const axios = require('axios').default;
require('dotenv').config()

// main driver function
const getDetails = async (requiredGenres, type, page, seletedCountries) => {
  // update query parameters
  movieParams.params.with_genres = getIds(requiredGenres);
  movieParams.params.page = parseInt(page);
  movieParams.params.with_original_language =
    (seletedCountries == countries.indian)
      ? indianLanguages
      : '';

  // choose what we want
  const url = (type == entertainment.movie)
    ? discoverMovieBaseUrl
    : discoverTvBaseUrl;
  try {
    const res = await axios.get(url, movieParams) // calling TMDB API
    const generatedLink = await createPage(res.data.results)  // return telegra.ph results or undefined if no result found
    if (generatedLink) return generatedLink; else undefined;  // retuns link if generetated

  } catch (e) {
    console.log("fetch error: ", e);
  }
}

// Returns IDs from genre String coz TMDB API requires IDs
function getIds(genreString) {
  let requiredGenres = [...genreString];
  for (let index = 0; index < requiredGenres.length; index++) {
    for (let currentGenre of allGenres) {
      const thisGenre = (requiredGenres[index]).toLowerCase();

      if (currentGenre.name.toLowerCase().includes(thisGenre)) {
        requiredGenres[index] = currentGenre.id;
      }
    }
  }
  return requiredGenres.toString();
}

module.exports = getDetails;

// for future use 
const languagesUrl = "https://api.themoviedb.org/3/configuration/languages?api_key=83aa95266455a2c5d1ad593b55f9da5b";
const countriesUrl = "https://api.themoviedb.org/3/configuration/countries?api_key=83aa95266455a2c5d1ad593b55f9da5b";
const imageBaseUrl = "http://image.tmdb.org/t/p/w500";

