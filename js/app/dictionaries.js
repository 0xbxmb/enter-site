(function () {
    'use strict';
    angular.module('enter').service('dictionaries', function () {
        var DEFAULT_COLOR = '#d0dbdd',
            _getById = function (source, id) {
                var result = $.grep(source, function (e) {
                    return e.Id === id;
                });
                return result.length > 0 ? result[0] : null;
            };

        this.products = [
            {
                Id: "500988d3-b027-4217-a99b-c9585b53df48",
                Color: "#ff7f00"
            }
        ];

        this.getProductServiceTime = function () {
            return 1;
        };
        this.getProductMaxServiceTime = function () {
            return 1;
        };
        this.getProductMinServiceTime = function () {
            return 1;
        };
        this.getProductColorById = function (id) {
            var color = DEFAULT_COLOR;

            if (id) {
                var result = _getById(this.products, id);
                if (result) {
                    return result.Color || color;
                }
            }

            return color;
        };
    });
})();