var fs = require("fs"),
    express= require('express'),
    app = express(),
    http = require("http").Server(app);
    var io = require('socket.io')(http),
    thePort = process.env.PORT || 2000,
    Rx = require("rxjs"),
    runSockets = require('./socketActions.js');

if(process.env.NODE_ENV != "production") {
  var dotenv = require('dotenv');
  dotenv.load();
}

var keys = envKeys();

app.get('/', function(req, res) {
  res.sendfile('./index.html');
});

app.use(express.static('public'));

http.listen(thePort, function() {
  console.log('Listening on ' + thePort)
});

function envKeys() {
  return {
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
  }
}
