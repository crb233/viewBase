function onLoad() {
	topTen();
	drawRegionsMap([['Country','Sentiment']]);
}

function sendHashtag() {
	var hashtag = document.getElementById("hashtag").value;
	
	var params = {
		"hashtag" : hashtag
	};
	
	var URL = "http://viewbase.azurewebsites.net/getSentimentMap?hashtag=" + hashtag;
	
	$.ajax({
		type : "POST",
		url : URL,
		contentType: "application/json; charset=utf-8",
		data: params,
		dataType: "json",
		success: function(json){
			var n = json.length;
			var list = "['Country', 'Sentiment'],";
			for(var i = 0; i < n; i++){
				list = list + "['" + json[i].location + "'," + json[i].sentiment + "],";
				console.log(json[i].location);
			}
			
			list = "[" + list + "]";
			drawRegionsMap(list);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			document.getElementById("map-error").innerHTML = "Error fetching " + URL;
		}
		
	});
}

function topTen(){
	var displayTopTen = document.getElementById("top");
	
	var URL = "http://viewbase.azurewebsites.net/getTopHashtags";
	
	$.ajax({
		type: "GET",
		url: URL,
		contentType: "application/json; charset=utf-8",
		data: {},
		dataType: "json",
		success: function(msg) {
			var topten = "<h2> Trending </h2><ul>";
			for (var i = 0; i < msg.length; i++) {
				topten += "<li>" + msg[i] + "</li>";
			}
			topten += "</ul>";
			
			document.getElementById("top").innerHTML = topten;
		},
		error: function (xhr, ajaxOptions, thrownError) {
			document.getElementById("top").innerHTML = "Error fetching " + URL;
		}
	});
}

google.charts.load('current', {'packages':['geochart']});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap(data) {
	dataMap = google.visualization.arrayToDataTable(data);
	
	var options = {
	  colorAxis: {colors: ['#00853f', 'white', '#e31b23']},
	  backgroundColor: 'black',
	  datalessRegionColor: 'white',
	  defaultColor: 'white',
	};
	
	var chart = new google.visualization.GeoChart(document.getElementById('geochart-colors'));
	chart.draw(dataMap, options);
}
