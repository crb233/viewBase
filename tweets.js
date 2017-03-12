
var querystring = require('querystring');
var request = require('request');



var key = 'hBsfVt6He4rInmGJXGwTjxWUq';
var secret = 'HsXGxH25JZLXfKRR6ISp6aApWJgIctnJDjeV4qyoUVwI5pJnnO';



function encodeBase64(str) {
	return new Buffer(str).toString('base64');
}

function decodeBase64(str) {
	return new Buffer(str, 'base64').toString('ascii');
}



function getAccessToken() {
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
			return False;
			
		} else if (res.statusCode != 200) {
			console.error(res);
			return False;
			
		} else if (body.token_type != 'bearer') {
			console.error('Key received was not \'bearer\'');
			return False;
			
		} else {
			return body.access_token;
		}
	});
}

getAccessToken();
