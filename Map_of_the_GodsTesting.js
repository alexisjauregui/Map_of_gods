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
	.attr("width", width+275)
	.attr("height", height)
    .append("g");

var leftbutton = document.getElementById("on");
var rightbutton =document.getElementById("off");
var g = svg.append("g");
var on = false;
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
    d3.csv("Map_of_the_Gods.csv", function(data) {
        // Go through each element of the csv
		for (var i = 0; i < data.length; i++) {
			// Get data for csv element
        	var csvName = data[i].name;
        	var csvCulture = data[i].culture;
            var csvLocation = data[i].location;
            var csvGender = data[i].gender;
            var csvSpecies  = data[i].species;
            var csvType = data[i].type;
            var csvWikiLink = data[i].linkwik;
            var csvGCLink = data[i].linkgc;
        	// Go through each element of the json looking for a country
        	//		to match the country of the csv.
			for (var j = 0; j < json.features.length; j++) {
				var jsonCountry = json.features[j].properties.name;
                //console.log(jsonCountry);
                //console.log(j);
				if (csvLocation == jsonCountry) {
					// Assign the color retrieved from the csv to the
					// 		matching json element.
					json.features[j].properties.Name = csvName;
                    json.features[j].properties.Culture = csvCulture;
                    json.features[j].properties.Location = csvLocation;
                    json.features[j].properties.Gender = csvGender;
                    json.features[j].properties.Species = csvSpecies;
                    json.features[j].properties.Type = csvType;
                    json.features[j].properties.WikiLink = csvWikiLink;
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
                var country = d.properties.Location;
		        if (country === "Japan") {
		            return "blue";
		        } 
                else if(country ==="Greece"){
                 return "orange";   
                }
            
                else {
		            return "grey";//We need to automatically color  every  continent
		        }
            });
            
        
        d3.select(leftbutton).on('click', function() {  
        if(on == false)
        {
            console.log("here");
            g.selectAll("circle")
                .data(data)
            .enter()
                .append("circle")
                .attr("cx", function(d) {
                return projection([d.lon,d.lat])[0];})
                .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];})
                .attr("r", 2)//Use function here to color circles appropriately
                        //Same as above with coloring countries
                .style("fill", "red");
            /* .on('mouseover', function(d) {
                tooltip.transition()
                .duration(200)
                    .style("fill", "black")
                    .style("opacity", .9)
            //This line of code<img src will make a picture show in the tooltip
            tooltip.html(/*"<img src = 'papyrus.jpeg'>" + '<a href= "' +d.picture+'" target="_blank">' + "Zues Picture" +"</a>" 
                        +"<br>"  +d.lon + d.lat +d.name)///Here is the code we Will use
            //for the tooltip to add wikipedia link and godchecker link
            .style("left", (d3.event.pageX ) + "px")
            .style("top", (d3.event.pageY) + "px")})
            .on('mouseout', function(d) {
             tooltip.transition()
             .duration(500)
             .style("opacity", 0)});*/
             on = true;
        }
        });
      /* d3.select(rightbutton).on('click', function() {
            if(on == true)
            {
                d3.selectAll("circle").remove();
        
                console.log(on);
                on = false;
                console.log(on);
            }
        });*/
    
    

        
            
});
    
    });
    



