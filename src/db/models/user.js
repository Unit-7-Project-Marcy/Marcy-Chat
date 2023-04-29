const knex = require('../knex');
const { hashPassword, isValidPassword } = require('../../utils/auth-utils');

class User {
  #passwordHash = null;

  constructor({ id, username, password_hash, profile_picture}) {
    this.id = id;
    this.username = username;
    this.#passwordHash = password_hash;
    this.profile_picture = profile_picture;
  }

  static async list() {
    const query = 'SELECT * FROM users';
    const { rows } = await knex.raw(query);
    return rows.map((user) => new User(user));
  }

  static async find(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const { rows: [user] } = await knex.raw(query, [id]);
    console.log(user)
    return user ? new User(user) : null;
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const { rows: [user] } = await knex.raw(query, [username]);
    return user ? new User(user) : null;
  }

  static async create(username, password) {
    const passwordHash = await hashPassword(password);

    const query = `INSERT INTO users (username, password_hash)
      VALUES (?, ?) RETURNING *`;
    const { rows: [user] } = await knex.raw(query, [username, passwordHash]);
    return new User(user);
  }

  static async deleteAll() {
    return knex.raw('TRUNCATE users;');
  }

  static async updateProfilePicture(userId,filePath) {
    try {
      const result = await knex('users')
      .where({ id: userId })
      .update({ profile_picture: filePath })
      .returning('*');
      this.profilePic = filePath
      return result
    }catch (err) {
      console.error(err)
      return null
    }
  }

  static async findProfilePicture(userId) {
    try{
      const result = knex('users').select('profile_picture').where('id',userId)
      return result
    }catch(err) {
      console.error(err)
      return null
    }
  }

  update = async (username) => { // dynamic queries are easier if you add more properties
    const [updatedUser] = await knex('users')
      .where({ id: this.id })
      .update({ username })
      .returning('*');
    return updatedUser ? new User(updatedUser) : null;
  };

  isValidPassword = async (password) => (
    isValidPassword(password, this.#passwordHash)
  );
}

module.exports = User;
