(function () {
    'use strict';
    angular.module('enter').directive('ticketPopoverPopup', function (dictionaries, timeConverter) {
        var daySeconds = function () {
                var date = new Date(),
                    secs = date.getSeconds() + (60 * date.getMinutes()) + (60 * 60 * date.getHours());

                return secs;
            },
            productName = function (id) {
                return dictionaries.getProductName(id);
            },
            waitingTime = function (seconds) {
                var secs = daySeconds(),
                    diff = seconds - secs;

                return timeConverter.getTimeFromSeconds(diff > 0 ? diff : 0);
            },
            inQueueTime = function (seconds) {
                var secs = daySeconds(),
                    diff = secs - seconds;

                return timeConverter.getTimeFromSeconds(diff > 0 ? diff : 0);
            },
            dayTime = function (seconds) {
                return timeConverter.getTimeFromSeconds(seconds);
            };

        return {
            restrict: 'EA',
            replace: true,
            scope: {},
            link: function (scope, element) {
                var current;
                scope.$on('ticketPopoverPopup.show', function ($e, data) {
                    current = data.content.Id;
                    scope.content = data.content;
                    scope.content.productName = productName(data.content.ProductId);
                    scope.content.waitingTime = waitingTime(data.content.Seconds);
                    scope.content.inQueueTime = inQueueTime(data.content.StartSeconds);
                    if (scope.content.IsPending) {
                        scope.content.dayTime = dayTime(data.content.StartSeconds);
                    }

                    element.css('left', data.position.left - element.width() / 2);
                    element.css('top', data.position.top);
                    element.show();

                    if (!scope.$$phase) {
                        scope.$digest();
                    }
                });

                scope.$on('ticketPopoverPopup.hide', function ($e, id) {
                    if (current === id) {
                        element.hide();
                        scope.content = null;
                    }
                });
            },
            templateUrl: 'js/app/templates/ticketPopup.html'
        };
    });
})();