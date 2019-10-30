const express = require('express');
const server = express();

//custom middleware

function logger(req, res, next) {
  console.log(` [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next();
};

server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

module.exports = server;
