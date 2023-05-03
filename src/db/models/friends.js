const knex = require('../knex');


class friends {
    static async friendsRequest(user_id,friend_id) {
        try {
            const query = `INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 'pending') RETURNING *`
            const friend = await knex.raw(query,[user_id,friend_id])
            return friend.rows;
          } catch (err) {
            console.error(err);
            return null;
          }
    }

}

module.exports = friends