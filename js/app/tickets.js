/**
 * Created by e.popov on 23.07.2014.
 */
(function () {
    'use strict';
    angular.module('enter').service('tickets', ['dictionaries', function (dictionaries) {
        var length = dictionaries.products.length,
            avgServiceSeconds = 3,
            avgNewTicketApearing = 6,
            idCounter = 1,
            getRandomProduct = function () {
                return dictionaries.products[Math.floor(Math.random() * length)];
            },
            getCurrentSecond = function () {
                var date = new Date();
                return date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
            };

        function Ticket() {

            if (!(this instanceof Ticket)) {
                return new Ticket();
            }

            var product = getRandomProduct();

            if (product.count === undefined) {
                product.count = 1;
            }

            this.Id = idCounter.toString();
            this.ProductId = product.Id.toString();
            this.Number = [product.prefix, product.count];
            this.State = 3;
            this.StartSeconds = getCurrentSecond();

            idCounter += 1;
            product.count += 1;
        }

        Ticket.prototype.invite = function () {
            this.State = 4;
            return this;
        };

        Ticket.prototype.process = function () {
            this.State = 5;
            this.Seconds = getCurrentSecond();
            return this;
        };

        Ticket.prototype.isInvited = function () {
            return this.State === 4;
        };

        Ticket.prototype.isProcessed = function () {
            return this.State === 5;
        };

        Ticket.prototype.updateProcessTime = function (index) {
            this.Seconds = getCurrentSecond() + avgServiceSeconds * (index + 1);
            return this;
        };

        this.random = function (min, max) {
            if (max === undefined) {
                return this.random(0, min);
            }
            return Math.floor(Math.random() * (max - min)) + min;
        };

        this.getTicket = function () {
            return new Ticket();
        };

        this.getTickets = function (count) {
            var result = [],
                current = getCurrentSecond(),
                startSeconds = current - avgNewTicketApearing * count;

            for (var i = 0; i < count; i += 1) {
                var ticket = this.getTicket();
                ticket.StartSeconds = startSeconds + avgNewTicketApearing * i;
                ticket.Seconds = current + avgServiceSeconds * (i + 1);

                result.push(ticket);
            }
            return result;
        };

        this.getAvgServiceSecond = function () {
            return avgServiceSeconds;
        };

        this.getAvgApearingSeconds = function () {
            return avgNewTicketApearing;
        };

        this.getCurrentSecond = getCurrentSecond;
    }]);
})();