const util = require("util");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const dupeQuery = `
    SELECT lower(username) AS canonical,
           array_agg(id ORDER BY id) AS ids,
           count(*) AS count
    FROM users
    GROUP BY canonical
    HAVING count(*) > 1;
  `;

  // Check for already existing duplicate usernames before disallowing duplicates
  const dupeResult = await knex.raw(dupeQuery);

  if (dupeResult.rowCount > 0) {
    throw new Error(
      `Error converting users table's username field to citext,` +
      `duplicate usernames of different case found: ${util.inspect(dupeResult.rows)}`
    );
  }

  await knex.raw(`CREATE EXTENSION IF NOT EXISTS citext;`);
  await knex.raw(`ALTER TABLE users ALTER COLUMN username TYPE citext USING username::citext;`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw(`ALTER TABLE users ALTER COLUMN username TYPE varchar(255) USING username::varchar(255);`);
  await knex.raw(`DROP EXTENSION IF EXISTS citext`);
};
