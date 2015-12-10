// Linechart



function lineChart (x, y, placeId) {
    $('#' + placeId + '').highcharts({
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        xAxis: {
            // categories: x
            // or
            type: "datetime"
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            // enabled: false,

            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            // for type: "datetime"
            pointStart: Date.now() - 29 * 24 * 60 * 60 * 1000,
            // number of miliseconds in a day
            pointInterval: 24 * 60 * 60 * 1000,


            name: 'Actions',
            data: y
        }]
    });
};


// Bar / column

function highCharts (x, y, chartType, placeId) {
    $('#' + placeId + '').highcharts({
        chart: {
            type: chartType
        },
        title: {
            text: 'Actions per user'
        },
        subtitle: {
            text: 'Amount of actions accomplished by top 10 users for the last 7 days'
        },
        xAxis: {
            categories: x,
            title: {
                text: null
            }
        },
        yAxis: {
            // min: 0,
            // max: 600,
            title: {
                text: 'Actions',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' actions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Actions',
            data: y
        }]
    });
};


// Area range / line chart

function arearangeChart () {
    $('#container').highcharts({
        chart: {
            type: 'arearange',
            zoomType: 'x'
        },
        title: {
            text: 'My Title'
        },
        subtitle: {
            text: 'My Subtitle'
        },
        xAxis: {
            categories: ['x', 'y'],
            // type: 'datetime',
            title: {
                text: null
            }
        },
        yAxis: {
            // min: 0,
            // max: 600,
            title: {
                text: 'yAxis Title',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            // crosshairs: true,
            // shared: true,
            valueSuffix: ' actions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            // enabled: false,

            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Name of series',
            data: data
        }]
    });
};