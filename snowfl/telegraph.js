const axios = require('axios').default;
const { telegraphCreatePageUrl, telegraphPageParams } = require('../config');
const { torrentLimit } = require("../constants");

async function createPage(responseArray) {
  let myContent = telegraphPageParams;
  let content = [];

  // data getting too large for telegra.ph lol limiting
  let limit = Math.min(responseArray.length, torrentLimit);
  for (let i = 0; i < limit; i++) {
    const stuff = responseArray[i];
    if (stuff.magnet) {
      const mag = await axios.get(encodeURI(`http://mgnet.me/api/create?m=${stuff.magnet}`))
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

module.exports = {
  createPage
}