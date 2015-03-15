// Width and height
var width = document.getElementById('container').offsetWidth-60,
    height = 600;

var projection = d3.geo.mercator()
    .scale((width) / 2 / Math.PI)
    .translate([width / 2, height / 2]);

//Will be used to create the path
var path = d3.geo.path().projection(projection);

//Creates zoom variable for later pan/zoom functionality
var zoom = d3.behavior.zoom().scaleExtent([1,8]).on("zoom", zoomed);

//Create the canvas
var svg = d3.select("#container")
	        .append("svg")
	        .attr("width", width+275)
	        .attr("height", height)
            .append("g");

//Create secondary layer to canvas SVG
var g = svg.append("g");

//boolean variable for buttons?
//var state = false;

//Create tooltip to be used for information on circles
var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

//Call zoom and further functions
svg.call(zoom).call(zoom.event);

//Function to zoom and transform the page
function zoomed() {
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")};


d3.select(self.frameElement).style("height", height + "px");

//Parse the data
//Data will be graabed from countries.geo.json and
//Map_of_Gods.csv
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
            var csvPicture = data[i].picture;
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
                    json.features[j].properties.Picture = csvPicture;
					break;
                }//if(csvLocation == jsonCountry
            }//for loop
        }//outer for loop
       
        //This moves all the paths to the svg/g canvas
        //Color scheme for initial countries is from GodChecker.com
        g.selectAll("path")
         .data(json.features)
         .enter()
         .append("path")
         .attr("d", path)
         .style("fill", function(d) {
            var country = d.properties.Location;
            if(country === "Mexico") {
                   return "#410d66";}//purple  
            if(country === "Greece") {
                   return "#af560e";}//orange
            if(country === "Japan") {
                   return "#c90e0e";}//red
            if(country === "United Kingdom") {
                   return "#217f05";}//green        
            if(country === "Nigeria") {
                   return "#9b6e5a";}//light brown
            if(country === "Peru") {
                   return "#668719";}//green yellow
            if(country === "Egypt") {
                   return "#efc873";}//beige
            if(country === "Denmark") {
                   return "#384c5b";}//bluegrey
            if(country === "Finland") {
                   return "#384c5b";}
            if(country === "Norway") {
                   return "#384c5b";}
            if(country === "Sweden") {
                   return "#384c5b";}
            else {
                return "grey";}
        });//This is for the stlye attribute for the path
            
     //We will now create all of the circles and Gods
        g.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
         .attr("cx", function(d) {
                return projection([d.lon,d.lat])[0];})
          .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];})
          .attr("r", 3)
          .style("fill", function(d) {
                    var typeOfGod = d.type;
                    if(typeOfGod === "Storm" || typeOfGod ==="Sky") {
                        return "#bcb7b8";}
                    else if(typeOfGod === "Death") {
                        return "black";}
                    else if(typeOfGod === "Agriculture") {
                        return "brown";}
                    else if(typeOfGod === "Motherhood") {
                        return "#41f2ba";}
                    else if(typeOfGod === "War" || typeOfGod ==="Chaos") {
                        return "#9e0e0e";}
                    else if(typeOfGod === "Moon") {
                        return "white";}
                    else if(typeOfGod === "Sun") {
                        return "yellow";}
                    else if(typeOfGod === "Love") {
                        return "#f74c74";}
                    else if(typeOfGod ===  "Wisdom") {
                        return "purple";}
                    else if(typeOfGod === "Sea") {
                        return "blue";}
                      
                    else{
                        return "grey";}
                })//These brackets match to the style for circles and end the selectALL()
        
         .on('mouseover', function(d) {
            
            tooltip.transition()
                   .duration(200)
                   .style("fill", "black")
                   .style("opacity", ".9");
            tooltip.html("<img src = " + d.picture+">" + "<br>" + "Name: " + d.name + "<br>"
                        + "Culture: " + d.culture + "<br>" + "Region: " + d.location + "<br>"
                        + "Gender: " + d.gender + "<br>" + "Species: " + d.species + "<br>" +
                        '<a href = "' + d.linkwik + '>' + "Wikipedia Source" + "</a>" + "Gender: " + d.gender + "<br>" + "Species: " + d.species + "<br>"
                        )
                   .style("left", (d3.event.pageX ) + "px")
                   .style("top", (d3.event.pageY) + "px")})
    
          .on('mouseout', function(d) {
            tooltip.transition()
                   .duration(500)
                   .style("opacity", 0)});
       
    
        
         
            
    });//These bracets are for d3.csv line above
});//These brackets are for d3.json line
