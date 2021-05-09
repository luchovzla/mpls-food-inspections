console.log("terra.js loaded")

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
  console.log(markers);

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
        .bindPopup(response[i].business_name + "<br> Year: " + year + "<br> Inspection Type: " + response[i].inspection_type + "<br> Inspection Score: " + response[i].inspection_score));
    }
  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});