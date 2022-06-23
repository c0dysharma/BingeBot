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
    name: "Suspense & Thriller"
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

const welcomeMsg = `
Just type /movies <genres here> for movies or /tv <genres here> for tv series.
-> If you want only indian stuffs use /imovies and /itv instead
-> genres should be seperated by space or an comma
-> Example: /movies romantic, action
-> Example:  /itv action comedy

Type /genres to get a list of avaliable genres`

const avaliableGenres = [
  'History', 'Music', 'Thriller', 'Horror', 'Action', 'Adventure',
  'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Romantic',
  'Family', 'Kids', 'Mystery', 'News', 'Reality', 'Sci-Fi', 'Fantasy',
  'Soap', 'Talk', 'War & Politics', 'Western'
]

const entertainment = {
  movie: 0,
  tv: 1
}

const countries = {
  indian: 0,
  globally: 1
}

module.exports = {
  allGenres,
  welcomeMsg,
  avaliableGenres,
  entertainment,
  countries
}