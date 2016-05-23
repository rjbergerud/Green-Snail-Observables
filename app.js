var fs = require("fs"),
    app = require("http").createServer(handler),
    io = require("socket.io").listen(app, {log: false}),
    theport = process.env.PORT || 2000;

app.listen(theport);

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
