Stats.controller('homeCtrl', ['$scope', 'LoadGraphData', 'LoadReportData', 'LoadFilters', 'ChartService', 'ReportService', 'LoadGraphList', 'LoadThisGraphData', function($scope, LoadGraphData, LoadReportData, LoadFilters, ChartService, ReportService, LoadGraphList, LoadThisGraphData) {

    $scope.items = ['Minute', 'Hour', 'Day', 'Week', 'Month', 'Quarter', 'Year'];
    $scope.granularity = 'Day';
    $scope.start = '2016-01-20T10:00:00.000Z';
    // $scope.end = new Date().toJSON().slice(0,10);
    $scope.end = new Date().toJSON();
    $scope.avg = false;
    $scope.max = false;


    $scope.loadGraphList = function() {
        LoadGraphList.getGraphList().then(function (response) {
           $scope.graph_1 = response.data.commands_per_time;
        });
    };

    $scope.loadGraph = function (id, container) {

        checkUndefinedAndNull();

        var queryParams = {
            'granularity': $scope.granularity,
            'start_time': $scope.start,
            'end_time': $scope.end,
            'graph_id': id,
            'average': $scope.avg,
            'maximum': $scope.max,
            'user_name': $scope.selectedUser,
            'result_code': $scope.selectedCode,
            'device_id': $scope.selectedDevice.device_id,
            'action_code': $scope.selectedEvent.action_code
        };



        // var queryParams = {
        //     'granularity': $scope.granularityTest,
        //     'start_time': $scope.start,
        //     'end_time': $scope.end,
        //     'graph_id': $scope.graphId,
        //     'average': $scope.avg,
        //     'maximum': $scope.max,
        //     // 'user_name': $scope.selectedUser,
        //     // 'result_code': $scope.selectedCode,
        //     // 'device_id': $scope.selectedDevice.device_id,
        //     // 'action_code': $scope.selectedEvent.action_code
        // };

        var deltaDays = Date.parse($scope.end) - Date.parse($scope.start);

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

        console.log(queryParams);

        LoadGraphData.getGraphData(queryParams).then(function (response) {

            var data = response[0];
            var xAxis = response[1];

            // var data = response.dloadGraphListloadGraphList

            removeUndefinedFromArray(response);

            // ChartService.createChart(container, data, xAxis, response, $scope.granularityTest, queryParams);
            ChartService.createChart(container, data, xAxis, response, queryParams);
        });

    };


    $scope.loadReport = function () {
        $scope.isDisabled  = false;
        LoadReportData.getReportData().then(function (response) {
            $scope.isDisabled = true;
            $('#report-table').prepend('<thead><tr><th>Objects</th><th>Enabled</th><th>Disabled</th></tr></thead>');
            $scope.objects = response.data;
        });
    };

    function removeUndefinedFromArray (response) {
        angular.forEach(response, function(value, key) {
            if (!value) {
                response.splice(key)
            }
        });
    };

    function isUndefinedOrNull(val) {
        return angular.isUndefined(val) || val === null
    };

    function checkUndefinedAndNull (argument) {
        if (isUndefinedOrNull($scope.selectedUser)) {
            $scope.selectedUser = 'all'
        };

        if (isUndefinedOrNull($scope.selectedCode)) {
            $scope.selectedCode = '999';
        };

        if (isUndefinedOrNull($scope.selectedDevice)) {
            $scope.selectedDevice = { "device_id": "all" };
        };

        if (isUndefinedOrNull($scope.selectedEvent)) {
            $scope.selectedEvent = { "action_code": "999" };;
        };
    };

        // DIRECTIVE
    // Adding functionality for AmCharts to show table of data
    // (function () {
    //     AmCharts.exportCFG.fileName = "myChartExport";
    //     AmCharts.exportCFG.menu[0].menu.push({
    //       "label": "Display data",
    //       "click": function() {

    //         // get chart object
    //         var chart = this.setup.chart;

    //         // get chart data
    //         var data = chart.dataProvider;

    //         // create a table
    //         var holder = document.createElement("div");
    //         holder.className = "chart-data";
    //         var table = document.createElement("table");
    //         table.className = "table";
    //         holder.appendChild(table);

    //         var tr, td;

    //         // add first row
    //         for (var x = 0; x < chart.dataProvider.length; x++) {
    //           // first row
    //           if (x == 0) {
    //             tr = document.createElement("tr");
    //             table.appendChild(tr);
    //             td = document.createElement("th");
    //             td.innerHTML = chart.categoryAxis.title;
    //             tr.appendChild(td);
    //             for (var i = 0; i < chart.graphs.length; i++) {
    //               td = document.createElement('th');
    //               td.innerHTML = chart.graphs[i].title;
    //               tr.appendChild(td);
    //             }
    //           }

    //           // add rows
    //           tr = document.createElement("tr");
    //           table.appendChild(tr);
    //           td = document.createElement("td");
    //           td.className = "row-title";
    //           td.innerHTML = chart.dataProvider[x][chart.categoryField];
    //           tr.appendChild(td);
    //           for (var i = 0; i < chart.graphs.length; i++) {
    //             td = document.createElement('td');
    //             td.innerHTML = chart.dataProvider[x][chart.graphs[i].valueField];
    //             tr.appendChild(td);
    //           }
    //         }

    //         // append to the document
    //         chart.containerDiv.appendChild(holder);

    //         // replace menu
    //         this.createMenu([{
    //           "class": "export-main export-close",
    //           label: "Done",
    //           click: function() {
    //             this.createMenu(this.config.menu);
    //             chart.containerDiv.removeChild(holder);
    //           }
    //         }]);
    //       }
    //     });
    // })();


    // Getting all device and user names that exist in db to enable sorting
    // DROP into ng-init
    // (function () {
    //     LoadFilters.getFilters().then(function (response) {
    //         var result = response.data;
    //         $scope.users = result.user_names;
    //         $scope.devices = result.device_names;
    //         $scope.events = result.operation_names;
    //         $scope.codes = result.result_codes;
    //     });
    // })();


    // Datepicker
    // Make the same in angular
    // var $datepicker = $('.datepicker');
    // $datepicker.datepicker({
    //     format: 'yyyy-mm-dd'
    // });


    // $scope.getThisGraphData = function(obj) {

    //     var graphId = obj[0][0].id;

    //     LoadThisGraphData.getThisGraphData(graphId).then(function (response) {
    //         // console.log(response.data);
    //         var graphData = response.data;
    //         $scope.title = graphData.title;
    //         $scope.description = graphData.description;
    //         // $scope.avg_max = graphData.params.avg_max;
    //         $scope.granularityTest = graphData.params[0].granularity.value;
    //         $scope.granularityOptions = graphData.params[0].granularity.options;
    //         $scope.startTime = graphData.params[1].startTime;

    //         $scope.userTest = graphData.params[3].user;
    //         $scope.deviceTest = graphData.params[4].device;
    //         $scope.eventTest = graphData.params[5].event;
    //         $scope.resultTest = graphData.params[6].result_code;


    //         // console.log(graphData);

    //         // Turn on for TEST section
    //         // $scope.graphId = graphId;
    //     });
    // };

    // Clicking on graph add div with set of controls

    // tweaking controls set parameters for the data to be uploaded

    // get the data


    // $scope.getFilteredUser = function (data) {
    //     $scope.filteredItem = data;
    // };

    // $scope.user_names = { name: 'user names', table: 'user'};
    // $scope.device_names = { name: 'device names', table: 'device'};
    // $scope.event_types = { name: 'event types', table: 'event'};
    // $scope.result_codes = { name: 'result codes', table: 'result'};



}]);



