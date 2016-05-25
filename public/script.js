var _socket = null;
$(function() {
  var site = document.URL;
    if(io !== undefined) {
        // Here you create the connection with the server
        _socket = io.connect(site);
        // This will listen when the server emits the "connected" signal
        // informing to the client that the connection has been stablished
        _socket.on("connected", function(r) {
            $("head").find("title").html("Tracking now: " + r.tracking);
            $(".tracking").html(r.tracking);

            // Here the client tells the server to "start stream"
            emitMsj("start stream");
        });

        var tweetObs = Rx.Observable.create(function (observer) {
          _socket.on("new tweet", function(t) {
            console.log(t);
            observer.onNext(t);
          });
          _socket.on("error", function(e) {
            console.log(e);
            observer.onError(e);
          })

        });
        tweetObs.subscribe(
          function(t) {
          var pic = $('<img>').attr({src: t.user.profile_image_url})
                              .addClass('ui avatar');
          var tweetDiv = $('<div>').html(t.text)
                                    .addClass('ui card')
                                    .append(pic)

          $('#tweets').append(tweetDiv);
        },
        function(err) {
          console.log('Error: ' + err)
        }
      );
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
