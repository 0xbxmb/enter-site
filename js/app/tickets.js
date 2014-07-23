/**
 * Created by e.popov on 23.07.2014.
 */
(function () {
    'use strict';
    angular.module('enter').service('tickets', ['dictionaries', function (dictionaries) {
        var length = dictionaries.products.length,
            avgServiceSeconds = 420,
            avgNewTicketApearing = 60,
            idCounter = 1,
            getRandomProduct = function () {
                return dictionaries.products[Math.floor(Math.random() * length)];
            },
            self = this;

        function getCurrentSecond() {
            var date = new Date();
            return date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
        }

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

        Ticket.prototype.setSeconds = function (current, startTime, index) {
            this.StartSeconds = startTime + avgNewTicketApearing * index;
            this.Seconds = current + avgServiceSeconds * index;
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
                startSeconds = getCurrentSecond() - avgNewTicketApearing * count,
                current = getCurrentSecond();
            for (var i = 0; i < count; i += 1) {
                result.push(this.getTicket().setSeconds(current, startSeconds, i));
            }
            return result;
        };
    }]);
})();