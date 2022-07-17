require('dotenv').config()
const {Sort} = require('snowfl-api');

const url = `${process.env.SERVER_URL}/webhook`;
const localConfig = {
  token: process.env.BOT_TOKEN,
  webhook: {
    url: url,
    host: '127.0.0.1',
    port: 5000,
    maxConnections: 40
  }
}

const herokuConfig = {
  token: process.env.BOT_TOKEN,
  webhook: {
    url: url,
    host: '0.0.0.0',
    port: process.env.PORT || 5000,
    maxConnections: 40
  }
}

const torrentConfig = {
  sort: Sort.MAX_SEED,
  includeNsfw: false
}

module.exports = {
  localConfig,
  herokuConfig,
  torrentConfig
}