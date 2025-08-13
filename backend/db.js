const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_URL,
  port: 5432,
});

module.exports = pool;
