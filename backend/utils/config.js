const { resolve } = require("node:path");
require('dotenv').config({ path: resolve(process.cwd(), '../.env') })

const PORT = process.env.PORT
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE

module.exports = {
  PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
}
