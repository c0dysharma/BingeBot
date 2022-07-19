require('dotenv').config()
const {Sort} = require('snowfl-api');

const url = `${process.env.SERVER_URL}/webhook`;
const serverConfig = {
  token: process.env.BOT_TOKEN,
  webhook: {
    url: url,
    host: '0.0.0.0',
    port: process.env.PORT || 5000,
    maxConnections: 40
  }
}

const snowflConfig = {
  sort: Sort.MAX_SEED,
  includeNsfw: false
}

const telegraphCreatePageUrl = "https://api.telegra.ph/createPage";
const telegraphPageParams = {
  access_token: process.env.TELEGRAPH_TOKEN,
  title: "Result",
  author_name: "Binge Bot",
  content: ""

}

module.exports = {
  serverConfig,
  snowflConfig,
  telegraphCreatePageUrl,
  telegraphPageParams
}