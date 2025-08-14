const util = require("util");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const dupeQuery = `
    SELECT lower(username) AS canonical_username,
           array_agg(id ORDER BY id) AS ids,
           count(*) AS count
    FROM users
    GROUP BY canonical_username
    HAVING count(*) > 1;
  `;

  // Check for already existing duplicate usernames before disallowing duplicates
  const dupeResult = await knex.raw(dupeQuery);

  if (dupeResult.rowCount > 0) {
    throw new Error(
      `Error converting users table's username field to citext,` +
      `duplicate usernames of different case found:\n${util.inspect(dupeResult.rows)}`
    );
  }

  await knex.schema.alterTable("users", table => {
    table.dropUnique("username");
  })

  await knex.raw(`
    CREATE UNIQUE INDEX users_username_lower_unique
    ON users (LOWER(username));
  `);

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw(`DROP INDEX IF EXISTS users_username_lower_unique`);
  await knex.schema.alterTable("users", table => {
    table.unique("username");
  });
};

