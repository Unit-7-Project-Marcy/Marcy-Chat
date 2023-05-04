const friends = require('../../db/models/friends')

const respondToFriendRequest = async (req, res) => {
    const {body: {user_id, status}, params: {id}} = req
    const friend = await friends.respondToFriendRequest(user_id,id, status)
    res.status(200).send(friend)
  };
  
  module.exports = respondToFriendRequest;