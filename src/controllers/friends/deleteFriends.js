const friends = require('../../db/models/friends')

const deleteFriends = async (req, res) => {
    const {body: {user_id}, params: {id}} = req
    const friend = await friends.deleteFriend(user_id, id)
    res.status(200).send(friend)
  };
  
  module.exports = deleteFriends;