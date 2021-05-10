console.log("app.js loaded successfully!")

// Luis' code

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
        console.log(filteredData);


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
            hovertemplate: '<b>Inspection Type:</b> %{text}',
            text: inspTypes,
            type: 'line'
        }];

        // Layout variables
        var lineLayout = {
            title: `<b>Food Inspection Scores for ${rest}</b>`,
            xaxis: {
                tickformat: "%Y-%b-%d",
                tick0: ".5"
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