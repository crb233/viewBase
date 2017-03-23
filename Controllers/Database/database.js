var http = require('http');
var express = require('express');
//creating an express app
var app = express();

var mysql = require('mysql');
var con = mysql.createConnection({
	host: 'localhost',
	user: 'klimd',
	password: 'huskiesrule',
	database: 'viewBase'
});

//connect to mysql
con.connect(function(err) {
	if (err) {
		console.log("Error connecting to database");
	}
	else {
		console.log("Database successfully connected");
	}
});

function incrementNumSearches(hashtag){

	var query = "UPDATE db SET numSearches = numSearches + 1 WHERE hashtag = " + hashtag + ";";
	con.query(query);
}

function topSearches() {
	con.query("SELECT TOP(10) hashtag FROM db ORDER BY numSearches DESC");
}

function getCachedResult( hashtag){
	var query = "SELECT jsonData FROM db WHERE hashtag = " + hashtag + ";";
	con.query(query, function(err,rows,fields) {
		if(!fields)	{
			return null;
		}
		else {
			return rows[0]["jsonData"];
		}
	});
}

function storeResult(hashtag, json){
	var query = "UPDAT " + hashtag + ";";
}