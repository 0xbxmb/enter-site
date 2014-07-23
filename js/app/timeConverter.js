/**
 * Created by i.sungurov on 22.01.14.
 */
(function () {
    "use strict";
    angular.module('enter').service('timeConverter', function () {
        var
            measures = {
                sec: 'c',
                min: 'мин',
                hour: 'ч',
                day: 'д'
            },


            makeString = function (value1, mesure1, value2, mesure2) {

                var template = "{value1} {mesure1} {value2} {mesure2}";

//            value1 = (value1 < 10) ? "0" + value1 : value1;
                value2 = (value2 < 10) ? "0" + value2 : value2;
                return template.replace("{value1}", value1)
                    .replace("{mesure1}", mesure1)
                    .replace("{value2}", value2)
                    .replace("{mesure2}", mesure2);
            },

            getTimeFromSeconds = function (seconds) {

                var
                    min = ( 0 | (seconds / 60)),
                    hours = ( 0 | (min / 60)),
                    days = ( 0 | (hours / 24));

                if (days) {
                    return makeString(days, measures.day, (0 | (hours % 24)), measures.day);
                }
                if (hours) {
                    return makeString(hours, measures.hour, (0 | (min % 60)), measures.min);
                }

                return makeString(min, measures.min, (0 | (seconds % 60)), measures.sec);
            },

            getFullTimeFromSeconds = function (sec) {
                var sec_num = parseInt(sec, 10),
                    hours = Math.floor(sec_num / 3600),
                    minutes = Math.floor((sec_num - (hours * 3600)) / 60),
                    seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                var time = hours + ':' + minutes + ':' + seconds;
                return time;
            },

            getFullTimePoint = function(value){

                var currentDate = new Date(),
                    valDate = new Date(value);

                if(currentDate.getDate() !== valDate.getDate()){

                    var
                        dd = valDate.getDate(),
                        mm = valDate.getMonth() + 1,
                        yyyy = valDate.getFullYear();

                    if (dd < 10) {
                        dd = '0' + dd;
                    }

                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    return dd + '.' + mm + '.' + yyyy + ", в " + valDate.toLocaleTimeString();

                } else {

                    return valDate.toLocaleTimeString();

                }
            };

        return {
            getTimeFromSeconds: getTimeFromSeconds,
            getFullTimeFromSeconds: getFullTimeFromSeconds,
            getFullTimePoint: getFullTimePoint
        };
    });
})();