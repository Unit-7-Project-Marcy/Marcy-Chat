require('dotenv').config();
const server = require('./server');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';



server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
