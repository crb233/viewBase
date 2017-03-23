var utils = require('util');
var EventEmitter = require('events').EventEmitter;

function Tweets(){
	EventEmitter.call(this);
}
utils.inherits(Tweets, EventEmitter);

// Gets tweets pertaining to a particular hashtag, with location data
Tweets.prototype.getTweets = function(hashtag){
  res = [{location: "WA", tweet:"It's so beautiful outside."}, {location: "WA", tweet:"It's so awful outside."}, {location: "PA", tweet:"I despise winter, and snow."}]
  this.emit("tweetsResponse", res);
}

module.exports = Tweets;
