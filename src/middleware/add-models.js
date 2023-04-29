const User = require('../db/models/user');
const Message = require('../db/models/message');


const addModels = (req, res, next) => {
  req.db = {
    User,
    Message,
  };
  next();
};

module.exports = addModels;
