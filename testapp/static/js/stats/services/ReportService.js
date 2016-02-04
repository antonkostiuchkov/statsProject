Stats.factory('ReportService', ['LoadReportData', function(LoadReportData){

    var createReport = function () {

        var getData = LoadReportData.get().then(function (response) {

            // $scope.isDisabled = true;
            $('#report-table').prepend('<thead><tr><th>Objects</th><th>Enabled</th><th>Disabled</th></tr></thead>');

            // $scope.objects = response.data;

            return response.data;

        });
        return getData;

    };

    return {
        createReport: createReport
    };
}]);