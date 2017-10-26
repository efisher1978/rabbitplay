var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  //res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname +  '/html/reader.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('chat message', "A user has connected!");
  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('chat message', "A user has disconnected!");
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
  socket.on('chat message', function(msg){
  io.emit('chat message', msg);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
