const config = require('./utils/config')
const app = require('./app') // The Express app
const knex = require("knex")(require("./knexfile")[process.env.NODE_ENV || "production"]);

async function waitForDb(knexClient, { retries = 10, delayMs = 1000 } = { }) {
  for (let i = 0; i < retries; i++) {
    try {
      await knexClient.raw('select 1+1 as result');
      console.log("Successfully connected to DB");
      return;
    } catch (err) {
      const ms = Math.min(delayMs * 2 ** i, 30000);
      console.warn(`DB not ready (attempt ${i+1}/${retries}): ${err}. retrying in ${ms}ms`);
      await new Promise(r => setTimeout(r, ms));
    }
  }

  throw new Error(`Database unavailable after ${retries} retries`)
}

async function main() {
  try {
    await waitForDb(knex);

    console.log("Running migrations")
    await knex.migrate.latest();
    console.log("Migrations finished, starting server")

    app.listen(config.PORT, config.BIND_ADDRESS, () => {
      console.log((`Server running on port ${config.PORT}`))
    })
  } catch (err) {
    console.error(`Startup failed: ${err}`);
    process.exit(1)
  }
}

main();
