console.log("app.js loaded successfully!")

// Terra & Joe's section: Cluster Marker Map 

// Creating map object
var myMap = L.map("markers", {
    center: [44.986656, -93.258133],
    zoom: 13
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Grab the data with d3
  d3.json("/restaurants").then(function(response) {
  
    // Create a new marker cluster group
    var markers = L.markerClusterGroup();

    // Loop through data
    for (var i = 0; i < response.length; i++) {
  
      // Set the data location property to a variable
      var location = (response[i].latitude, response[i].longitude);
      // Extract just the year from datetime stamp
      var today = new Date();
      var year = today.getFullYear(response[i].inspection_date);
  
      // Check for location property
      if (location) {
  
        // console.log(response[i].latitude, response[i].longitude);
        
        // Add a new marker to the cluster group and bind a pop-up
        markers.addLayer(L.marker([response[i].latitude, response[i].longitude])
          .bindPopup("<strong>" + response[i].business_name + "</strong> <br> Address: " + response[i].address +"<br> Date: " + year + "<br> Inspection Type: " + response[i].inspection_type + "<br> Inspection Score: " + response[i].inspection_score));
      }
    }
  
    // Add our marker cluster layer to the map
    myMap.addLayer(markers);
  
    // Add event listener to listen for clicks on markers
    markers.on('click', function(e) {
      var popup = e.layer.getPopup();
      var content = popup.getContent();
  
      var textArray = content.split("<br>");
  
      // Strip Restaurant Name
      var restName = textArray[0];
      restName = jQuery(restName).text();
  
      // Strip Restaurant Address
      var restAddress = textArray[1].split("Address: ")[1];
  
      // Call drawLineGraph
      drawLineGraph(restName, restAddress);
    });
  
  });

// Luis' code: Plotly Line graph of food inspection score history

// Line Graph
function drawLineGraph(rest, address) {
    
    // Read JSON to extract data to plot
    d3.json("/restaurants").then(data => {

        // Filter data to name and address of restaurant to plot
        var filteredData = data.filter(obj => obj.business_name === rest && obj.address === address);
        filteredData.forEach(d => d.inspection_date = new Date(d.inspection_date));
        
        // Sort by date

        filteredData.sort(function (x, y) {
            return x.inspection_date - y.inspection_date;
        });
        //console.log(filteredData);


        // Extract inspection dates, scores and types
        
        var inspDates = filteredData.map(data => data.inspection_date);
        var inspScores = filteredData.map(data => data.inspection_score);
        var inspTypes = filteredData.map(data => data.inspection_type); 
        
        // Format date component
        // const dateFormatter = new Intl.DateTimeFormat('en-US');
        // formattedDates = inspDates.map(date => dateFormatter.format(date));
        
        var today = new Date();
        // Trace data for line
        var lineData = [{
            x: inspDates,
            y: inspScores,
            hovertemplate: '<b>Inspection Type:</b> %{text}<br>' +
                            '<b>Inspection Score:</b> %{y}<extra></extra>',
            text: inspTypes,
            type: 'line'
        }];

        // Layout variables
        var lineLayout = {
            title: `<b>Food Inspection Scores for<br>${rest}</b>`,
            xaxis: {
                type: "date",
                tickformat: "%Y-%b-%d",
                range: ["2017-10-01", "2021-05-01"]
            },
            yaxis: {range: [50, 105]}
        };

        // Draw plot
        Plotly.newPlot("line-graph", lineData, lineLayout);
    });
}

function initLineGraph() {


    // populate dataset with restaurant names
    //// Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selRestaurant");
    
    //// Read JSON then process it
    d3.json("/restaurants").then(data => {

        // Gather restaurant names with address from JSON
        var restNameAddress = data.map(rest => `${rest.business_name} / ${rest.address}`);

        // Gather uniques using the ... method
        var uniqueRests = [...new Set(restNameAddress)];

        // Sort data alphabetically
        uniqueRests.sort();

        // Push to dropdown
        uniqueRests.forEach(rest => {
            dropdownMenu.append("option")
                .text(rest)
                .property("value", rest);
        });

        var restStringArray = uniqueRests[0].split(' / ');
        console.log(restStringArray);
        var restName = restStringArray[0];
        var restAddress = restStringArray[1];


        // Update line graph
        drawLineGraph(restName, restAddress);

    });

}

// Function that refreshes line graph on change

function restChanged(newRest) {

    // Refresh graph using the new rest name
    console.log(`User selected ${newRest}`);

    //// Parse new restaurant info and pass to drawLineGraph
    var restStringArray = newRest.split(' / ');
    var restName = restStringArray[0];
    var restAddress = restStringArray[1];
    drawLineGraph(restName, restAddress);
}

initLineGraph();

// Roberto's section: Apexcharts bar graph for top 10 restaurants by neighborhood
var chartRobert;

d3.json("/avgScoreByNeighborhood/top10routine").then(RestaurantData => {


    let options = getOptions(RestaurantData);
     chartRobert = new ApexCharts(document.querySelector("#bar-graph"), options);
     chartRobert.render();
     console.log(RestaurantData);
 });
 
 // Function that refreshes line graph on change
 
 function getOptions(RestaurantData)
 {
 
     let axisX = new Array(RestaurantData.length);
     let axisY = new Array(RestaurantData.length);
 
 
     let minX = parseFloat(RestaurantData[0].is_avg);
     let maxX = parseFloat(RestaurantData[0].is_avg);
 
     for (let index = 0; index < RestaurantData.length; index++) {   
    
         var currentVal = parseFloat(RestaurantData[index].is_avg);
         if (currentVal < minX) {
             minX = currentVal;
         }
         
         if (currentVal > maxX) {
             maxX = currentVal;
         }            
         axisX[index] = currentVal;
         axisY[index] = RestaurantData[index].neighborhood;
     }
 
 
     let options = {
         series: [{
             name: "Score Average for Routine Inspection", 
             data: axisX
         }],
         chart: {
             type: 'bar',
             height: 350
         },
         plotOptions: {
             bar: {
                 borderRadius: 4,
                 horizontal: true,
             }
         },
         dataLabels: {
             enabled: false
         },
         xaxis: {
             categories: axisY,
             tickAmount: parseInt(maxX) - parseInt(minX) ,                
             min: parseInt(minX),
             max: parseInt(maxX),                   
         }
     };
 
 return options;
 
 
 
 }
 
 function selectBarGraphChanged(newRest) {
 
     d3.json("/avgScoreByNeighborhood/"+newRest).then(RestaurantData => {
       
         let options= getOptions(RestaurantData);        
         chartRobert.updateOptions(options);   
         console.log(RestaurantData);
     });
 }
 