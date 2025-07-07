/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Trigger function for creating a task_user for each task whenever a new user is created
  await knex.raw(`
    CREATE OR REPLACE FUNCTION create_task_users_for_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO task_user (task_id, user_id)
      SELECT t.id, NEW.id FROM tasks t;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Same but for whenever a new task is created
  await knex.raw(`
    CREATE OR REPLACE FUNCTION create_task_users_for_new_task()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO task_user (task_id, user_id)
      SELECT NEW.id, u.id FROM users u;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)

  // Triggers to actually execute the above functions
  // for new users
  await knex.raw(`
    CREATE TRIGGER after_user_insert_create_task_users
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_task_users_for_new_user();
  `);

  // for new tasks
  await knex.raw(`
    CREATE TRIGGER after_task_insert_create_task_users
    AFTER INSERT ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION create_task_users_for_new_task();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw(`DROP TRIGGER IF EXISTS after_user_insert_create_task_users ON users`);
  await knex.raw(`DROP TRIGGER IF EXISTS after_task_insert_create_task_users ON tasks`);

  await knex.raw(`DROP FUNCTION IF EXISTS create_task_users_for_new_user`);
  await knex.raw(`DROP FUNCTION IF EXISTS create_task_users_for_new_task`);
};
