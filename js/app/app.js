(function () {
    'use strict';

    angular.module('enter', ['ui.bootstrap.position', 'timer'])
        .run(['$rootScope', 'dictionaries', 'tickets', function ($rootScope, dictionaries, tickets) {

            var getWorkplaces = function () {
                    var workplaces = [
                        {
                            User: "Иван Сергеев",
                            Id: 1,
                            Name: "Окно 1"
                        },
                        {
                            User: "Евгения Колобова",
                            Id: 2,
                            Name: "Окно 2"
                        },
                        {
                            User: "Валентин Маклаков",
                            Id: 3,
                            Name: "Окно 3"
                        }
                    ];

                    workplaces.forEach(function (workplace) {
                        workplace.Ticket = tickets.getTicket().process();
                        workplace.Future = tickets.getTickets(tickets.random(3, 18));
                        workplace.QueueEndSeconds = workplace.Future[workplace.Future.length - 1].Seconds;
                        workplace.CompletedCount = tickets.random(30);
                        workplace.AverageOperating = tickets.random(300, 800);
                    });

                    return workplaces;
                };

            $rootScope.items = getWorkplaces();
            $rootScope.products = dictionaries.products;
            $rootScope.over = function (id) {
                $rootScope.$broadcast("svg-queue.highlight-product", id);
            };
            $rootScope.leave = function () {
                $rootScope.$broadcast("svg-queue.clear-highlighting");
            };


        }]);
})();