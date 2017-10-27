var amqp = require('amqplib/callback_api');

//Write to specific queue
exports.logToQueue = function(q,msg){
	amqp.connect('amqp://localhost', function(err, conn) {
  	conn.createChannel(function(err, ch) {
	    ch.assertQueue(q, {durable: false});
	    ch.sendToQueue(q, new Buffer(msg));
	    console.log(" [x] Sent %s", msg);
  	});
	});
}

exports.logToExchange = function(exchange, queue, msg){
	amqp.connect('amqp://localhost', function(err, conn) {
  	conn.createChannel(function(err, ch) {
	    ch.assertExchange(exchange, 'fanout', {durable: false});
	    ch.publish(exchange, queue, new Buffer(msg));
	    console.log(" [x] Sent %s", msg);
  	});
	});
}
