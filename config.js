require('dotenv').config()
const url = `${process.env.SERVER_URL}/webhook/${process.env.BOT_TOKEN}`;
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

module.exports = {
  localConfig,
  herokuConfig
}