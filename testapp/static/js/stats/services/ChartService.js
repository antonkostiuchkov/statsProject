Stats.factory('ChartService', [ 'LoadGraphData', function(LoadGraphData){

    var createChart = function (container, data, xAxis, response, queryParams) {
        var zoomOut = false;

        var chart = AmCharts.makeChart(container, {
            "type": "serial",
            "theme": "dark",
            "titles": [
                {
                    "text": ""
                }
            ],
            "dataProvider": data,
            "categoryField": xAxis,
            "categoryAxis": categoryAxis(xAxis, queryParams.granularity),
            "valueAxes": valueAxes(response),
            "graphs": graphs(queryParams.graph_id, xAxis, response),
            // "graphs": graphs(response, xAxis),
            // "chartScrollbar": {
            //     "autoHide": true
            // },
            "chartCursor": {},
            "listeners": [
                {
                    "event": "zoomed",
                    "method": handleZoom
                }, {
                    "event": "dataUpdated",
                    "method": handleDataUpdate
                }
            ],
            "legend" : {},
            "export": AmCharts.exportCFG
        });


        function handleZoom (event) {
            if (zoomOut) return;

            var newEndDate = new Date(event.endDate).toJSON();
            var newStartDate = new Date(event.startDate).toJSON();

            queryParams.start_time = newStartDate;
            queryParams.end_time = newEndDate;

            var deltaDays = Date.parse(event.endDate) - Date.parse(event.startDate);
            var diffDays = Math.ceil(deltaDays / (1000 * 3600 * 24));

            if (diffDays >= 30) {
                queryParams.granularity = 'Week';
            } else if (diffDays < 30 && diffDays >= 14) {
                queryParams.granularity = 'Day';
            } else if (diffDays < 14 && diffDays >= 2) {
                queryParams.granularity = 'Hour';
            } else {
                queryParams.granularity = 'Minute';
            };

            // console.log(queryParams);
            LoadGraphData.getGraphData(queryParams).then(function (response) {
                chart.dataProvider = response[0];
                event.chart.validateData();
            });
            zoomOut = true;
        };

        function handleDataUpdate (event) {
            if (queryParams.granularity === 'Minute') {
                zoomOut = true;
            } else {
                zoomOut = false;
            }
        };

    };


    function categoryAxis (xAxis, granularity) {
        if (xAxis === 'date') {
            return {
                "parseDates": true,
                "equalSpacing": true,
                "minPeriod": granularity
            }
        } else {
            return {"parseDates": false, "labelRotation": 25}
        }
    };

    function valueAxes (response) {
        var valueAxes = [];
        angular.forEach(response, function(value, key) {
            if (key === 2) {
                valueAxes.push({
                    "id": value,
                    "position": "left"
                });
            } else if (key > 2) {
                var step = 50;
                valueAxes.push({
                    "id": value,
                    "position": "right",
                    "offset": step*key-step*3
                });
            };
        });

        return valueAxes;
    };


    // function graphs (response, xAxis) {
    //     var graphs = [];

    //     angular.forEach(response, function(value, key) {
    //         if (key === 2) {
    //             graphs.push({
    //                 "id": value,
    //                 "balloonText": "[[category]] \n [[title]]: [[value]]",
    //                 // "balloonText": "Commands: [[cmd_count]] \n Errors: [[err_count]] \n MAX: [[exec_time_max]] \n AVG: [[exec_time_avg]]",
    //                 "bullet": (xAxis === 'date') ? 'round' : 'none',
    //                 "lineThickness": 3,
    //                 "title": value,
    //                 "type": (xAxis === 'date') ? 'smoothedLine' : 'column',
    //                 "fillAlphas": (xAxis === 'date') ? 0 : 0.30,
    //                 "valueAxis": value,
    //                 "valueField": value
    //             });
    //         } else if (key > 2) {
    //             var step = 2;
    //             graphs.push({
    //                 "id": value,
    //                 "balloonText": "[[category]] \n [[title]]: [[value]]",
    //                 "bullet": bullets(key),
    //                 "bullet": (xAxis === 'date') ? bullets(key) : '',
    //                 "bulletBorderAlpha": 1,
    //                 "bulletSize": 9,
    //                 "bulletColor": "#161616",
    //                 "useLineColorForBulletBorder": true,
    //                 "lineThickness": step/2 * (3 - key) + 3,
    //                 "title": value,
    //                 "dashLength": (xAxis === 'date') ? step * (key - 3) + 3 : '',
    //                 // "showBalloon": false,
    //                 "showBalloon": true,
    //                 // "type": "smoothedLine",
    //                 "type": (xAxis === 'date') ? 'smoothedLine' : 'column',
    //                 "fillAlphas": (xAxis === 'date') ? 0 : 0.30,
    //                 "valueAxis": value,
    //                 "valueField": value
    //             });
    //         };
    //     });

    //     return graphs;
    // };

    function graphs (id, xAxis, response) {
        var graphs = [];

        if (id === 1) {
            graphs.push({
                "lineThickness": 3
            });
            // "id": value,
            // "balloonText": "[[category]] \n [[title]]: [[value]]",
            // // "balloonText": "Commands: [[cmd_count]] \n Errors: [[err_count]] \n MAX: [[exec_time_max]] \n AVG: [[exec_time_avg]]",
            // "bullet": (xAxis === 'date') ? 'round' : 'none',
            // "lineThickness": 3,
            // "title": value,
            // "type": (xAxis === 'date') ? 'smoothedLine' : 'column',
            // "fillAlphas": (xAxis === 'date') ? 0 : 0.30,
            // "valueAxis": value,
            // "valueField": value
        };



        return graphs;
    };

    function bullets (key) {
        if (key === 3) {
            return "round"
        } else if (key === 4) {
            return "triangleUp";
        } else if (key === 5) {
            return "square";
        };
    };

    return {
        createChart: createChart
    };
}]);