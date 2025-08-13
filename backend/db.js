const { Pool } = require("pg");

const useSSL = process.env.NODE_ENV === "production";

console.log(`using SSL for DB: ${useSSL}`);

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_URL,
  ssl: useSSL ? "require" : undefined,
  port: 5432,
});

module.exports = pool;
