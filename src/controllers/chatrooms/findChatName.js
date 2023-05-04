const chatRooms = require('../../db/models/chatroomModel')

const findRoom = async (req, res) => {
  const { id } = req.params;

  const foundRoom = await chatRooms.chatrooms.getChatroomName(id)

  console.log(foundRoom)

  res.status(200).send(foundRoom);
};

module.exports = findRoom;