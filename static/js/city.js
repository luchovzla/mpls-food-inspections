// Console loaded
console.log("city.js loaded");

// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  ROUTINE: new L.LayerGroup(),
  FOLLOW_UP: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("markers", {
  center: [44.986656, -93.258133],
  zoom: 14,
  layers: [
    layers.ROUTINE,
    layers.FOLLOW_UP
  ]
});
// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Routine Inspection": layers.ROUTINE,
  "Follow-up Inspection": layers.FOLLOW_UP
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  ROUTINE: L.ExtraMarkers.icon({
    icon: "restaurant-outline",
    iconColor: "white",
    markerColor: "yellow",
    shape: "star"
  }),
  FOLLOW_UP: L.ExtraMarkers.icon({
    icon: "restaurant-outline",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
};

// Grabbin data with d3
d3.json("/restaurants").then(function(data) {

  console.log(data);
  // Create an object to keep of the number of markers in each layer
  var inspectionCount = {
    ROUTINE: 0,
    FOLLOW_UP: 0
  };

  // Initialize an inspecCode, which will be used as a key to access the appropriate layers, icons, and inspection count for layer group
  var inspecCode;

  // Loop through the restaurants
  for (var i = 0; i < data.length; i++) {

  // Create a new station object with properties of both station objects
  var markerType = Object.assign({}, data[i]);
  // If a station is listed but not installed, it's coming soon
    if (!markerType.routine) {
      inspecCode = "ROUTINE";
    }
    // If a inspection_type is not routine, select follow-up
    else {
      inspecCode = "FOLLOW_UP";_
    }

    // Update the restaurant count
    inspectionCount[inspecCode]++;
    // Create a new marker with the appropriate icon and coordinates
    var newMarker = L.marker([data[i].latitude, data[i].longitude], {
      icon: icons[inspecCode]
    });

    // Add the new marker to the appropriate layer
    newMarker.addTo(layers[inspecCode]);

    // Bind a popup to the marker that will  display on click. This will be rendered as HTML
    newMarker.bindPopup(data.business_name + "<br> Inspection Type: " + data.inspection_type + "<br> Inspection Score: " + data.inspection_score);
  }
  }); 
   
