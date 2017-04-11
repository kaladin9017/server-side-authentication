const express = require('express');
const morgan = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const router = require('./router');
const app = express();
const mongoose = require('mongoose');


/*
  Setup DB
*/
mongoose.connect('mongodb://localhost:auth/auth');

/*
  App Setup
  configure middleware for server
  morgan for logging & bodyparser for json files
  add routes to express
*/
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);
/*
  Server Setup
  create port
  create http server that can handle request
  and forward on to expressapp
*/
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);
