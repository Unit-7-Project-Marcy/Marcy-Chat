const friendsList = require('./friendsList')
const friendsRequest = require('./friendsRequest')
const friendsStatus = require('./friendsStatus')
const respondFriendRequest = require('./respondFriendRequest')
const pendingList = require('./pendingList')
const deleteFriend = require('./deleteFriends')

module.exports = {
    friendsList,
    friendsRequest,
    friendsStatus,
    respondFriendRequest,
    pendingList,
    deleteFriend
}