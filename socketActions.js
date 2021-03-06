var Rx = require("rxjs"),
    twitter = require ("twitter");


module.exports = function(io) {
  /**
  * @var tw the Twitter Streaming API initalization
  * @var stream When a stream is created this will be the only instance of it
  * @var track The tracking words for the stream
  * @var users An array of connected users to the application
  */
  var keys = envKeys();
  var tw = new twitter({
      consumer_key: keys.consumer_key,
      consumer_secret: keys.consumer_secret,
      access_token_key: keys.access_token_key,
      access_token_secret: keys.access_token_secret
    }),
    stream = null,
    track = "bubbles",
    users = [];


  // A listener for a client connection
  io.sockets.on("connection", function(socket) {
    //The user should be added to the array if it doesn't exist
    if(users.indexOf(socket.id) === -1) {
      users.push(socket.id);
    }
    logConnectedUsers(users);

    socket.on("disconnect", function (socket) {
      users.splice(users.indexOf(socket.id), 1);
      logConnectedUsers(users);
    })

    socket.emit("connected", {"Hiiiii": "hiiiii", tracking: track})

    socket.on("start stream", function() {
      console.log('stream started');
      if(stream === null) {
          tw.stream("statuses/filter", {
            track: track
          }, function(s) {
            stream = s;
            stream.on("data", function(tweet) {
              console.log('Stream recieved some tweet');
              // Only broadcast when users are online
              if(users.length > 0) {
                socket.broadcast.emit("new tweet", tweet);
                socket.emit("new tweet", tweet);
              } else {
                // If there are no users connected we destroy the stream
                stream.destroy();
                stream = null;
              }
            })

            stream.on('error', function(error) {
              console.log(error);
            })
          });
      }
    })
  });
}


//Private Functions
function logConnectedUsers(users) {
  console.log("=============== CONNECTED USERS ===================");
  console.log("== :: " + users.length);
  console.log("===================================================");
}

function envKeys() {
  return {
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
  }
}
