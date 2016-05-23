var fs = require("fs"),
    app = require("http").createServer(handler),
    io = require("socket.io").listen(app, {log: false}),
    theport = process.env.PORT || 2000,

    twitter = require("ntwitter");

var dotenv = null;
if(process.env.NODE_ENV === "production") {
  dotenv = require('dotenv');
  dotenv.load();
}
var keys = envKeys();

app.listen(theport);

function envKeys() {
  return {
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
  }
}

function handler(req, res) {
  fs.readFile(__dirname + "/index.html",
    function (err, data) {
      if(err) {
        res.writeHead(500);
        return res.end("Error loading index.html");
      }
      res.writeHead(200);
      res.end(data);
    });
}

io.sockets.on("connection", function(socket) {
  //This will run when the client is connected

  //Thisis a listener to the signal "something"
  socket.on("something", function(data) {

  })

  socket.emit("something else", {hello: "Hello, are you connected?"})
})

/**
* @var tw the Twitter Streaming API initalization
* @var stream When a stream is created this will be the only instance of it
* @var track The tracking words for the stream
* @var users An array of connected users to the application
*/

var tw = new twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token_key,
    access_token_secret: keys.access_token_secret
  }),
  stream = null,
  track = "venezuala",
  users = [];

// A listener for a client connection
io.sockets.on("connection", function(socket) {
  //The user should be added to the array if it doesn't exist
  if(user.indexOf(socket.id) === -1) {
    users.push(socket.id);
  }

  //log
  logConnectedUsers();

  socket.on("start stream", function() {
    if(stream === null) {
      tw.stream("statuses/filter", {
        track: track
      }, function(s) {
        stream = s;
        stream.on("data", function(data) {
          // Only broadcast when users are online
          if(users.length > 0) {
            socket.broadcast.emit("new tweet", data);
            socket.emit("new tweet", data);
          } else {
            // If there are no users connected we destroy the stream
            stream.destroy();
            stream = null;
          }
        })
      })
    }
  })
})

function logConnectedUsers() {
  console.log("=============== CONNECTED USERS ===================");
  console.log("== :: " + users.length);
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
}
