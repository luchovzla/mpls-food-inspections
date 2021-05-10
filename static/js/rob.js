console.log("rob.js is loaded");

d3.json("/avgScoreByNeighborhood").then(RestaurantData => {



    let axisX = new Array(RestaurantData.length);
    let axisY = new Array(RestaurantData.length);

    for (let index = 0; index < RestaurantData.length; index++) {
        axisX[index] = RestaurantData[index].is_avg;
        axisY[index] = RestaurantData[index].neighborhood;
    }

    var options = {
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
        }
    };

    var chart = new ApexCharts(document.querySelector("#bar-graph"), options);
    chart.render();

    console.log(RestaurantData);
});
