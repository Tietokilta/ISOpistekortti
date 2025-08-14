const { resolve } = require("node:path");
require('dotenv').config({ path: resolve(process.cwd(), '../.env') })

const PORT = process.env.PORT
const BIND_ADDRESS = process.env.BIND_ADDRESS
  ? process.env.BIND_ADDRESS
  : "localhost"
const DB_URL = process.env.DB_URL
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const CA_PATH = process.env.PGSSLROOTCERT || "/etc/ssl/certs/ca-bundle.crt"

module.exports = {
  PORT,
  BIND_ADDRESS,
  DB_URL,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  CA_PATH,
}
