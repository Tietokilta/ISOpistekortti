const { DB_USER, DB_PASSWORD, DB_DATABASE } = require('./utils/config');

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
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
