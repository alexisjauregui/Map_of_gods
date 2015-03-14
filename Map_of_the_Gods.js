// Width and height
var width = document.getElementById('container').offsetWidth-60,
    height = 600;

var projection = d3.geo.mercator()
    .scale((width) / 2 / Math.PI)
    .translate([width / 2, height / 2])
    ;//.precision(.1);
    
// Set up path
var path = d3.geo.path()
   	.projection(projection);


var zoom = d3.behavior.zoom().scaleExtent([1,8]).on("zoom", zoomed);
// Set up svg
var svg = d3.select("#container")
	.append("svg")
	.attr("width", width+500)
	.attr("height", height)
    .append("g");


var g = svg.append("g");

var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 2);
                       



svg.call(zoom).call(zoom.event);
// Parse data
// "countries.csv" should contain the names of countries and the
// 		colors you would like them to be. I used words like blue
//		and orange, but you can also use hex valued colors or whatever.
function zoomed() {
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
d3.select(self.frameElement).style("height", height + "px");

d3.json("countries.geo.json", function(json) {	
    d3.csv("countries.csv", function(data) {
        // Go through each element of the csv
		for (var i = 0; i < data.length; i++) {
			// Get data for csv element
        	var csvCountry = data[i].country;
        	var csvColor = data[i].color;
            var csvCircle = data[i].circle;
            var csvlongitude = data[i].lon;
            var csvlatitude  = data[i].lat;
            var csvlongitudee = data[i].lonn;
            var csvlatitudee = data[i].latt;
            var csvpicture = data[i].picture;
        	// Go through each element of the json looking for a country
        	//		to match the country of the csv.
			for (var j = 0; j < json.features.length; j++) {
				var jsonCountry = json.features[j].properties.name;
                //console.log(jsonCountry);
                //console.log(j);
				if (csvCountry == jsonCountry) {
					// Assign the color retrieved from the csv to the
					// 		matching json element.
					json.features[j].properties.color = csvColor;
                    json.features[j].properties.circle = csvCircle;
                    json.features[j].properties.lon = csvlongitude;
                    json.features[j].properties.lat = csvlatitude;
                    json.features[j].properties.lonn = csvlongitudee;
                    json.features[j].properties.latn = csvlatitudee;
                    json.features[j].properties.picture = csvpicture;
					break;
				}
			}
		}
		// Push all paths to the svg
        //Wheveter you do, do not remove the g.
		g.selectAll("path")
        	.data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            // Fill the country colors, the color found, or if
            //		a color was not found, paint it white.
            .style("fill", function(d) {
		        //var color = d.properties.color;
                var circle = d.properties.circle;
		        if (circle == 1) {
		            return "grey";
		        } else {
		            return "grey";//We need to automatically color every continent
		        }
            });
            
        
        
        g.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
              return projection([d.lon,d.lat])[0];})
           .attr("cy", function(d) {
               return projection([d.lon, d.lat])[1];})
           .attr("r", 2)
           .style("fill", "red")
            .on("mouseover", function(d) {
            tooltip.transition()
                   .duration(200)
                    .style("fill", "black")
                   .style("opacity", .9)
            tooltip.html('<a href= "' +d.picture+'" target="_blank">' + "Zues Picture" +"</a>" 
                        +"<br>" + "This is to show we ca use the tooltip. Will actually have picture appear" +"<br>" +
                        "The links in the tooltip will be to both of the sources for the god")//Here is the code we Will use
            //for the tooltip to add wikipedia link and godchecker link
            .style("left", (d3.event.pageX ) + "px")
            .style("top", (d3.event.pageY) + "px")});
        
        
	   
    
    });
    
});


