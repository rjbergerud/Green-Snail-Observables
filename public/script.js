var _socket = null;
$(function() {
  if(io !== undefined) {
    var tweetObs = startStream();
    tweetObs.subscribe(displayTweet, logError);

    //Empty/Never/Throw

    //From
    { let arr = [1,3,5,7,9,11];
      let source = Rx.Observable.from(arr);
      let printSource = source.flatMap(num => [num]);
      print('from', printSource)}

    // //From Callback
    // var callbackPrint = print('fromCallback');
    // var getJSON = Rx.Observable.fromCallback($.getJSON, undefined, function(x,y) {return x.results[0].name.first;})
    // var callbackSource = getJSON('https://randomuser.me/api/')
    // callbackSource.subscribe((user) => callbackPrint.addNext(user))
    //
    // //Defer
    // var deferPrint = print('Defer');
    // var source = Rx.Observable.defer(callbackSource);

  }
});


//@param operatorName is the operator name
//@param source is a stream of jquery-wrapped elements to append
function print(operatorName, source) {
   var display = new StreamElement($('#operators'), operatorName);
   source.subscribe((x) => display.addNext(x));
}

// @param Parent is jquery element
function StreamElement(parent, operatorName) {
  var segment = $('<div>').addClass('ui segment ' + operatorName)
  var header  = $('<div>').addClass('ui header').html(operatorName)
  var grid    = $('<div>').addClass('ui raised segments columns relaxed grid olive').attr('id', operatorName)

  segment.append(header).append(grid);
  parent.append(segment);
  this.grid = $('#' + operatorName);

  this.addNext = function (jElement) {
    var column = $('<div>').addClass('ui segment column')
                            .append(jElement)
                            .append($('<i>').addClass('long arrow right icon'))
    this.grid.append(column);
  }
}

function startStream() {
    // Here you create the connection with the server
    _socket = io.connect(document.URL);
    // This will listen when the server emits the "connected" signal
    // informing to the client that the connection has been stablished
    console.log('stream should start')
    _socket.on("connected", function(r) {
      console.log('connected!!!')
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
