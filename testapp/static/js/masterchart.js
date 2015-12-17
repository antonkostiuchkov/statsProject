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



// The data from the external JSON file should be loaded into the chart options before the chart is created. This is a best practice suggestion, since creating the chart and then loading the data into it requires means drawing the chart twice.

$(document).ready(function() {

    var options = {
        chart: {
            renderTo: 'container',
            type: 'spline'
        },
        series: [{}]
    };

    $.getJSON('data.json', function(data) {
        options.series[0].data = data;
        var chart = new Highcharts.Chart(options);
    });

});


// JS for other charts

// Actions per user
// var userGroup = masterTable().group('user_name');
// var userGroupTable = TAFFY(userGroup);
// var userName = userGroupTable().map(function (group) {
//     return group.group[0];
// });
// var userActions = userGroupTable().select('count');


// Build HighCharts by passing chartOptions object

// Optionally var chart = new Highcharts.Chart(chartOptions);
