require('dotenv').config()
const { welcomeMsg, avaliableGenres, entertainment, countries } = require('./constants');
const fetchDetails = require('./fetch');

const TeleBot = require('telebot');
const url = `${process.env.SERVER_URL}/webhook/${process.env.BOT_TOKEN}`;

const bot = new TeleBot({
  token: process.env.BOT_TOKEN,
  webhook: {
    url: url,
    host: '127.0.0.1',
    port: 5000,
    maxConnections: 40
  }
});

let page = 1;

// help text
bot.on(['/start', '/Start', '/hello', 'start', '/help', 'help'], (msg) => {
  page = 1;
  msg.reply.text(welcomeMsg);
});

async function handleQuery(msg, type, requiredGenres, selectedCountries) {
  msg.reply.text('Please Wait, getting what you want');
  const result = await fetchDetails(requiredGenres, type, page, selectedCountries);

  if (result) {
    let newFetchType = (type == entertainment.movie)
      ? 'fetchMovies' + selectedCountries
      : 'fetchTV' + selectedCountries;

    let callback = `${newFetchType} ${requiredGenres}`;
    const moreButton = bot.inlineKeyboard([
      [bot.inlineButton('More', { callback })]
    ]);
    bot.sendMessage(msg.from.id, result.toString(), { replyMarkup: moreButton })
  } else {
    msg.reply.text('Nothing found! you have a crazy taste');
  }
};

function isHandled(text) {
  const allQuries = ['/start', '/Start', '/hello', 'start', '/help', 'help',
    '/movies', '/tv', '/imovies', '/itv', '/genres', 'sticker'];
  return allQuries.includes(text.split(' ')[0]);
}

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
      bot.editMessageText({ chatId, messageId }, result.toString(),
        { replyMarkup: moreButton })
    } else {
      msg.reply.text('Nothing found! you have a crazy taste');
    }

  } catch (error) {
    console.log('New Fetch faild==>', error);
  }
})

// fetch movies globally
bot.on('/movies', async (msg) => {
  if (msg.text.split(' ').length == 1)
    msg.reply.text('Include genres. Try /start for examples');
  else {
    const requiredGenres = msg.text.split(' ')[1].split(/[ ,]+/);
    try {
      handleQuery(msg, entertainment.movie, requiredGenres, countries.globally);
    } catch (error) {
      console.log("I broke lol error->", error);
    }
  }
});

// fetch web series globally
bot.on('/tv', async (msg, props) => {
  if (msg.text.split(' ').length == 1)
    msg.reply.text('Include genres. Try /start for examples');
  else {
    const requiredGenres = msg.text.split(' ')[1].split(/[ ,]+/);
    try {
      handleQuery(msg, entertainment.tv, requiredGenres, countries.globally);
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
    const requiredGenres = msg.text.split(' ')[1].split(/[ ,]+/);
    try {
      handleQuery(msg, entertainment.movie, requiredGenres, countries.indian);
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
    const requiredGenres = msg.text.split(' ')[1].split(/[ ,]+/);
    try {
      handleQuery(msg, entertainment.tv, requiredGenres, countries.indian);
    } catch (error) {
      console.log("I broke lol error->", error);
    }
  }
});

// watch avaliable genres
bot.on('/genres', msg => {
  msg.reply.text(avaliableGenres.join(', '));
})

bot.on('sticker', msg => {
  msg.reply.text('You kidding me :P');
})

bot.on('text', msg => {
  if (!isHandled(msg.text)) {
    msg.reply.text(`Invalid command: ${msg.text}
  Try /start`)
  }
})

bot.start()