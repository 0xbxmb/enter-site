/**
 * Created by e.popov on 21.01.14.
 */

(function () {
    'use strict';

    var /**
         * Apply transition
         * @param duration
         * @param delay default 0
         * @returns {*}
         */
        animate = function (duration, delay) {
            if (delay === null || delay === undefined) {
                return animate.call(this, duration, 0);
            }

            return this.transition()
                .delay(delay)
                .duration(duration);
        },

        /**
         * Hide element
         * @param duration default 0
         * @param opacity default 0
         */
        fadeOut = function (duration, opacity) {
            if (!duration && duration !== 0) {
                return fadeOut.call(this, 0, opacity);
            }

            if (!opacity && opacity !== 0) {
                return fadeOut.call(this, duration, 0);
            }

            return this
                .animate(duration)
                .style({
                    opacity: opacity
                });
        },
        /**
         * Show Element
         * @param duration default 0
         * @param opacity default 1
         */
        fadeIn = function (duration, opacity) {
            if (!duration && duration !== 0) {
                return fadeIn.call(this, 0, opacity);
            }

            if (!opacity && opacity !== 0) {
                return fadeIn.call(this, duration, 1);
            }

            return this
                .animate(duration)
                .style({
                    opacity: opacity
                });
        },

        translate = function (x, y) {
            return 'translate(' + x + ', ' + y + ')';
        };

    d3.selection.prototype.animate = animate;
    d3.selection.prototype.fadeOut = fadeOut;
    d3.selection.prototype.fadeIn = fadeIn;

    d3.transition.prototype.animate = animate;

    d3.utils = {};
    d3.utils.translate = translate;
})();
