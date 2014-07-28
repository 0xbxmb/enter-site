(function () {
    'use strict';

    angular.module('enter', ['timer'])
        .run(['$rootScope', 'dictionaries', 'workplaces', function ($rootScope, dictionaries, workplaces) {


        }]);

    angular.module('enter').controller('test', ['$scope', 'dictionaries', 'workplaces', function ($scope, dictionaries, workplaces) {
        $scope.items = workplaces.items;
        $scope.products = dictionaries.products;
        $scope.over = function (id) {
            $scope.$broadcast("svg-queue.highlight-product", id);
        };
        $scope.leave = function () {
            $scope.$broadcast("svg-queue.clear-highlighting");
        };

        workplaces.simulateWork();
    }]);
})();