var amqp = require('amqplib/callback_api');

/*
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'goodbye';
    var msg = 'Goodbye World!';

    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
*/
exports.logMessage = function(res,q,msg){
	
	amqp.connect('amqp://localhost', function(err, conn) {
  	conn.createChannel(function(err, ch) {
	    ch.assertQueue(q, {durable: false});
	    // Note: on Node 6 Buffer.from(msg) should be used
	    ch.sendToQueue(q, new Buffer(msg));
	    console.log(" [x] Sent %s", msg);
	    //res.write("Sent %s", msg);
  	});
  	
  	//setTimeout(function() { conn.close(); process.exit(0) }, 500);
	});
	
	//res.write("test");
}



