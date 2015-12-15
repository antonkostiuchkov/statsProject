$(function() {



    var queryOptions = {
        interval: 'hour',
        limit: '13'
        // minute
        // hour
        // day
        // week
        // month
        // quarter
        // year
    };

    var url = '/query/' + queryOptions.interval + '/' + queryOptions.limit + '/';


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

                var auths = [];
                var conns = [];
                var disconns = [];
                var exec = [];
                var execTimeAvg = [];

                // GROUP BY time
                var dateGroup = masterData().group('date_aggr');
                var dateGroupData = TAFFY(dateGroup);

                var chartData = dateGroupData().map(function (group) {

                    // Parse date string into UNIX timestamp and add 1 hour
                    var unix = Date.parse(group.group[0]) + 3600000;

                    // An array of objects(results) for each day
                    var result = TAFFY(group.result);

                    // Number of authorizations
                    var authCount = result({operation_name:'User authorization'}).count();

                    // Number of connections
                    var conn = result({operation_name:'Connection'}).count();

                    // Number of disconnections
                    var disconn = result({operation_name:'Disconnection'}).count()*-1;


                    // Max / Min exec_time

                    // var exTime = result().select('exec_time');
                    // Excluding 0
                    // $.each(exTime, function (i, x) {
                    //     var index = $.inArray(0, exTime);
                    //     if (index !== -1) {
                    //         exTime.splice(index, 1)
                    //     };
                    // });

                    // Grabbing max value in the column 'exec-time'
                    var exTimeMax = result().max('exec_time');

                    // Min results in 0 or when excluding 0 - 1,4 and so on. In practice this is represented badly on the graph.
                    // var exTimeMin = Math.min.apply(null, exTime);

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

                auths.reverse();
                conns.reverse();
                disconns.reverse();
                exec.reverse();
                execTimeAvg.reverse();



                // Actions per user
                // var userGroup = masterData().group('user_name');
                // var userGroupData = TAFFY(userGroup);
                // var userName = userGroupData().map(function (group) {
                //     return group.group[0];
                // });
                // var userActions = userGroupData().select('count');


                // Initializing charts
                // var chart = new Highcharts.Chart(chartOptions);

                highChartsAuth(auths, 'spline', 'container-1');
                highChartsConn(conns, disconns, 'column', 'container-4');
                highChartsExecTime(exec, execTimeAvg, 'container-7');

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