var _socket = null;
$(function() {
  if(io !== undefined) {
    var tweetObs = startStream();
    tweetObs.subscribe(displayTweet, logError);


    /****************************/
    /* Creating Observables */
    /****************************/
    //Empty/Never/Throw

    //From
    {
      let arr = [1,3,5,7,9,11];
      let source = Rx.Observable.from(arr);
      let printSource = source.flatMap(num => [num]);
      print('from', 'creating', printSource)
    }

    //Just
    {
      let arr = [1,3,5,7,9,11];
      let source = Rx.Observable.just(arr);
      let printSource = source.flatMap(num => [num.toString()]);
      print('just', 'creating', printSource)
    }

    // //From Callback
    {
      let getJSON = Rx.Observable.fromCallback($.getJSON, undefined, function(x,y) {
        return x;
      });
      let source = getJSON('https://randomuser.me/api/');
      let printSource = source.flatMap(x => [x.results[0].name.first]);
      print('fromCallback', 'creating', printSource);
    }

    //Defer
    {
      let getJSON = Rx.Observable.fromCallback($.getJSON, undefined, function(x,y) {
        return x;
      });
      let deferredSource = Rx.Observable.defer(function() {return getJSON('https://randomuser.me/api/')});
      let printSource = deferredSource.flatMap(x => [x.results[0].name.first]);
      print('deferredSource-1', 'creating', printSource);
      print('defferedSource-2', 'creating', printSource);
    }

    //Interval
    {
      let source = Rx.Observable.interval(1000).take(27);
      print('Interval','creating', source);
    }

    //Interval
    {
      let n = 10, m = 5;
      let source = Rx.Observable.range(n,m);
      source.subscribe(x=> console.log(x))
      print(`range-${n}-${m + n}`, 'creating', source);
    }

    //Repeat
    {
      let source = Rx.Observable.repeat(7)
                                .take(7);
      print('Repeat', 'creating', source);
    }

    //Start
    {
      let source = null;
      //print('Start', 'creating');
    }

    //Timer
    {
      let source = null;
      //print('Timer', 'creating');
    }

    /****************************/
    /* Transforming Observables */
    /****************************/

    //Buffer

  }
});


//@param operatorName is the operator name
//@param source is a stream of jquery-wrapped elements to append
function print(operatorName, operatorType, source) {
   var display = new StreamElement($(`#${operatorType}`), operatorName, operatorType);
   source.subscribe(
     (x) => display.addNext(x),
     (e) => display.addNext(e),
     () => display.addLast('Completed')
   );
}

// @param Parent is jquery element
function StreamElement(parent, operatorName) {
  var segment = $('<div>').addClass('ui segment ' + operatorName)
  var header  = $('<div>').addClass('ui header').html(operatorName)
  var grid    = $('<div>').addClass('ui raised segments columns relaxed grid olive').attr('id', operatorName)

  segment.append(header).append(grid);
  parent.append(segment);
  this.grid = $('#' + operatorName);

  this.addNext = function (element) {
    var next = $('<div>').addClass('ui segment column')
                            .append(element)
    var pointer = $('<div>').addClass("ui column segment")
                                .append($('<i>').addClass('long arrow right icon'))
    this.grid.append(next);
    this.grid.append(pointer);
  }

  this.addLast = function() {
    var doneDiv = $('<div>').addClass('ui segment column')
                            .append('Completed')
    this.grid.append(doneDiv);
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
