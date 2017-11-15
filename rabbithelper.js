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

/*
Concerned that it's going to keep opening new exchanges and queues...
how can i open it and keep using the same exchange without it getting killed
*/
exports.logToExchange = function(exchange, queue, msg){
	amqp.connect('amqp://localhost', function(err, conn) {
  	conn.createChannel(function(err, ch) {
	    ch.assertExchange(exchange, 'fanout', {durable: true});
	    ch.publish(exchange, queue, new Buffer(msg));
	    console.log(" [x] Sent %s", msg);
  	});
	});
}


exports.createExchange = function(exchange, exchType, queueName){
	amqp.connect('amqp://localhost', function(err, conn) {
	  conn.createChannel(function(err, ch) {
	    ch.assertExchange(exchange, exchType, {durable: true});
			ch.assertQueue(queueName, {exclusive: true}, function(err, q) {
				ch.bindQueue(q.queue, exchange, queueName);
				console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
				ch.consume(q.queue, function(msg){
						setTimeout(function() {
							console.log(" [x] %s", msg.content.toString());
							io.emit('chat message', msg.content.toString()); // Doesn't have access to io object here
							ch.ack(msg);
							}, 10000);

						}, {noAck: false});
			});
		});
	});
	// 	//

	//   //     console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
	//   //     ch.bindQueue(q.queue, exchange, queueName);
	// 	//
	// 	// 		ch.consume(q.queue, function(msg){
	// 	// 				console.log(" [x] %2", msg.content.toString());
	// 	// 				io.emit('chat message', msg.content.toString());
	// 	// 					setTimeout(function() {
	// 	// 							ch.ack(msg);
	// 	// 					}, 10000);
	// 	//
	// 	// 				}, {noAck: false});
	// 	// 		}
	// 	// 		// ch.consume(q.queue, function(msg) {
	// 	// 		// 	console.log(" [x] %s", msg.content.toString());
	// 	// 		// 	io.emit('chat message', msg.content.toString());
	// 	// 		// 	//Hold in queue for 10 seconds before ack
	// 	// 		// 	setTimeout(function() {
	// 	// 		// 			ch.ack(msg);
	// 	// 		// 	}, 10000);
	// 	// 		//
	// 	// 		// }, {noAck: false});
	//   //   });
	//   });
	};

/*
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'logs';
    var msg = process.argv.slice(2).join(' ') || 'Hello World!';

    ch.assertExchange(ex, 'fanout', {durable: false});
    ch.publish(ex, '', new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
*/
