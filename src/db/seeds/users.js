const User = require('../models/user');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await User.create('cool_cat', 'password1');
  await User.create('l33t-guy', 'password1');
  await User.create('cool-kid', 'password1');
  await User.create('lady-boy', 'password1');
};
