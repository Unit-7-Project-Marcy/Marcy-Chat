const friends = require('../../db/models/friends')

const friendsList = async (req, res) => {
    const {params: {user_id}} = req
    const friend = await friends.listFriends(user_id)
    res.status(200).send(friend)
  };
  
  module.exports = friendsList;