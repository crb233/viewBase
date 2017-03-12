var express = require('express');
var app = express();
var port = process.env.port || 8080;
// Lets Node serve files from the current directory.
app.use(express.static('./Public/'));

// Set Node to listen for incoming connections on port 8080
app.listen(port,function(){
 console.log("Server Running");
});
