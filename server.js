const express = require('express');
const helmet = require('helmet');
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');
const server = express();

server.use(helmet());
server.use(express.json());
server.use(logger);
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);
//custom middleware

function logger(req, res, next) {
  console.log(` [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next();
};

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

module.exports = server;
