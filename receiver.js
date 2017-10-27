var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var amqp = require('amqplib/callback_api');

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
    io.emit('chat message', msg);
  });
});

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      io.emit('chat message', msg.content.toString());
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
