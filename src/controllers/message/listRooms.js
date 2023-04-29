const chatRooms = require('../../db/models/chatroomModel')

const listRooms = async (req, res) => {
    const result = await chatRooms.chatrooms.getChatrooms()
    res.send(result);
  };

  module.exports = listRooms