var _socket = null;
$(function() {
  if(io !== undefined) {
    var tweetObs = startStream();
    tweetObs.subscribe(displayTweet, logError);

    //Defer
    var interval = Rx.Observable.interval(1000);
    // interval.subscribe(x => console.log(x));

    //Empty/Never/Throw

    //From

  }
});

// @param Parent is jquery element
function StreamElement(parent, operatorName) {
  var segment = $('<div>').addClass('ui segment ' + operatorName)
  var header  = $('<div>').addClass('ui header').html(operatorName)
  var grid    = $('<div>').addClass('ui raised segments columns very relaxed grid').attr('id', operatorName)

  segment.append(header).append(grid);
  parent.append(segment);
  this.grid = $('#' + operatorName);

  this.addNext = function (text) {
    var pointer = $('<div>').addClass('ui vertical divider')
    var column = $('<div>').addClass('ui segment column')
                            .html(text)
                            .append($('<i>').addClass('long arrow right icon'))
    console.log(column);
    console.log(this.grid.html());
    this.grid.append(column);
  }
}

function startStream() {
    // Here you create the connection with the server
    _socket = io.connect(document.URL);
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
        observer.onNext(t);
      });
      _socket.on("error", function(e) {
        observer.onError(e);
      })
    });

    return tweetObs;
}

function displayTweet(t) {
    var pic = $('<img>').attr({src: t.user.profile_image_url})
                        .addClass('ui avatar');
    var tweetDiv = $('<div>').html(t.text)
                              .addClass('ui card')
                              .append(pic)
    $('#tweets').append(tweetDiv);
}

function logError(err) {
  console.log("Error:" + err)
}


function emitMsj(signal, o) {
    if(_socket) {
        _socket.emit(signal, o);
    }
    else {
        alert("Shit! Socket.io didn't start!");
    }
}
