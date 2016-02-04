// angular.module('directive.loader', [])

//     .directive('loader', ['$http' ,function ($http) {
//         return {
//             restrict: 'E',
//             template: '<div class="loader"><div class="content"><div class="stick"></div><div class="stick"></div><div class="stick"></div><div class="stick"></div><div class="stick"></div><div class="stick"></div><h1 class="loader-text">Loading...</h1></div></div>',
//             link: function (scope, elm, attrs) {
//                 scope.isLoading = function () {
//                     return $http.pendingRequests.length > 0;
//                 };
//                 scope.$watch(scope.isLoading, function (v) {
//                     if(v){
//                         elm.show();
//                     }else{
//                         elm.hide();
//                     }
//                 });
//             }
//         };
//     }]);



Stats.directive('loader', ['$http', '$timeout' ,function ($http, $timeout) {

    function linker (scope, element, attr) {

        var hasRegistered = false;

        scope.show = function () {
            if (hasRegistered) return;
            hasRegistered = true;
            $timeout(callAtTimeout, 3000);
        };

        function callAtTimeout() {
            var inputVal = element.context.lastChild.value;

            if (!inputVal) {
                hasRegistered = false;
            } else {

                url = '/Stats/filter/' + scope.from.table + '/' + inputVal;
                // console.log(url);

                $http.get(url).then(function (response) {

                    scope.directUpload({
                        data: response.data
                    });

                    hasRegistered = false;
                }, function () {
                    hasRegistered = false;
                });
            };
        };
    };

    return {
        restrict: 'E',
        scope: {
            from: '=',
            directUpload: '&'
        },
        link: linker,
        template: '<input class="loader" type="text" ng-model="selectedItem" ng-keyup="show()">'


    };
}]);

Stats.directive('open', function(){

    var linker = function (scope, element, attrs) {
        // scope.container = element[0];
        // scope.container = 'yo';
        // console.log(scope.container);
        scope.openSettings = function (event) {
            var wrapperDiv = angular.element(event.currentTarget).parents('.wrapper');
            wrapperDiv.toggleClass('open');
        };
    };

    return {
        restrict: 'A',
        link: linker
    };
});