// THE OPTIONS OBJECT

var options = {
    chart: {
        renderTo: 'container',
        type: 'bar',
        zoomType: 'x'
    },
    title: {
        text: 'Monthly Average Temperature',
        x: -20 //center
    },
    subtitle: {
        text: 'Source: WorldClimate.com',
        x: -20
    },
    xAxis: {
        categories: x,
        // or
        // type: "datetime",
        title: {
            text: null
        }
    },
    yAxis: {
        // min: 0,
        // max: 600,
        title: {
            text: 'Temperature (°C)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        // crosshairs: true,
        valueSuffix: '°C'
    },
    legend: {
        // enabled: false,

        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 0
    },
    credits: {
        enabled: false
    },
    series: [{
        // for type: "datetime"
        pointStart: Date.now() - 29 * 24 * 60 * 60 * 1000,
        // number of miliseconds in a day
        pointInterval: 24 * 60 * 60 * 1000,


        name: 'Actions',
        data: y
    }]
};


$(document).ready(function() {
    var chart = new Highcharts.Chart(options);
});

// Extending  by dot notation
options.series.push({
    name: 'John',
    data: [3, 4, 2]
})



// GLOBAL OPTIONS

