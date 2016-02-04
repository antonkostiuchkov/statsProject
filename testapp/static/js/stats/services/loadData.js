Stats.factory('LoadGraphData', ['$http', function($http) {

    return {
        get: function (granularity, start, end, grouping, AVG, MAX, user_name, result_code, device_id, action_code) {

            // if (device_id === null || device_id === undefined) {
            //     device_id = 'all';
            // };
            // if (action_code === null || action_code === undefined) {
            //     action_code = '999';
            // };

            var url = '/Stats/query/' + granularity + '/' + start + '/' + end + '/' + grouping + '/' + AVG + '/' + MAX + '/' + user_name + '/' + result_code + '/' + device_id + '/' + action_code;


            console.log(url);

            return $http.get(url).then(function(response){

                // If response from server has no values
                if (response.data.length === 0) {
                    alert("No data");
                };

                // Axis names
                var data = response.data;
                var keyNames = Object.keys(data[0]);
                var x = keyNames[0];
                var y = keyNames[1];
                var z = keyNames[2];
                var avg = keyNames[3];
                var max = keyNames[4];

                return [data, x, y, z, avg, max];
            });
        }
    }
}]);





Stats.factory('LoadReportData', ['$http', function($http) {

    return {
        get: function () {

            var url = '/Stats/queryConfig/';

            return $http.get(url).then(function(response){

                return response;
            });
        }
    }
}]);



Stats.factory('LoadFilters', ['$http', '$cacheFactory', function($http, $cacheFactory) {

    return {
        get: function () {

            var url = '/Stats/queryNames/';

            return $http.get(url, { cache: true }).then(function(response){
                var $httpDefaultCache = $cacheFactory.get('$http');
                var cachedData = $httpDefaultCache.get('/Stats/queryNames/');
                // console.log(cachedData);

                return response;
            });
        }
    }
}]);