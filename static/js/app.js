console.log("app.js loaded successfully!")

// Luis' code

// populate dataset with restaurant names

var dropdownMenu = d3.select("#selRestaurant");

d3.json("/restaurants").then(data => {

    data.forEach(restName => {
        console.log(`Restaurant Name: ${restName.business_name}`)
        dropdownMenu.append("option")
            .text(restName.business_name)
            .property("value", restName.business_name)
    });

});
