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
			var n = msg.length;
			var list = "['Country', 'Sentiment'],";
			for(int i = 0; i < n; i++){
				list = list + "['" + msg[i].location + "'," + msg[i].sentiment + "],";
			}
			
			list = "[" + list + "]";
			drawRegionsMap(list);
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
			var topten = "<h2> Trending </h2><ul>";
			var n = msg.length;
			for(int i = 0; i < n; i++){
				topten = topten + "<li>" + msg[i] + "</li>";
			}
			
			topten = topten + "</ul>";
			
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
	var data = google.visualization.arrayToDataTable(data);

	var options = {
	  colorAxis: {colors: ['#00853f', 'white', '#e31b23']},
	  backgroundColor: 'black',
	  datalessRegionColor: 'white',
	  defaultColor: 'white',
	};

	var chart = new google.visualization.GeoChart(document.getElementById('geochart-colors'));
	chart.draw(data, options);
};
