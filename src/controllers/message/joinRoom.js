const chatRooms = require('../../db/models/chatroomModel')

const joinRoom = async (req, res, io) => {
  const { roomId, userId } = req.body;

  // Add the user to the room in the database
  await chatRooms.chatrooms.addUserToRoom(roomId, userId);

  // Emit an event to all connected clients in the room
  io.in(roomId).emit('userJoined', userId);

  // Return a success message
  res.send('User joined the room');
};

  module.exports = joinRoom