var _socket = null;
$(function() {
  var prodServer = "http://dry-reaches-66607.herokuapp.com:80/";
  var localServer = "http://localhost:2000"
    if(io !== undefined) {
        // Here you create the connection with the server
        _socket = io.connect(localServer);

        // This will listen to the "new tweet" signal everytime
        // there's a new tweet incoming into the stream
        _socket.on("new tweet", function(tweet) {
            // handle tweet object
        });

        // This will listen when the server emits the "connected" signal
        // informing to the client that the connection has been stablished
        _socket.on("connected", function(r) {
            console.log(r);
            $("head").find("title").html("Tracking now: " + r.tracking);
            $(".tracking").html(r.tracking);

            // Here the client tells the server to "start stream"
            emitMsj("start stream");
        });

        _socket.on("new tweet", function(t) {
          console.log(t);
          var pic = $('<img>').attr({src: t.user.profile_image_url})
                              .addClass('ui avatar');
          var tweetDiv = $('<div>').html(t.text)
                                    .addClass('ui card')
                                    .append(pic)

          $('#tweets').append(tweetDiv);
        });
    }
});
function emitMsj(signal, o) {
    if(_socket) {
        _socket.emit(signal, o);
    }
    else {
        alert("Shit! Socket.io didn't start!");
    }
}
