var express = require('express');
var tweets = require(__dirname + '/tweets.js');



var app = express();

// serve public pages
app.use(express.static(__dirname + '/Public'));

// run test endpoint
app.all('/run', function(req, res) {
	tweets.search(req.query.term, function(err, obj) {
		if (err) {
			res.writeHead(400);
			res.send('Error: Could not compete request');
		} else {
			res.send(obj);
		}
	});
});

// start the server
app.listen(8080, function() {
	console.log('Server running');
});
