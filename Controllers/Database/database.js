var utils = require('util');
var EventEmitter = require('events').EventEmitter;

function Database(){
	EventEmitter.call(this);
}
utils.inherits(Database, EventEmitter);
module.exports = Database;

var mysql = require('mysql');
var connString = process.env.MYSQLCONNSTR_localdb || "d=viewBase;d=localhost;u=viewbase;p=viewbase"

connString = connString.split(";");
for( i=0; i < connString.length; i++){
	connString[i] = connString[i].split("=").pop();
}

var con = mysql.createConnection({
	host: connString[1],
	user: connString[2],
	password: connString[3],
	database: connString[0]
});

//connect to mysql
con.connect(function(err) {
	if (err) {
		console.log("Error connecting to database" + err);
	}
	else {
		console.log("Database successfully connected");
		tablecreate_query = "CREATE TABLE IF NOT EXISTS db(hashtag VARCHAR(50) key, jsonData TEXT, numSearches INT DEFAULT 1, lastCalculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"
		con.query(tablecreate_query);
	}
});

Database.prototype.incrementNumSearches = function(hashtag){
	var query = "UPDATE db SET numSearches = numSearches + 1 WHERE hashtag = '" + hashtag + "';";
	con.query(query);
}

Database.prototype.topSearches = function() {
	query = "SELECT hashtag FROM db ORDER BY numSearches DESC LIMIT 10;";
	self = this;
	con.query(query, function(err,rows,fields) {
		res = []
		for( i=0; i<rows.length; i++){
			res.push(rows[i].hashtag);
		}
		self.emit("topSearchResponse", res);
	});
}

Database.prototype.getCachedResult = function(hashtag){
	var query = "SELECT jsonData FROM db WHERE hashtag = '" + hashtag + "';";
	self = this;
	con.query(query, function(err,rows,fields) {
		if(rows.length == 0)	{
			self.emit("cacheResponse", null);
		}
		else {
			self.emit("cacheResponse", rows[0].jsonData);
		}
	});
}

Database.prototype.storeResult = function(hashtag, json){
	var query = "INSERT INTO db (hashtag, jsonData) VALUES ('" + hashtag + "', '" + json + "') ON DUPLICATE KEY UPDATE jsonData = '" + json + "', lastCalculated = now();";
	con.query(query);
}
