/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
    return knex.schema.createTable('chat_room_users', (table) => {
        table.increments().primary();
        table.uuid('chat_room_id').references('id').inTable('chat_rooms');
        table.integer('user_id').unsigned().references('id').inTable('users');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
    return knex.schema.dropTable('chat_room_users');
};
