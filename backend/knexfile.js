module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "myuser",
      password: "mypassword",
      database: "mydatabase",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
