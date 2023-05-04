/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
    return knex.schema.createTable('friends', (table) => {
        table.integer('user_id').unsigned().references('id').inTable('users');    
        table.integer('friend_id').references('id').inTable('users');
        table.unique(['user_id', 'friend_id']);
        table.string('status')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
    return knex.schema.dropTable('friends')
};
