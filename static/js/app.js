console.log("app.js loaded successfully!")

// Luis' code

// populate dataset with restaurant names

var dropdownMenu = d3.select("#selRestaurant");

// Read JSON then process it
d3.json("/restaurants").then(data => {

    // Gather restaurant names with address from JSON
    var restNameAddress = data.map(rest => `${rest.business_name}-${rest.address}`);

    // Gather uniques using the ... method
    var uniqueRests = [...new Set(restNameAddress)];
    
    // Sort data alphabetically
    uniqueRests.sort();
    console.log(uniqueRests);

    // Push to dropdown
    uniqueRests.forEach(rest => {
        dropdownMenu.append("option")
            .text(rest)
            .property("value", rest);
    });

});
