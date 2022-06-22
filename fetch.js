require('dotenv').config()

// Movies and Tv shows
const discoverMovieBaseUrl = "https://api.themoviedb.org/3/discover/movie";
const discoverTvBaseUrl = "https://api.themoviedb.org/3/discover/tv";

// configurations 
const languagesUrl = "https://api.themoviedb.org/3/configuration/languages?api_key=83aa95266455a2c5d1ad593b55f9da5b";
const countriesUrl = "https://api.themoviedb.org/3/configuration/countries?api_key=83aa95266455a2c5d1ad593b55f9da5b";
const imageBaseUrl = "http://image.tmdb.org/t/p/w500";

const countries = {
  indian: 0,
  globally: 1
}

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

const getDetails = async (requiredGenres, type, page, seletedCountries) => {
  movieParams.params.with_genres = getIds(requiredGenres);
  movieParams.params.page = parseInt(page);
  movieParams.params.with_original_language =
    (seletedCountries == countries.indian)
      ? indianLanguages
      : '';

  const url = type == 0 ? discoverMovieBaseUrl : discoverTvBaseUrl
  try {
    let results = [];
    const res = await axios.get(url, movieParams)

    for (let movie of res.data.results) {
      var movieGenres = [];
      for (let genreId of movie.genre_ids) {
        for (let currentGenre of allGenres) {
          if (currentGenre.id.includes(genreId)) {
            movieGenres.push(currentGenre.name);
          }
        }
      }

      const posterLink = movie.poster_path
        ? `${imageBaseUrl}${movie.poster_path}`
        : '';

      const title = movie.name || movie.title;
      results.push(title + ' ' + movieGenres.toString() + ' ' + posterLink + '\n');
    }
    // console.log(res);
    return results;
  } catch (e) {
    console.log("fetch error: ", e);
  }
}

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
// custom filters
const allGenres = [
  {
    id: '10749',
    name: 'Romantic'
  },
  {
    "id": '36',
    name: "History"
  },
  {
    "id": '10402',
    name: "Music"
  },
  {
    "id": '53',
    name: "Thriller"
  },
  {
    "id": '27',
    name: "Horror"
  },
  {
    "id": '10759|28|12',
    "name": "Action & Adventure"
  },
  {
    "id": '16',
    "name": "Animation"
  },
  {
    "id": '35',
    "name": "Comedy"
  },
  {
    "id": '80',
    "name": "Crime"
  },
  {
    "id": '99',
    "name": "Documentary"
  },
  {
    "id": '18',
    "name": "Drama"
  },
  {
    "id": '10751',
    "name": "Family"
  },
  {
    "id": '10762',
    "name": "Kids"
  },
  {
    "id": '9648',
    "name": "Mystery"
  },
  {
    "id": '10763',
    "name": "News"
  },
  {
    "id": '10764',
    "name": "Reality"
  },
  {
    "id": '10765|878|14',
    "name": "Sci-Fi & Fantasy"
  },
  {
    "id": '10766',
    "name": "Soap"
  },
  {
    "id": '10767',
    "name": "Talk"
  },
  {
    "id": '10768|10752',
    "name": "War & Politics"
  },
  {
    "id": '37',
    "name": "Western"
  }
];

