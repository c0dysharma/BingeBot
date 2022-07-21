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
  for (let i = 0; i < limit; i++) {
    const stuff = responseArray[i];
    if (stuff.magnet) {
      const mag = await axios.get(`http://mgnet.me/api/create?m=${stuff.magnet}`)
      if (mag.data.state == 'success')
        stuff.magnet = mag.data.shorturl;
    }

    const title = { "tag": "b", "children": [`${stuff.name}\n`] };
    const details = { "tag": "p", "children": [`Type: ${stuff.type} • Age: ${stuff.age}\n`] };
    const stats = { "tag": "p", "children": [`Seeders: ${stuff.seeder} • Leechers: ${stuff.leecher}\n`] };
    const siteLink = {
      "tag": "p", "children": [
        `Size: ${stuff.size}`,
        { "tag": "a", "attrs": { "href": stuff.url }, "children": [' Site Link '] }
      ]
    }
    const torrentLink = {
      "tag": "p", "children": [
        { "tag": "a", "attrs": { "href": stuff.magnet }, "children": [' Magnet Link\n'] },
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
    format.children[0].children.push(siteLink);
    if (stuff.magnet) format.children[0].children.push(torrentLink);
    content.push(format);
  }
  myContent.content = content;
  const res = await axios.post(telegraphCreatePageUrl, myContent);
  console.log(res.data.result.url);
  return res.data.result.url;
}

module.exports = { snowflSearch };