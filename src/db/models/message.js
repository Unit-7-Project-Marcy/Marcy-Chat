const knex = require('../knex');

class message {
    static async getMessageHistory(roomId) {
        try {
          const messages = await knex.raw(`
          SELECT messages.messages, messages.time_created, users.username, users.id, messages.type, users.profile_picture
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

    static async insertMessage(messages, type, userID, roomId) {
      try {
        const result = await knex("messages").insert({
          messages,
          user_id:userID,
          room_id:roomId,
          time_created: new Date(),
          type
        }).returning('*');
        return result;
      } catch (err) {
        console.error(err);
        return null;
      }
    }

    static async saveImage(messages, type, userID, roomId) {
      try {
        const result = await knex("messages").insert({
          messages,
          user_id:userID,
          room_id:roomId,
          time_created: new Date(),
          type
        }).returning('*');
        return result;
      } catch (err) {
        console.error(err);
        return null;
      }
    }
}

module.exports = message