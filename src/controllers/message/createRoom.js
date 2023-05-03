const chatRooms = require('../../db/models/chatroomModel')
const { v4: uuidv4 } = require('uuid')

const createRoom = async (req, res, io) => {
  const { roomName, description, type } = req.body;
  const roomExists = await chatRooms.chatrooms.getChatrooms()

  if (roomExists.some(room => room.name === roomName)) {
    return res.status(400).send('Room already exists');
  }

  // Create new chat room
  const newRoom = await chatRooms.chatrooms.newChatRoom(roomName, description,type);

  // Notify all connected clients that a new room has been created
  io.emit('room-created', newRoom);

  console.log(newRoom)

  res.status(200).json({ id: newRoom[0].id });
};

module.exports = createRoom;