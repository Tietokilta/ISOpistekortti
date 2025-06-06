/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('task_user', (table) => {
    table.string('status', 20)
      .notNullable()
      .defaultTo('not_done')
  }).then(() => { // Check that the status value is valid
    return knex.raw(`
      ALTER TABLE task_user
      ADD CONSTRAINT status_check
      CHECK (status IN ('not_done', 'requesting', 'done', 'rejected'));
    `)
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
    ALTER TABLE task_user
    DROP CONSTRAINT IF EXISTS status_check;
  `).then(() => {
    return knex.schema.table('task_user', (table) => {
      table.dropColumn('status');
    });
  });
};
