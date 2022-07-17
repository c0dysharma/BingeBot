const { torrentConfig } = require("../config");
const { Snowfl } = require("snowfl-api");
const snowfl = new Snowfl();

async function searchTorrent(bot, msg, query){
  const data = await snowfl.parse(query, torrentConfig);
  msg.reply.text(data.message);
}

module.exports = {searchTorrent};