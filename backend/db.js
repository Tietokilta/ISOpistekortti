const { Pool } = require("pg");
const { DB_USER, DB_DATABASE, DB_PASSWORD, DB_URL, CA_PATH } = require("./utils/config");
const fs = require("fs");

const pool = new Pool({
  user: DB_USER,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  host: DB_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: true,
          ca: fs.readFileSync(CA_PATH).toString(),
        }
      : undefined,
  port: 5432,
});

module.exports = pool;
