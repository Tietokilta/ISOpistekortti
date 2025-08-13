const pg = require("pg");
const { native } = pg;
const { Pool } = native;

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          sslmode: "verify-full",
          rejectUnauthorized: true,
          sslrootcert: "system",
        }
      : undefined,
  port: 5432,
});

module.exports = pool;
