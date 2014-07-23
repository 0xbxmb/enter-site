(function () {
    'use strict';
    angular.module('enter').service('dictionaries', function () {
        var DEFAULT_COLOR = '#d0dbdd',
            _getById = function (source, id) {
                var result = $.grep(source, function (e) {
                    return e.Id === id;
                });
                return result.length > 0 ? result[0] : null;
            },
            _getName = function (source, id) {

                if (!source) {
                    return "Не определено";
                }

                var result = _getById(source, id);

                if (result) {
                    return result.Name.replace(/&nbsp;/g, ' ');
                }

                return "Не определено";
            };

        this.products = [
            {
                Id: "1",
                Color: "#ffc22e",
                Name: 'Постановка физического лица на учет в налоговом органе',
                prefix: 'A',
                DefaultServiceSeconds: 300
            },
            {
                Id: "2",
                Color: "#e27e98",
                Name: 'Подача налоговой декларации по налогу на доходы физических лиц',
                prefix: 'B',
                DefaultServiceSeconds: 400
            },
            {
                Id: "3",
                Color: "#5bd77f",
                Name: 'Регистрация физического лица в качестве ИП',
                prefix: 'C',
                DefaultServiceSeconds: 600
            }
        ];

        this.getProductServiceTime = function (id) {
            var result = _getById(this.products, id);
            return result ? result.DefaultServiceSeconds : 300;
        };
        this.getProductMaxServiceTime = function () {
            return 800;
        };
        this.getProductMinServiceTime = function () {
            return 300;
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
        this.getProductName = function (id) {
            return _getName(this.products, id);
        };
    });
})();