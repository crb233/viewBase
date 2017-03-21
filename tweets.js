
var querystring = require('querystring');
var request = require('request');



// twitter key and secret
var key = 'hBsfVt6He4rInmGJXGwTjxWUq';
var secret = 'HsXGxH25JZLXfKRR6ISp6aApWJgIctnJDjeV4qyoUVwI5pJnnO';

// twitter bearer
var bearer;
var valid_bearer = false;
var getting_new_bearer = false;

// queued requests
var request_queue = [];



// base 64 encode a string
function encodeBase64(str) {
	return new Buffer(str).toString('base64');
}

// get the bearer access token from Twitter
function getNewBearer() {
	if (valid_bearer || getting_new_bearer)
		return;
	getting_new_bearer = true;
	
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
		body = JSON.parse(body);
		
		// request failed
		if (err) {
			console.error(err);
			
		// request returned an error code
		} else if (res.statusCode !== 200) {
			console.error('Status code was not 200');
			console.error(res);
			
		// request returned the wrong token
		} else if (body.token_type !== 'bearer') {
			console.error('Key received was not \'bearer\'');
			console.error(body);
			
		// request succeeded
		} else {
			bearer = body.access_token;
			valid_bearer = true;
			getting_new_bearer = false;
			makeQueuedRequests();
		}
		
		// if the bearer still isn't valid, try again
		if (!valid_bearer) {
			getNewBearer();
		}
		
	});
}



function enqueueRequest(term, callback) {
	request_queue.push({
		'term' : term,
		'callback' : callback
	});
}

function makeQueuedRequests() {
	while (request_queue.length !== 0) {
		req = request_queue.pop();
		makeRquest(req.term, req.callback);
	}
}

function makeRquest(term, callback) {
	var host = 'https://api.twitter.com';
	var path = '/1.1/search/tweets.json?';
	var query = querystring.stringify({
		'q' : term,
		'result_type' : 'recent'
	});
	
	var options = {
		'method' : 'GET',
		'uri' : host + path + query,
		'headers' : {
			'Authorization' : 'Bearer ' + bearer,
			'Content-Type' : 'application/json;charset=UTF-8',
		}
	};
	
	request.get(options, function(err, res, body) {
		
		// TODO: if the bearer is invalid:
		// enqueueRequest(term, callback);
		// getNewBearer();
		
		if (err) {
			console.error(err);
			callback(true);
			
		} else if (res.statusCode !== 200) {
			console.error('Status code was not 200');
			console.error(res);
			callback(true);
			
		} else {
			callback(false, body);
		}
	});
}

function search(term, callback) {
	if (valid_bearer) {
		makeRquest(term, callback);
		
	} else {
		enqueueRequest(term, callback);
		getNewBearer();
	}
}



getNewBearer();
module.exports.search = search;
