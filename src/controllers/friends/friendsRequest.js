const friends = require('../../db/models/friends')

const friendRequest = async (req, res) => {
    const {body: {user_id}, params: {id}} = req
    console.log(id)
    const friend = friends.friendsRequest(user_id,id)
    res.status(200).send(friend)
  };
  
  module.exports = friendRequest;