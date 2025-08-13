const path = require("path")
const { DB_URL, DB_USER, DB_PASSWORD, DB_DATABASE } = require('./utils/config');
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

production = {
  client: "pg",
  connection: {
    host: DB_URL,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,

    ssl: true,
    sslmode: "require",
  },
  migrations: {
    directory: path.join(__dirname, "migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "seeds"),
  },
};

module.exports = {
  development,
  production,
};
