const path = require("path")
const { DB_URL, DB_USER, DB_PASSWORD, DB_DATABASE, CA_PATH, } = require('./utils/config');
const fs = require("fs");

development = {
  client: "pg",
  connection: {
    host: DB_URL,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  },
  migrations: {
    directory: path.join(__dirname, "migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "seeds"),
  },
};

// Only evaluate this if it will be used (ie. node_env === "production")
// because a dev may not have the certificates anywhere
production = process.env.NODE_ENV === "production"
  ? {
    client: "pg",
    connection: {
      host: DB_URL,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,

      ssl: { 
        rejectUnauthorized: true, 
        ca: fs.readFileSync(CA_PATH).toString(),
      },
    },
    migrations: {
      directory: path.join(__dirname, "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "seeds"),
    },
  }
  : {};

module.exports = {
  development,
  production,
};
