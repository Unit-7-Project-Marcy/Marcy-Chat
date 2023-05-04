const express = require('express');
const userController = require('./controllers/user');
const addModels = require('./middleware/add-models');
const checkAuthentication = require('./middleware/check-authentication');


// Import the message controller
const chatRoomContoller = require('./controllers/chatrooms');
const friendsController = require('./controllers/friends')


const Router = express.Router();
Router.use(addModels);


Router.get('/users', userController.list);
Router.post('/users', userController.create);
Router.get('/users/:id', userController.show);
// We can use middleware slotted in between the route and the controller as well
Router.get('/pictures', userController.findProfilePicture)
Router.patch('/users/:id', checkAuthentication, userController.update);
Router.post('/users/login', userController.login);
Router.delete('/users/logout', userController.logout);
Router.get('/me', userController.showMe);
Router.get('/find', userController.findByUsername)
Router.get('/show', userController.show)

//friends
Router.get('/:user_id/getFriends',friendsController.friendsList)
Router.post('/friendRequest/:id',friendsController.friendsRequest)
Router.post('/responseFriendRequest/:id',friendsController.respondFriendRequest)
Router.post('/friendshipStatus/:id',friendsController.friendsStatus)


Router.get('/logged-in-secret', checkAuthentication, (req, res) => {
  res.send({ msg: 'The secret is: there is no secret.' });
});

Router.get('/findRoom/:id', chatRoomContoller.findRoom)





module.exports = Router;
