/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary(); // Auto-incrementing primary key
    table.string("username", 255).notNullable().unique();
    table.string("name", 255).notNullable();
    table.string("passwordHash", 255).notNullable(); // Hashed password storage
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("users");  
};
