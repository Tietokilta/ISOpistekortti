const { Pool } = require("pg");

const ssl = process.env.NODE_ENV === "production";

console.log(`using SSL for DB: ${ssl}`);

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_URL,
  ssl,
  port: 5432,
});

module.exports = pool;
