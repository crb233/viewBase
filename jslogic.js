function sendHastag(){
	
	var hashtag = document.getElementById("hashtag").value;
	
	var params = {
		"hashtag" : hashtag
	};
	
	var URL = "http://viewbase.azurewebsites.net/hash?hashtag=" + hashtag;
	
	$.ajax({
		type : "POST",
		url : URL, 
		contentType: "application/json; charset=utf-8",
		data: params,
		dataType: "json",
		success: function(msg){
			createMap(msg);
			},
		error: function (xhr, ajaxOptions, thrownError) {
			document.getElementById("map").innerHTML = "Error fetching " + URL;
		}
		
	});
}

function topTen(){
	var displayTopTen = document.getElementById("top");
	
	var URL = "http://viewbase.azurewebsites.net//top" 
	
	$.ajax({
		type: "GET",
		url: URL,
		contentType: "application/json; charset=utf-8",
		data: {},
		dataType: "jsonp",
		success: function(msg){
			var json = msg;
			document.getElementById("top").innerHTML = json; 
		},
		error: function (xhr, ajaxOptions, thrownError) {
			document.getElementById("top").innerHTML = "Error fetching " + URL;
		}
	});
}