const friends = require('../../db/models/friends')

const friendshipStatus = async (req, res) => {
    const {body: {user_id}, params: {id}} = req
    console.log(user_id)
    const friend = await friends.friendshipStatus(user_id,id)
    console.log(friend)
    res.status(200).send(friend)
  };
  
  module.exports = friendshipStatus;