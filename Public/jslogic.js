function onLoad() {
	topTen();
	drawRegionsMap([['Country','Sentiment']]);

	$('#hashtag').keypress(function(event) {
		if (event.which == 13) {
			$('#submit').click();
		}
	});
}

function sendHashtag() {
	var URL = "http://viewbase.azurewebsites.net/getSentimentMap?";
	URL +=  $("#hashtag").val();

	$.ajax({
		type : "GET",
		url : URL,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(json){
			var list = [[{label: 'Country', type: 'string'}, {label: 'Sentiment', type: 'number'}]];
			for(var i = 0; i < json.length; i++){
				list.push([json[i].location, json[i].sentiment]);
			}
			drawRegionsMap(list);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			document.getElementById("map-error").innerHTML = "Error fetching " + URL + '\n' + thrownError;
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
