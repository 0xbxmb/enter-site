(function () {
    'use strict';
    angular.module('enter').service('workplaces', ['tickets', '$timeout', function (tickets, $timeout) {

        var self = this,
            idCounter = 0,

            updateEndSeconds = function () {
                if (!(this instanceof Workplace)) {
                    return;
                }

                if (this.Future.length) {
                    this.QueueEndSeconds = tickets.getCurrentSecond() + tickets.getAvgServiceSecond() * (this.Future.length * 2);
                } else {
                    this.QueueEndSeconds = 0;
                }
            },

            updateTickets = function () {
                if (!(this instanceof Workplace) || !this.Future) {
                    return;
                }

                var ticket;
                for (var i = 0, length = this.Future.length; i < length; i += 1) {
                    ticket = this.Future[i];
                    ticket.updateProcessTime(i);
                }
            },

            getInterval = function (sec) {
                var k = 3;
                sec *= 1000;
                return tickets.random(sec / k, sec * k);
            },
            simulateOperator = function (workplace) {
                $timeout.cancel(workplace.operatorTimeout);

                var ticket = workplace.Ticket;
                if (ticket && ticket.isInvited()) {
                    workplace.process();
                } else if (ticket && ticket.isProcessed() && workplace.Future.length === 0) {
                    workplace.Ticket = null;
                    workplace.processed();
                } else {
                    workplace.invite();
                    workplace.processed();
                }

                workplace.interval = getInterval(tickets.getAvgServiceSecond());
                if (workplace.Future >= 12) {
                    workplace.interval /= 2;
                } else if (workplace.Future <= 4) {
                    workplace.interval *= 2;
                }

                workplace.operatorTimeout = $timeout(simulateOperator.bind(null, workplace), workplace.interval);
            },
            simulateQueue = function (workplace) {
                $timeout.cancel(workplace.queueTimeout);

                workplace.add();

                var interval = getInterval(tickets.getAvgApearingSeconds());
                if (workplace.Future >= 12) {
                    interval *= 3;
                } else if (workplace.Future <= 4) {
                    interval /= 2;
                }

                workplace.queueTimeout = $timeout(simulateQueue.bind(null, workplace), interval);
            };

        function Workplace(user, name) {
            if (!(this instanceof Workplace)) {
                return new Workplace(user, name);
            }

            this.Id = idCounter;
            this.User = user;
            this.Name = name;

            idCounter += 1;
        }

        Workplace.prototype.invite = function () {
            if (!this.Future.length) {
                return;
            }

            this.Ticket = this.Future.shift().invite();

            updateEndSeconds.call(this);
            updateTickets.call(this);
        };

        Workplace.prototype.process = function () {
            if (!this.Ticket || !this.Ticket.isInvited()) {
                return;
            }

            this.Ticket.process();
        };

        Workplace.prototype.add = function () {
            var ticket = tickets.getTicket();

            if (!this.Future) {
                this.Future = [];
            }
            ticket.updateProcessTime(this.Future.length);
            this.Future.push(ticket);

            updateEndSeconds.call(this);
        };

        Workplace.prototype.processed = function () {
            this.CompletedCount += 1;
            this.operatingTime += this.interval / 1000;
            this.AverageOperating = this.operatingTime / this.CompletedCount;
        };

        this.items = [];

        this.simulateWork = function () {
            this.items.forEach(function (workplace) {
                workplace.interval = getInterval(tickets.getAvgServiceSecond());
                workplace.operatorTimeout = $timeout(simulateOperator.bind(null, workplace), workplace.interval);
                workplace.queueTimeout = $timeout(simulateQueue.bind(null, workplace), getInterval(tickets.getAvgApearingSeconds()));
            });
        };

        (function init() {
            self.items.push(
                new Workplace("Павел Остапенко", "Окно 1"),
                new Workplace("Евгения Колобова", "Окно 2"),
                new Workplace("Валентин Маклаков", "Окно 3")
            );

            self.items.forEach(function (workplace) {
                workplace.Ticket = tickets.getTicket().process();
                workplace.Future = tickets.getTickets(tickets.random(3, 18));
                workplace.QueueEndSeconds = workplace.Future[workplace.Future.length - 1].Seconds;
                workplace.CompletedCount = 0;
                workplace.operatingTime = workplace.CompletedCount * tickets.getAvgServiceSecond();
                workplace.AverageOperating = workplace.operatingTime / workplace.CompletedCount;
            });
        }());
    }]);
})();
