$(function() {


    var url = '/query/';


    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON',
        success: function (users) {
            var user_name = [];
            var user_actions = [];

            $.each(users, function(i, user) {

                user_name.push(user.user_name);
                user_actions.push(user.user_actions);

                highCharts1 (user_name, user_actions);
            });
        },
        error: function () {
            alert('Service error');
        }
    });

    // $.ajax({
    //     url: url2,
    //     type: 'GET',
    //     dataType: 'JSON',
    //     success: function (users) {
    //         var user_name = [];
    //         var connection_count = [];

    //         $.each(users, function(i, user) {

    //             user_name.push(user.user_name);
    //             connection_count.push(user.connection_count);

    //             highCharts2 (user_name, connection_count);
    //         });
    //     },
    //     error: function () {
    //         alert('Service error');
    //     }
    // });

    // $.ajax({
    //     url: url3,
    //     type: 'GET',
    //     dataType: 'JSON',
    //     success: function (users) {
    //         var device_name = [];
    //         var connection_count = [];

    //         $.each(users, function(i, user) {

    //             device_name.push(user.device_name);
    //             connection_count.push(user.connection_count);

    //             highCharts3 (device_name, connection_count);
    //         });
    //     },
    //     error: function () {
    //         alert('Service error');
    //     }
    // });

    // $.ajax({
    //     url: url4,
    //     type: 'GET',
    //     dataType: 'JSON',
    //     success: function (users) {
    //         var action_name = [];
    //         var operation_count = [];

    //         $.each(users, function(i, user) {

    //             action_name.push(user.action_name);
    //             operation_count.push(user.operation_count);

    //             highCharts4 (action_name, operation_count);
    //         });
    //     },
    //     error: function () {
    //         alert('Service error');
    //     }
    // });


    // $.ajax({
    //     url: url5,
    //     type: 'GET',
    //     dataType: 'JSON',
    //     success: function (users) {
    //         var date_aggr = [];
    //         var auth_num = [];

    //         $.each(users, function(i, user) {

    //             date_aggr.push(user.date_aggr);
    //             auth_num.push(user.auth_num);

    //             highCharts5 (date_aggr, auth_num);
    //         });
    //     },
    //     error: function () {
    //         alert('Service error');
    //     }
    // });


    // $.ajax({
    //     url: url6,
    //     type: 'GET',
    //     dataType: 'JSON',
    //     success: function (users) {
    //         var date_aggr = [];
    //         var avg_exec_time = [];

    //         $.each(users, function(i, user) {

    //             date_aggr.push(user.date_aggr);
    //             avg_exec_time.push(user.avg_exec_time);

    //             highCharts6 (date_aggr, avg_exec_time);
    //         });
    //     },
    //     error: function () {
    //         alert('Service error');
    //     }
    // });


// End of document.ready funtion
});



// Charts
function highCharts (user_name, user_actions) {
    $('#container-1').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Actions per user'
        },
        subtitle: {
            text: 'Amount of actions accomplished by top 10 users for the last 7 days'
        },
        xAxis: {
            categories: user_name,
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
            data: user_actions
        }]
    });
};


// function highCharts2 (user_name, connection_count) {
//     $('#container-2').highcharts({
//         chart: {
//             type: 'bar'
//         },
//         title: {
//             text: 'Connection attempts per user'
//         },
//         subtitle: {
//             text: 'Amount of connections by users for the last 7 days'
//         },
//         xAxis: {
//             categories: user_name,
//             title: {
//                 text: null
//             }
//         },
//         yAxis: {
//             // min: 0,
//             // max: 600,
//             title: {
//                 text: 'Connections',
//                 align: 'high'
//             },
//             labels: {
//                 overflow: 'justify'
//             }
//         },
//         tooltip: {
//             valueSuffix: ' connections'
//         },
//         plotOptions: {
//             bar: {
//                 dataLabels: {
//                     enabled: true
//                 }
//             }
//         },
//         legend: {
//             layout: 'vertical',
//             align: 'right',
//             verticalAlign: 'top',
//             x: -40,
//             y: 80,
//             floating: true,
//             borderWidth: 1,
//             backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
//             shadow: true
//         },
//         credits: {
//             enabled: false
//         },
//         series: [{
//             name: 'Connections',
//             data: connection_count
//         }]
//     });
// };

// function highCharts3 (device_name, connection_count) {
//     $('#container-3').highcharts({
//         chart: {
//             type: 'column'
//         },
//         title: {
//             text: 'Number of connections per camera'
//         },
//         subtitle: {
//             text: 'Amount of connections to cameras for the last 7 days'
//         },
//         xAxis: {
//             categories: device_name,
//             title: {
//                 text: null
//             }
//         },
//         yAxis: {
//             // min: 0,
//             // max: 600,
//             title: {
//                 text: 'Connections',
//                 align: 'high'
//             },
//             labels: {
//                 overflow: 'justify'
//             }
//         },
//         tooltip: {
//             valueSuffix: ' connections'
//         },
//         plotOptions: {
//             bar: {
//                 dataLabels: {
//                     enabled: true
//                 }
//             }
//         },
//         legend: {
//             layout: 'vertical',
//             align: 'right',
//             verticalAlign: 'top',
//             x: -40,
//             y: 80,
//             floating: true,
//             borderWidth: 1,
//             backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
//             shadow: true
//         },
//         credits: {
//             enabled: false
//         },
//         series: [{
//             name: 'Connections',
//             data: connection_count
//         }]
//     });
// };


// function highCharts4 (action_name, operation_count) {
//     $('#container-4').highcharts({
//         chart: {
//             type: 'bar'
//         },
//         title: {
//             text: 'TOP 5 most frequently executed operations'
//         },
//         subtitle: {
//             text: 'Amount of connections to cameras for the last 7 days'
//         },
//         xAxis: {
//             categories: action_name,
//             title: {
//                 text: null
//             }
//         },
//         yAxis: {
//             // min: 0,
//             // max: 600,
//             title: {
//                 text: 'Operations',
//                 align: 'high'
//             },
//             labels: {
//                 overflow: 'justify'
//             }
//         },
//         tooltip: {
//             valueSuffix: ' times'
//         },
//         plotOptions: {
//             bar: {
//                 dataLabels: {
//                     enabled: true
//                 }
//             }
//         },
//         legend: {
//             layout: 'vertical',
//             align: 'right',
//             verticalAlign: 'top',
//             x: -40,
//             y: 80,
//             floating: true,
//             borderWidth: 1,
//             backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
//             shadow: true
//         },
//         credits: {
//             enabled: false
//         },
//         series: [{
//             name: 'Operations',
//             data: operation_count
//         }]
//     });
// };


// function highCharts5 (date_aggr, auth_num) {
//     $('#container-5').highcharts({
//         title: {
//             text: 'User authentications',
//             x: -20 //center
//         },
//         subtitle: {
//             text: 'Amount of user authentications for the last 60 days',
//             x: -20
//         },
//         xAxis: {
//             categories: date_aggr
//         },
//         yAxis: {
//             title: {
//                 text: 'Authentications'
//             },
//             plotLines: [{
//                 value: 0,
//                 width: 1,
//                 color: '#808080'
//             }]
//         },
//         tooltip: {
//             valueSuffix: ' times'
//         },
//         legend: {
//             layout: 'vertical',
//             align: 'right',
//             verticalAlign: 'middle',
//             borderWidth: 0
//         },
//         series: [{
//             name: 'authentications',
//             data: auth_num
//         }]
//     });
// };


// function highCharts6 (date_aggr, avg_exec_time) {
//     $('#container-6').highcharts({
//         title: {
//             text: 'Average execution time',
//             x: -20 //center
//         },
//         subtitle: {
//             text: 'Average time an operation takes to execute for the last 30 days',
//             x: -20
//         },
//         xAxis: {
//             categories: date_aggr
//         },
//         yAxis: {
//             title: {
//                 text: 'Milliseconds'
//             },
//             plotLines: [{
//                 value: 0,
//                 width: 1,
//                 color: '#808080'
//             }]
//         },
//         tooltip: {
//             valueSuffix: ' ms'
//         },
//         legend: {
//             layout: 'vertical',
//             align: 'right',
//             verticalAlign: 'middle',
//             borderWidth: 0
//         },
//         series: [{
//             name: 'Execution Time',
//             data: avg_exec_time
//         }]
//     });
// };


