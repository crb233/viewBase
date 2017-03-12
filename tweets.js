
var querystring = require('querystring');
var request = require('request');



// twitter key and secret
var key = 'hBsfVt6He4rInmGJXGwTjxWUq';
var secret = 'HsXGxH25JZLXfKRR6ISp6aApWJgIctnJDjeV4qyoUVwI5pJnnO';



// base 64 encode a string
function encodeBase64(str) {
	return new Buffer(str).toString('base64');
}

// get the bearer access token from Twitter
function getBearerToken(callback) {
	var auth = encodeBase64(key + ':' + secret);
	var body = 'grant_type=client_credentials';
	
	var options = {
		'method' : 'POST',
		'uri' : 'https://api.twitter.com/oauth2/token',
		'headers' : {
			'Authorization' : 'Basic ' + auth,
			'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8',
			'Content-Length' : body.length
		},
		'body' : body
	};
	
	request(options, function(err, res, body) {
		if (err) {
			console.error(err);
			callback(True);
			
		} else if (res.statusCode != 200) {
			console.error(res);
			callback(True);
			
		} else if (body.token_type != 'bearer') {
			console.error('Key received was not \'bearer\'');
			callback(True);
			
		} else {
			callback(False, body.access_token);
		}
	});
}

function makeTestRquest(bearer) {
	var host = 'https://api.twitter.com';
	var path = '/1.1/search/tweets.json';
	
	var options = {
		'method' : 'GET',
		'uri' : host + path,
		'headers' : {
			'Authorization' : 'Bearer ' + bearer,
			'Content-Type' : 'application/json;charset=UTF-8',
		}
	};
	
	request.get(options, function(err, res, body) {});
}

getBearerToken(makeTestRquest);
