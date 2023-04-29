const messageHistory = async (req, res, io) => {
  const { session, db: { Message } } = req;
  if (!session.userId) return res.sendStatus(401);

  // socket.io logic here
  const { room_id } = req.query;
  const messages = await Message.getMessageHistory(room_id);
  io.emit('message history', messages);

  res.send({response:messages});
};

module.exports = messageHistory;