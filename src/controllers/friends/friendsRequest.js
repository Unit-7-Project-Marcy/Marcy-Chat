const friends = require('../../db/models/friends')

const friendRequest = async (req, res) => {
    const {body: {user_id}, params: {id}} = req
    console.log(user_id)
    const friend = await friends.friendsRequest(user_id,id)
    console.log(friend)
    res.status(200).send(friend)
  };
  
  module.exports = friendRequest;