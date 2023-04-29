const knex = require('../knex');

class message {
    static async getMessageHistory(roomId) {
        try {
          const messages = await knex.raw(`
          SELECT messages.messages, messages.time_created, users.username, users.id
          FROM messages
          JOIN users ON messages.user_id = users.id
          WHERE messages.room_id = ?
        `, [roomId]);
          return messages.rows;
          } catch (err) {
            console.error(err);
            return null;
          }
    }

    static async insertMessage(messages, userID, roomId) {
      try {
        const result = await knex("messages").insert({
          messages,
          user_id:userID,
          room_id:roomId,
          time_created: new Date(),
        });
        return result;
      } catch (err) {
        console.error(err);
        return null;
      }
    }
}

module.exports = message