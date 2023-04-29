const message = require("../../db/models/message")
//socket.io controller
const sendMessage = async (msg, userId, room_id) => {
  if (!userId) return res.sendStatus(401);
  console.log(msg)
  const user = await message.insertMessage(msg.text, userId, room_id);
  return user
};

module.exports = sendMessage;