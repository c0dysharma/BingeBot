const { entertainment } = require('../constants');
const fetchDetails = require('./fetch');

// function responsible for handling queries
async function handleQuery(bot, msg, type, requiredGenres, selectedCountries, page) {
  msg.reply.text('Please Wait, getting what you want');
  const result = await fetchDetails(requiredGenres, type, page, selectedCountries);
  // concatinating selectedCountries to preserve query for more button
  if (result) {
    let newFetchType = (type == entertainment.movie)
      ? 'fetchMovies' + selectedCountries
      : 'fetchTV' + selectedCountries;

    let callback = `${newFetchType} ${requiredGenres}`;
    const moreButton = bot.inlineKeyboard([
      [bot.inlineButton('More', { callback })]
    ]);
    // send response with inine more button
    bot.sendMessage(msg.from.id, result.toString(), { replyMarkup: moreButton })
  } else {
    // if result is empty
    msg.reply.text('Nothing found! you have a crazy taste');
  }
};

// returns true if event for such query exists
function isHandled(text) {
  const allQuries = ['/start', '/Start', '/hello', 'start', '/help', 'help',
    '/movies', '/tv', '/imovies', '/itv', '/genres', 'sticker'];
  return allQuries.includes(text.split(' ')[0]);
}

module.exports = {handleQuery, isHandled}