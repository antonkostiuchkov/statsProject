Stats.factory('LoadGraphData', ['$http', function($http) {

    var getGraphData = function (queryParams) {

        var url = '/Stats/data_query/';

        var getData = $http({method: 'GET', url: url, params: {queryParams}}).then(function (response){
            // If response from server has no values
            // if (response.data.data.length === 0) {
            //     alert("No data");
            // };

            // Axis names
            var data = response.data.data;
            // var data = response.data;
            var keyNames = Object.keys(data[0]);
            var x = keyNames[0];
            var y = keyNames[1];
            var z = keyNames[2];
            var avg = keyNames[3];
            var max = keyNames[4];

            return [data, x, y, z, avg, max];
            // return data;
        });

        return getData;
    };

    return {
        getGraphData: getGraphData
    };
}]);





Stats.factory('LoadReportData', ['$http', function($http) {

    var getReportData = function () {

        var url = '/Stats/report_data/';

        return $http.get(url).then(function(response){

            return response;
        });
    };

    return {
        getReportData: getReportData
    };
}]);



Stats.factory('LoadFilters', ['$http', '$cacheFactory', function($http, $cacheFactory) {

    var getFilters = function () {

        var url = '/Stats/query_names/';

        return $http.get(url, { cache: true }).then(function(response){
            var $httpDefaultCache = $cacheFactory.get('$http');
            var cachedData = $httpDefaultCache.get('/Stats/queryNames/');
            // console.log(cachedData);

            return response;
        });
    };

    return {
        getFilters: getFilters
    };
}]);


Stats.factory('LoadGraphList', ['$http', function($http) {

    var getGraphList = function () {

        var url = '/Stats/stats_list/';

        return $http.get(url).then(function(response){
            return response;
        });
    };

    return {
        getGraphList: getGraphList
    };
}]);

Stats.factory('LoadThisGraphData', ['$http', function($http) {

    var getThisGraphData = function (requestedGraph) {


        // var url = '/Stats/stats_config/';

        var url = '/Stats/stats_config/graph/' + requestedGraph + '/';

        return $http.get(url, { cache: true }).then(function(response){

            return response;
        });
    };

    return {
        getThisGraphData: getThisGraphData
    };
}]);
