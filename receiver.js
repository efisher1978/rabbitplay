var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var amqp = require('amqplib/callback_api');
var queue;
var exchange = 'logs2';

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    ch.assertExchange(exchange, 'fanout', {durable: true});
    ch.assertQueue('', {exclusive: true}, function(err, q) {
      ch.bindQueue(q.queue, exchange, '');
      queue = q.queue;
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        ch.consume(queue, function(msg){
      		console.log(" [x] Received Message: %s", msg.content.toString());
          io.emit('chat received', msg.content.toString());
          ch.ack(msg);
        } , {noAck: false});
    });
  });
});

app.get('/', function(req, res){
  res.sendFile(__dirname +  '/html/reader.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('chat message', "A user has connected!");

 socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('chat message', "A user has disconnected!");
  });

  socket.on('chat submit', function(msg){
    console.log('message: ' + msg);

    amqp.connect('amqp://localhost', function(err, conn) {
    	conn.createChannel(function(err, ch) {
  	    ch.assertExchange(exchange, 'fanout', {durable: true});
  	    ch.publish(exchange, queue, new Buffer(msg));
  	    console.log(" [x] Sent message: %s", msg);
    	});
  	});
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
