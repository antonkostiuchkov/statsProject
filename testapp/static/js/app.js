$(function() {

    // Defining sorting options
    var queryOptions = {
        interval: 'hour',
        limit: '14'
    };

    $('a.load').on('click', function() {

        // Grabbing vals from select and input
        var timeSpan = $( '#time-span' ).val();
        var lastDays = $( '#last-days' ).val();
        queryOptions.interval = timeSpan;
        queryOptions.limit = lastDays;

        var url = '/query/' + queryOptions.interval + '/' + queryOptions.limit + '/';

        // AJAX request data
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'JSON',
            beforeSend: function () {
                appendLoader ();
                $('.loader').show();
            },
            success: function (data, jqXHR) {

                // Grouping ajax result into a table
                var masterTable = TAFFY(data);

                // GROUP BY time
                var dateGroup = masterTable().group('date_aggr');
                var dateGroupTable = TAFFY(dateGroup);

                // Defining arrays that are going to be fed to highcharts
                var auths = [];
                var conns = [];
                var disconns = [];
                var exec = [];
                var execTimeAvg = [];


                // Iterate through each object in an array and return array
                dateGroupTable().map(function (object) {

                    // Parse date string into UNIX timestamp and add 1 hour
                    var unix = Date.parse(object.group[0]) + 3600000;

                    // An array of objects(results) for each day
                    var result = TAFFY(object.result);

                    // Number of authorizations
                    var authCount = result({operation_name:'User authorization'}).count();

                    // Number of connections
                    var conn = result({operation_name:'Connection'}).count();

                    // Number of disconnections
                    var disconn = result({operation_name:'Disconnection'}).count()*-1;


                    // Grabbing max value in the column 'exec-time'
                    var exTimeMax = result().max('exec_time');


                    // Filtering result table to show info for matching exTimeMax from column 'exec_time'
                    var filter = result().filter({'exec_time':exTimeMax});
                    var info = filter.get();
                    var userName = info[0].user_name;
                    var deviceName = info[0].device_name;
                    if (deviceName === null) {
                        var deviceName = 'None';
                    };
                    var operationName = info[0].operation_name;


                    // Average Execution Time
                    var execTimeRaw = result().avg('exec_time');
                    var execTimeRound = Number((execTimeRaw).toFixed(2));


                    // Update data for the charts
                    auths.push([unix, authCount]);
                    conns.push([unix, conn]);
                    disconns.push([unix, disconn]);
                    exec.push([unix, exTimeMax, {'userName': userName, 'deviceName': deviceName, 'operationName':operationName}]);
                    execTimeAvg.push([unix, execTimeRound]);

                });


                // GROUP BY operation_name
                var operationGroup = masterTable().group('operation_name');
                var operationGroupTable = TAFFY(operationGroup);

                var seriesDrill = [];
                var drillDrill = [];


                operationGroupTable().map(function (object) {

                    var result = TAFFY(object.result);

                    // Name of each operation
                    var operationName = object.group[0];

                    // Average Execution Time for each operation
                    var execTimeRaw = result().avg('exec_time');
                    var execTime = Number((execTimeRaw).toFixed(2));

                    var deviceGroup = result().group('device_name');
                    var deviceGroupTable = TAFFY(deviceGroup);

                    var execTimeAvgPerDevice = deviceGroupTable().map(function (object) {
                        var result = TAFFY(object.result);
                        var execTimeRaw = result().avg('exec_time');
                        var execTime = Number((execTimeRaw).toFixed(2));
                        var deviceName = object.group[0]
                        var result = [deviceName, execTime]
                        return result;
                    });

                    seriesDrill.push({
                        'name' : operationName,
                        'y' : execTime,
                        'drilldown' : operationName
                    });

                    drillDrill.push({
                        'id' : operationName,
                        'data' : execTimeAvgPerDevice
                    });
                });

                // Reversing arrays for x axis
                auths.reverse();
                conns.reverse();
                disconns.reverse();
                exec.reverse();
                execTimeAvg.reverse();

                // Sorting array from highest to lowest vals
                var seriesDrillSort = seriesDrill.sort(sortDesc);
                // Limiting to top 10 results
                var seriesDrillLimit = seriesDrillSort.slice(0,10)


                // Initializing charts
                highChartsAuth (auths, 'spline', 'container-1');
                highChartsConn (conns, disconns, 'column', 'container-4');
                highChartsExecTime (exec, execTimeAvg, 'container-7');
                highChartsDrill (seriesDrillLimit, drillDrill, 'container-8');

                // Hide loading animation
                $('.loader').hide();


            // End of success function
            },
            error: function () {
                alert('Service error. Check if you\'ve entered the amount of days');
            }

        // End of Ajax
        });

    // End of onclick function
    });



    labelFix ();

// End of document.ready function
});





// Appending loading animation
function appendLoader () {
    $('div[id^="container-"]').append('<div class="loader"><div class="content"><div class="stick"></div><div class="stick"></div><div class="stick"></div><div class="stick"></div><div class="stick"></div><div class="stick"></div><h1 class="loader-text">Loading...</h1></div></div>');
};


// Sort seriesDrill array by 'y' descending
function sortDesc (a,b) {
    return b.y - a.y;
};


// Label fix
function labelFix () {
    $('.input-group input').focusout(function(){
        var text_val = $(this).val();
        if(text_val === "") {
            $(this).removeClass('has-value');
        } else {
            $(this).addClass('has-value');
        }
    });
};


// Charts

function highChartsAuth (data, chartType, placeId) {
    $('#' + placeId + '').highcharts({
        chart: {
            type: chartType,
            zoomType: 'x'
        },
        title: {
            text: 'User Authorizations'
        },
        subtitle: {
            text: 'Amount of User authorizations for the x period of time'
        },
        xAxis: {
            type: 'datetime',
            ordinal: true,
            title: {
                text: null
            }
        },
        yAxis: {
            title: {
                text: 'Number of user authorizations'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            crosshairs: true,
            valueSuffix: ''
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Authorizations',
            data: data
        }]
    });
};

function highChartsConn (data1, data2, chartType, placeId) {
    $('#' + placeId + '').highcharts({
        chart: {
            type: chartType,
            zoomType: 'x'
        },
        title: {
            text: 'Connections vs. Disconnections'
        },
        subtitle: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            ordinal: true,
            reversed: false
        },
        yAxis: {
            title: {
                text: 'Number of disconnections and connections'
            },
            labels: {
                formatter: function () {
                    return Math.abs(this.value);
                }
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        tooltip: {
            crosshairs: true,
            formatter: function () {
                return '<span style="font-size:10px">' + Highcharts.dateFormat('%A, %b %e, %H:%M', new Date(this.x)) + '</span><br/>' +
                    '<b>' + this.series.name + '</b>: ' + Math.abs(this.point.y, 0);
            },
            valueSuffix: ''
        },
        legend: {
            enabled: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Connections',
            data: data1
        }, {
            name: 'Disconnections',
            data: data2
        }
        ]
    });
};

function highChartsExecTime (data, execTimeAvg, placeId) {
    $('#' + placeId + '').highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Max execution time'
        },
        subtitle: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            ordinal: true,
            title: {
                text: null
            }
        },
        yAxis: [{ // Primary yAxis
            title: {
                text: 'Max execution time',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                overflow: 'justify',
                format: '{value} ms',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            plotBands: { // Danger
                from: 400000,
                to: 800000,
                color: 'rgba(215, 40, 40, 0.1)',
                label: {
                    text: '⚠',
                    style: {
                        color: Highcharts.getOptions().colors[8],
                        fontSize: '40px'
                    }
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Average execution time',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                format: '{value} ms',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true
        }],
        tooltip: {
            crosshairs: true,
            shared: true,
            formatter: function () {
                var timeMaxName = this.points[0].point.series.name;
                var timeMaxVal =  this.points[0].point.y;
                var timeAvgName = this.points[1].point.series.name;
                var timeAvgVal =  this.points[1].point.y;

                var index = this.points[0].point.index;
                var dataArray = data[index];
                var userName = dataArray[2].userName;
                var deviceName = dataArray[2].deviceName;
                var operationName = dataArray[2].operationName;


                return '<span style="font-size:10px">' + Highcharts.dateFormat('%A, %b %e, %H:%M', new Date(this.x)) + '</span><br/>' +
                    timeAvgName + ': ' + '<b>' + timeAvgVal + ' ms, ' + '</b><br>' +
                    timeMaxName + ': ' + '<b>' + timeMaxVal + ' ms, ' + '</b><br>' +
                    'User: ' + userName + ', ' + '<br>' +
                    'Device: ' + deviceName + ', ' + '<br>' +
                    'Operation: ' + operationName;

            }
        },
        legend: {
            enabled: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Time (max)',
            type: 'area',
            data: data
        }, {
            name: 'Time (avg)',
            type: 'spline',
            data: execTimeAvg,
            yAxis: 1
        }]
    });
};

function highChartsDrill (seriesData, drillData, placeId) {
    $('#' + placeId + '').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'TOP 5 Operations\' Max Execution Time and its Breakdown by Devices'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Average Execution Time'
            }
        },
        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.y} ms'
                }
            }
        },

        series: [{
            name: 'Operations',
            colorByPoint: true,
            data: seriesData
        }],
        drilldown: {
            series: drillData
        }
    });
};



