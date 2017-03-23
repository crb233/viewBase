var express = require('express');
var app = express();
var port = process.env.port || 8080;

// Lets Node serve files from the Public directory
app.use(express.static(__dirname + '/Public/'));

// Set Node to listen for incoming connections on port 8080
app.listen(port,function(){
	console.log("Server Running");
});

var TweetController = require("./Controllers/Tweets/tweets");
var tc = new TweetController();
var SentimentController = require("./Controllers/Sentiment/Sentiment");
var sc = new SentimentController();

app.get("/getSentimentMap", function(req,res){
  tc.once("tweetsResponse", function(tweets){
    sc.getTweetSentiments(tweets);
  });
  sc.once("sentimentResponse", function(result){
    res.status(200).send(result);
  });
  tc.getTweets(req.query.hashtag);
});
