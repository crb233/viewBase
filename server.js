var express = require('express');
var app = express();
// Lets Node serve files from the current directory.
app.use(express.static('./Public/'));

// Set Node to listen for incoming connections on port 80
app.listen(80,function(){
 console.log("Server Running");
});
