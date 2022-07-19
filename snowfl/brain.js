const { snowflConfig, telegraphCreatePageUrl, telegraphPageParams } = require("../config");
const { Snowfl } = require("snowfl-api");
const axios = require('axios').default;
const snowfl = new Snowfl();

const supportedStuffs = ["Anime", "Movie", "Movies", "TV", "Video"]

async function snowflSearch(bot, msg, query) {
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
  const generatedLink = await createPage(allLinks);
  msg.reply.text(generatedLink);
}

async function createPage(responseArray) {
  let myContent = telegraphPageParams;
  let content = [];

  // data getting too large for telegra.ph lol limiting
  let limit = Math.min(responseArray.length, 50);
  for ( let i=0; i<limit; i++) {
    const stuff = responseArray[i];
    // stuff.magnet = stuff.magnet ? stuff.magnet : stuff.url;

    const title = { "tag": "b", "children": [`${stuff.name}\n`] };
    const details = { "tag": "p", "children": [`${stuff.type} • ${stuff.age}\n`] };
    const stats = { "tag": "p", "children": [`${stuff.seeder} • ${stuff.leecher}\n`] };
    const links = {
      "tag": "p", "children": [
        `${stuff.size}`,
        { "tag": "a", "attrs": { "href": 'magnet:?xt=urn:btih:82d07a5f94a28887ccb3cddc29618e45ea74f508&dn=[JAV] [Uncensored] CND-045 [720p]&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.birkenwald.de%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2970%2Fannounce' }, "children": [' Magnet Link'] },
        { "tag": "a", "attrs": { "href": stuff.url }, "children": [' Torrent Link\n'] }
      ]
    }

    let format = {
      "tag": "ul", "children": [
        {
          "tag": "li", "children": []
        }
      ]
    }
    format.children[0].children.push(title);
    format.children[0].children.push(details);
    format.children[0].children.push(stats);
    format.children[0].children.push(links);
    content.push(format);
  }
  myContent.content = content;
  const res = await axios.post(telegraphCreatePageUrl, myContent);
  console.log(res.data.result.url);
  return res.data.result.url;
}

module.exports = { snowflSearch };