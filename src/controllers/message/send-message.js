const Message = require("../../db/models/message");


const sendMessage = async (data, userId, roomId) => {
  if (!userId) return res.sendStatus(401);

  let type = "text";
  let message = data.text;

  const result = await Message.insertMessage(message, type, userId, roomId);
  return { ...result, type };
};

module.exports = sendMessage;