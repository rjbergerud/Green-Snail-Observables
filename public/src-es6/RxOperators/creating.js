export function creating() {
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
}
