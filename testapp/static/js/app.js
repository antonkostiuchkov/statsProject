$(function() {

    // minute
    // hour
    // day
    // week
    // month
    // quarter
    // year

    var options = {
        interval: 'hour',
        limit: '5'
    };

    var url = '/query/' + options.interval + '/' + options.limit + '/';

    var chartTypes = {
        bar: 'bar',
        column: 'column',
        line: 'line',
        spline: 'spline'
    };

    $('a.load').on('click', function() {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'JSON',
            beforeSend: function () {
                $('.loader').show();
            },
            success: function (data, jqXHR) {

                // SQL query
                var masterData = TAFFY(data);


                // Actions per user
                var userGroup = masterData().group('user_name');
                var userGroupData = TAFFY(userGroup);
                var userName = userGroupData().map(function (group) {
                    return group.group[0];
                });
                var userActions = userGroupData().select('count');


                // GENERAL SYSTEM SPEED
                var dateGroup = masterData().group('date_aggr');
                var dateGroupData = TAFFY(dateGroup);
                var date = dateGroupData().map(function (group) {
                    return group.group[0];
                }).reverse();
                console.log(date);

                var execTimeAvg = dateGroupData().map(function (r) {
                    var execTimeData = TAFFY(r.result);
                    var execTimeRaw = execTimeData().avg('exec_time');
                    var execTimeRound = Number((execTimeRaw).toFixed(2));
                    return execTimeRound

                });



                // Areachart

                highCharts (userName, userActions, chartTypes.column, 'container-1');
                highCharts (date, execTimeAvg, chartTypes.bar, 'container-2');
                highCharts (userName, userActions, chartTypes.bar, 'container-3');
                lineChart (date, execTimeAvg, 'container-4');



                // Hide loading animation
                $('.loader').hide();
            },
            error: function () {
                alert('Service error');
            }
        });
    });


// End of document.ready funtion
});



// Charts
function highCharts (x, y, chartType, placeId) {
    $('#' + placeId + '').highcharts({
        chart: {
            type: chartType,
            zoomType: 'x'
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

function lineChart (x, y, placeId) {
    $('#' + placeId + '').highcharts({
        chart: {
            type: 'spline',
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
            categories: x
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
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            type: 'area',
            name: 'Actions',
            data: y
        }]
    });
};
