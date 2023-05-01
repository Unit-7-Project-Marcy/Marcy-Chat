// const handleSessions = require('./middleware/handle-sessions');
require("dotenv").config()
const express = require('express');
const profilePic = require('./controllers/user/profilePicture')
const upload = require('./middleware/uploadProfile')
const path = require('path');
const handleCookieSessions = require('./middleware/handle-cookie-sessions');
const routes = require('./routes');
const logRoutes = require('./middleware/log-routes')
const addModels = require('./middleware/add-models');
const http = require('http');
const socketio = require('socket.io');
const { messageHistory } = require('./controllers/message');
const { sendMessage } = require('./controllers/message');
const { sendImage } = require('./controllers/message')
const {createRoom} = require('./controllers/message')
const {joinRoom} = require('./controllers/message')
const {listRoom} = require('./controllers/message')
const SocketIOFileUpload = require('socketio-file-upload');
const cors = require('cors');

const cookieParser = require('cookie-parser');

const socketsStatus = {};

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketio(server);

app.use(cookieParser());
app.use(addModels)
app.use(SocketIOFileUpload.router)

io.on('connection', (socket) => {

  const socketId = socket.id;
  socketsStatus[socket.id] = {};


  console.log("connect");

  socket.on("voice", function (data) {

    var newData = data.split(";");
    newData[0] = "data:audio/ogg;";
    newData = newData[0] + newData[1];

    for (const id in socketsStatus) {

      if (id != socketId && !socketsStatus[id].mute && socketsStatus[id].online)
        socket.broadcast.to(id).emit("send", newData);
    }

  });

  socket.on("userInformation", function (data) {
    socketsStatus[socketId] = data;

    io.sockets.emit("usersUpdate",socketsStatus);
  });


  socket.on("disconnect", function () {
    delete socketsStatus[socketId];
  });

  console.log('A user connected',socket);
  const cookies = socket.handshake.headers.cookie.split(';');
  let userId;

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');

    if (name === 'session') {
      const sessionData = JSON.parse(Buffer.from(value, 'base64').toString());
      userId = sessionData.userId;
      break;
    }
  }
  socket.on('room id', (roomId) => {
    socket.roomId = roomId;
  });
  socket.userId = userId;
  console.log(socket.userId)
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('joinRoom', (roomName, callback) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room ${roomName}`);
    callback(`You joined room ${roomName}`);
  });

 // Listen for file uploads
 const uploader = new SocketIOFileUpload();
 uploader.dir = './uploads';
 uploader.listen(socket);

 // Handle successful file uploads
 uploader.on('saved', async (event) => {
   // Save the file to your database using the appropriate driver
   console.log(event.file.pathName)
   const roomId = socket.roomId;

   const result = await sendImage(event.file.pathName,socket.userId,roomId)
   io.emit('image message',result)
   console.log(result)
 });

  socket.on('chat message', async (msg, id, type) => {
    console.log(`Received message: ${msg}`, id);
    io.emit('chat message', msg);

    const result = await sendMessage(msg, socket.userId, id, type);
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static('uploads'));
app.use(logRoutes);

app.use(handleCookieSessions);
app.use('/api', routes);

// Route for handling profile picture uploads
app.post('/api/upload-profile-picture', upload.single('profilePicture'), profilePic);



//SOCKET.IO FUNCTIONS/ROUTES
app.get('/api/message-history', (req,res) => {
    return messageHistory(req,res,io)
})

app.get('/chatrooms/:room_id', (req, res) => {
  return messageHistory(req,res,io);
});

app.get('/api/listRoom', (req,res) => {
  return listRoom(req,res)
})
app.post('/api/create-room', (req,res) => {
  return createRoom(req,res,io)
})

app.post('/api/joinRoom', (req,res) => {
  return joinRoom(req,res,io)
})


module.exports = server;