const { DB_URL, DB_USER, DB_PASSWORD, DB_DATABASE } = require('./utils/config');

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: DB_URL,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
