const axios = require('axios').default;
const { telegraphCreatePageUrl, telegraphPageParams } = require('../config');
const { torrentLimit } = require("../constants");

async function createPage(responseArray) {
  let myContent = telegraphPageParams;
  let content = []; // gonna store param for telegraph api

  // data getting too large for telegra.ph lol limiting
  let limit = Math.min(responseArray.length, torrentLimit);
  for (let i = 0; i < limit; i++) {
    const stuff = responseArray[i];
    // update magnet to shortened link coz telegraph shit :(
    if (stuff.magnet) {
      const mag = await axios.get(encodeURI(`http://mgnet.me/api/create?m=${stuff.magnet}`))
      if (mag.data.state == 'success')
        stuff.magnet = mag.data.shorturl;
    }

    const title = { "tag": "b", "children": [`${stuff.name}\n`] };
    const details = { "tag": "div", "children": [`Type: ${stuff.type} • Age: ${stuff.age}\n`] };
    const stats = { "tag": "div", "children": [`Seeders: ${stuff.seeder} • Leechers: ${stuff.leecher}\n`] };
    const siteLink = {
      "tag": "div", "children": [
        `Size: ${stuff.size}`,
        { "tag": "a", "attrs": { "href": stuff.url }, "children": [' Site Link '] }
      ]
    }
    const torrentLink = {
      "tag": "div", "children": [
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
  // set the updated param
  myContent.content = content;
  const res = await axios.post(telegraphCreatePageUrl, myContent);
  console.log('Torrent link-> ', res.data.result.url);
  return res.data.result.url;
}

module.exports = createPage