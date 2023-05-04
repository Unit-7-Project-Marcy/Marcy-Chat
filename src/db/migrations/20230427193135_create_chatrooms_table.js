/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
    return knex.schema.createTable('chat_rooms', (table)=> {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.text('description').notNullable();
        table.specificType('users', 'TEXT[]').notNullable().defaultTo('{}');
        table.string('type').defaultTo('public')
        table.timestamps(true,true)
    })
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
    return knex.schema.dropTable('chat_rooms')
};
