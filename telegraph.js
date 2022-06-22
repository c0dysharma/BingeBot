let content = [];

let format = {
  "tag": "ul", "children": [
    {
      "tag": "li", "children": [
        { "tag": "p", "children": ["3 Idiots (2010)\n", { "tag": "a", "children": ["Trailer"], "attrs": { "href": "#" } }] }
      ]
    }
  ]
}

const axios = require('axios').default;
const {allGenres} = require('./constants');
require('dotenv').config()


const createPageUrl = "https://api.telegra.ph/createPage";
const params = {
  access_token: process.env.TELEGRAPH_TOKEN,
  title: '',
  author_name: "Binge Bot",
  content: ""
}

async function createPage(response){
  const results = [];

  for(let movie of response){
    var movieGenres = [];
    var currentMovie ={};

    for (let genreId of movie.genre_ids) {
      for (let currentGenre of allGenres) {
        if (currentGenre.id.includes(genreId)) {
          movieGenres.push(currentGenre.name);
        }
      }
    }

    currentMovie.title = movie.name || movie.title;
    currentMovie.year = (movie.release_date).split('-')[0];
    currentMovie.rating = movie.vote_average;
    currentMovie.genres = movieGenres;

    results.push(currentMovie);
  }
  console.log(results);
  
}

module.exports = createPage;