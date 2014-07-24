(function () {
    'use strict';
    angular.module('enter').directive('currentQueueInfo', ['timeConverter', function (timeConverter) {
            var
                _getWidth = function () {
                    var workplaceWrapper = $('.workplace-wrapper:first'),
                        workplaceWrapperWidth = workplaceWrapper.actual('innerWidth'),
                        workplaceWidth = workplaceWrapper.find('.workplace:first').actual('outerWidth'),
                        result = workplaceWrapperWidth - workplaceWidth;

                    return result > 0 ? result - 5 : 0; // -5px для FF
                },

                link = function ($scope) {
                    $scope.isInRest = function (workplace) {
                        return (workplace.Break === true) ? "disabled" : "";
                    };

                    $scope.getName = function (workplace) {

                        var spacePosition,
                            fullNameMaxLength = 18,
                            user = workplace.User;

                        if (!user) {
                            return 'Нет оператора';
                        }

                        if (user.length > fullNameMaxLength) {

                            spacePosition = user.indexOf(" ");
                            if (spacePosition === -1) {
                                return user;
                            }
                            return user.substr(0, spacePosition + 2) + ".";

                        } else {
                            return user;
                        }
                    };

                    $scope.getTime = timeConverter.getTimeFromSeconds;

                    $scope.$on('ngRepeatFinished', function () {
                        $scope.width = _getWidth();
                    });

                    var timeoutId;
                    angular.element(window).bind('resize', function () {

                        clearInterval(timeoutId);
                        timeoutId = setTimeout(
                            function () {
                                $scope.$apply(function () {
                                    $scope.width = _getWidth();
                                });
                            },
                            50
                        );
                    });
                };

            return {
                templateUrl: 'js/app/templates/currentQueueInfo.html',
                restrict: 'E',
                scope: {
                    activeWorkplaces: '='
                },
                replace: true,
                link: link
            };
        }]
    );
})();