/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  // Create tasks table
  return knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary();
    table.string("title", 255).notNullable();
    table.text("description");
  })
  .then(() => {
    // Create task_user table to represent which users have completed which tasks
    return knex.schema.createTable("task_user", (table) => {
      table.increments("id").primary();
      table.integer("task_id").unsigned().references("id").inTable("tasks").onDelete("CASCADE");
      table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
      // Ensures that each user can only be linked to a task once
      table.unique(["task_id", "user_id"]);
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("task_user") // Drop the junction table first
    .then(() => {
      return knex.schema.dropTableIfExists("tasks"); // Then drop the tasks table
    });
};
