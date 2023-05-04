const knex = require('../knex');
const { v4: uuidv4 } = require('uuid')

const chatRooms = []

class chatrooms {
    static async getChatrooms() {
        try {
            const rooms = await knex("chat_rooms").select();
            return rooms;
          } catch (err) {
            console.error(err);
            return null;
          }
    }

    static async getChatroomName(id) {
      try {
          const rooms = await knex("chat_rooms").select().where('id',id);
          return rooms;
        } catch (err) {
          console.error(err);
          return null;
        }
  }

    static async newChatRoom(name,description,type) {
        try {
            const roomId = uuidv4();
          const result = await knex("chat_rooms").insert({
            id: roomId,
            name, 
            description, 
            users: [],
            type,
          }).returning('*');
          return result;
        } catch (err) {
          console.error(err);
          return null;
        }
      }

      static async addUserToRoom(roomId, userId) {
        try {
          const result = await knex('chat_rooms')
            .where({ id: roomId })
            .update({
              users: knex.raw('array_append(users, ?)', [userId])
            })
            .returning('*');
          console.log(result[0])
          return result[0];
        } catch (err) {
          console.error(err);
          return null;
        }
      }
}

module.exports = {
    chatRooms,
    chatrooms
}