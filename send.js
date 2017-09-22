var http = require('http');
var fs = require('fs');
var util = require('util');
var formidable = require("formidable");
var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        processForm(req, res);
    }

});

function displayForm(res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function processForm(req, res) {
	//Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = [];
    var form = new formidable.IncomingForm();

    res.write("<p>Logging your message...");

    form.on('field', function (field, value) {
        //console.log(field);
        fields[field] = value;
        //res.write("<p>Field: " + field + " Value " + value);
    });
        
    var rabbit = require("./rabbithelper.js");
    
    form.on('end', function () {
	    //console.log(res + fields["msgqueue"] + fields["data"]);
	    rabbit.logMessage(res, fields["msgqueue"],fields["data"]);
    });
    form.parse(req);
    res.write("<script>window.location.href='.'</script>");
    res.end();
}

server.listen(8081);

console.log("server listening on 8081");

