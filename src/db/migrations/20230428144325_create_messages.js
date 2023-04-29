/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
    return knex.schema.createTable('messages', (table)=> {
        table.increments().primary();
        table.string('messages').notNullable();
        table.uuid('room_id').references('id').inTable('chat_rooms');
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.date('time_created')
      })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
    return knex.schema.dropTable('messages')
};
