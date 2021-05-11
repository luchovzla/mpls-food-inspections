console.log("rob.js is loaded");
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
