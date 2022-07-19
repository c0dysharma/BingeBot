require('dotenv').config()
const { welcomeMsg, avaliableGenres, entertainment, countries } = require('./constants');
const fetchDetails = require('./recommends/fetch');
const { serverConfig } = require('./config')
const { handleQuery } = require('./recommends/brain')
const { snowflSearch } = require('./snowfl/brain')

const TeleBot = require('telebot');
const bot = new TeleBot(serverConfig);

let page = 1;
const axios = require('axios').default;

// help text
bot.on(['/start', '/Start', '/hello', 'start', '/help', 'help'], (msg) => {
  page = 1;
  msg.reply.text(welcomeMsg);
});

// runs when more button is pressed
bot.on('callbackQuery', async msg => {
  const chatId = msg.message.chat.id;
  const messageId = msg.message.message_id;

  const query = msg.data.split(' ')[0];
  const genreString = msg.data.split(' ')[1];
  const requiredGenres = genreString.split(',');

  const selectedCountries = (query.endsWith(countries.indian))
    ? countries.indian
    : countries.globally;
  const queryType = (query.includes('fetchMovies'))
    ? 'fetchMovies'
    : 'fetchTV';

  // torrent next page in response
  page++;
  let result;

  try {
    if (queryType == 'fetchMovies') {
      result = await fetchDetails(requiredGenres, entertainment.movie, page, selectedCountries);
    } else {
      result = await fetchDetails(requiredGenres, entertainment.tv, page, selectedCountries);
    }

    if (result) {
      const newFetchType = queryType + selectedCountries;
      const callback = `${newFetchType} ${requiredGenres}`;

      const moreButton = bot.inlineKeyboard([
        [bot.inlineButton('More', { callback })]
      ]);
      // edit existing message with new response
      bot.editMessatorrentext({ chatId, messageId }, result.toString(),
        { replyMarkup: moreButton })
    } else {
      // if no more result exits
      msg.reply.text('Nothing found! you have a crazy taste');
    }

  } catch (error) {
    console.log('New Fetch faild==>', error);
  }
})

// returns true if event for such query exists
function isHandled(text) {
  const allQuries = ['/start', '/Start', '/hello', 'start', '/help', 'help',
    '/movies', '/tv', '/imovies', '/itv', '/genres', 'sticker', '/torrent'];
  return allQuries.includes(text.split(' ')[0]);
}

// fetch movies globally
bot.on('/movies', async (msg) => {
  if (msg.text.split(' ').length == 1)
    msg.reply.text('Include genres. Try /start for examples');
  else {
    const requiredGenres = msg.text.split(/[ ,]+/);
    requiredGenres.shift(); // remove /command
    try {
      handleQuery(bot, msg, entertainment.movie, requiredGenres, countries.globally, page);
    } catch (error) {
      console.log("I broke lol error->", error);
    }
  }
});

// fetch web series globally
bot.on('/tv', async (msg) => {
  if (msg.text.split(' ').length == 1)
    msg.reply.text('Include genres. Try /start for examples');
  else {
    const requiredGenres = msg.text.split(/[ ,]+/);
    requiredGenres.shift(); // remove /command
    try {
      handleQuery(bot, msg, entertainment.tv, requiredGenres, countries.globally, page);
    } catch (error) {
      console.log("I broke lol error->", error);
    }
  }
});

// fetch movies indian
bot.on('/imovies', async (msg) => {
  if (msg.text.split(' ').length == 1)
    msg.reply.text('Include genres. Try /start for examples');
  else {
    const requiredGenres = msg.text.split(/[ ,]+/);
    requiredGenres.shift(); // remove /command
    try {
      handleQuery(bot, msg, entertainment.movie, requiredGenres, countries.indian, page);
    } catch (error) {
      console.log("I broke lol error->", error);
    }
  }
});

// fetch web series indian
bot.on('/itv', async (msg) => {
  if (msg.text.split(' ').length == 1)
    msg.reply.text('Include genres. Try /start for examples');
  else {
    const requiredGenres = msg.text.split(/[ ,]+/);
    requiredGenres.shift(); // remove /command
    try {
      handleQuery(bot, msg, entertainment.tv, requiredGenres, countries.indian);
    } catch (error) {
      console.log("I broke lol error->", error);
    }
  }
});

// watch avaliable genres
bot.on('/genres', msg => {
  msg.reply.text(avaliableGenres.join(', '));
})


// searches torrent and give results
bot.on('/torrent', async (msg) => {
  if (msg.text.split(' ').length <= 1 || msg.text.split(' ')[1].length <= 2)
    msg.reply.text('Include search query of length greater  than 2. Try /start for examples');
  else {
    const query = msg.text.split(' ')[1];
    try {
      await snowflSearch(bot, msg, query);
    } catch (error) {
      console.log("I broke lol error->", error);
    }
  }
});

// nothing required
bot.on('sticker', msg => {
  msg.reply.text('You kidding me :P');
})

// handle which events aren't handled
bot.on('text', msg => {
  if (!isHandled(msg.text)) {
    msg.reply.text(`Invalid command: ${msg.text}
  Try /start`)
  }
})

bot.start() // starts the bot