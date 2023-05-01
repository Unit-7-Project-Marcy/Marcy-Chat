const Message = require("../../db/models/message");


const sendImage = async (filepath, userId, roomId) => {
  if (!userId) return res.sendStatus(401);

  let type = "image";
  let message = filepath;

  const result = await Message.insertMessage(message, type, userId, roomId);
  return { ...result, type };
};

module.exports = sendImage;