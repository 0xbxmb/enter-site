(function () {
    'use strict';
    angular.module('enter').directive('ticketPopoverPopup', function (dictionaries, timeConverter) {
        var daySeconds = function () {
            var date = new Date(),
                secs = date.getSeconds() + (60 * date.getMinutes()) + (60 * 60 * date.getHours());

            return secs;
        };

        return {
            restrict: 'EA',
            replace: true,
            scope: {},
            link: function (scope) {
                scope.productName = function (id) {
                    return dictionaries.getProductName(id);
                };

                scope.waitingTime = function (seconds) {
                    var secs = daySeconds(),
                        diff = seconds - secs;

                    return timeConverter.getTimeFromSeconds(diff > 0 ? diff : 0);
                };

                scope.inQueueTime = function (seconds) {
                    var secs = daySeconds(),
                        diff = secs - seconds;

                    return timeConverter.getTimeFromSeconds(diff > 0 ? diff : 0);
                };

                scope.dayTime = function (seconds) {
                    return timeConverter.getTimeFromSeconds(seconds);
                };
            },
            templateUrl: 'js/app/templates/ticketPopup.html'
        };
    });
})();