/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('task_user', (table) => {
    table.string('status', 20)
      .notNullable()
      .defaultTo('not done')
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
  return knex.schema.table('task_user', (table) => {
    table.dropColumn('status');
  }).then(() => { // Remove the constraint as well
      return knex.raw(`
        ALTER TABLE status
        DROP CONSTRAINT IF EXISTS status_check;
      `)
  });
};
