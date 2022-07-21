const { snowflConfig } = require("../config");
const { Snowfl } = require("snowfl-api");
const { createPage } = require("./telegraph");
const snowfl = new Snowfl();

const supportedStuffs = ["Anime", "Movie", "Movies", "TV", "Video"]

async function snowflSearch(bot, msg, query) {
  msg.reply('Please wait getting you torrents 🏴‍☠️')
  const result = await snowfl.parse(query, snowflConfig);
  if (result.status != 200) {
    msg.reply.text('Unable to get data'); return;
  }
  if (result.data.length == 0) {
    msg.reply.text('Nothing Found, please refine search query'); return;
  }

  // filter only supportedStuffs
  const allLinks = result.data.filter((value) => {
    const currentType = value.type;
    for (let aval of supportedStuffs) {
      if (currentType.startsWith(aval)) return true;
    } return false;
  })
  if (allLinks.length == 0) {
    msg.reply.text('Nothing Found, please refine search query'); return;
  }

  // create Telegraph page
  try {
    const generatedLink = await createPage(allLinks);
    msg.reply.text(generatedLink);
  } catch (e) {
    console.log('Unable to get torrent links', e);
    msg.reply.text('Unable to get torrent links');
  }
}

module.exports = { snowflSearch };