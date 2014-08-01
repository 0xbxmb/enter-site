(function () {
    'use strict';

    angular.module('enter', ['timer']);

    angular.module('enter').controller('main', ['$scope', 'dictionaries', 'workplaces', function ($scope, dictionaries, workplaces) {
        $scope.items = workplaces.items;
        $scope.products = dictionaries.products;
        $scope.over = function (id) {
            $scope.$broadcast("svg-queue.highlight-product", id);
        };
        $scope.leave = function () {
            $scope.$broadcast("svg-queue.clear-highlighting");
        };

        $scope.$on('svgQueue.ticketHovered', function ($e, data) {
            $scope.$broadcast('ticketPopoverPopup.show', data);
        });

        $scope.$on('svgQueue.ticketRest', function ($e, data) {
            $scope.$broadcast('ticketPopoverPopup.hide', data);
        });

        workplaces.simulateWork();
    }]);
})();