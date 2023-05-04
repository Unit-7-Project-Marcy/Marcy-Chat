const friends = require('../../db/models/friends')

const pendingList = async (req, res) => {
    const {params: {user_id}} = req
    const friend = await friends.listPending(user_id)
    res.status(200).send(friend)
  };
  
  module.exports = pendingList;