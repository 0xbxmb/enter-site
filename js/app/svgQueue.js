(function () {
    'use strict';
    angular.module('enter').directive('svgQueue', function ($compile, $rootScope, $timeout, dictionaries) {
        var radius = 4,
            strokeWidth = 0.8,
            maxWidthS = 51,
            startX = 70,
            paddingX = 16,
            paddingY = 1,

            currentState = {
                invited: 4,
                progress: 5
            },

            sinusoidWidth = d3.scale.linear().range([36, maxWidthS]),
            inlineWidth = d3.scale.linear().range([51, 135]),

            tooltip = {
                'popover-border-color': function (d) {
                    return getColor(d.ProductId);
                },
                'popover-data': function (d) {
                    return 'ticketById("' + d.Id + '")';
                },
                'popover-animation': false,
                'ticket-popover': ''
            },

            getFloors = function (tools, data) {
                var length = data.length,
                    totalWidth = startX;

                if (length > 16) {
                    return 3;
                }

                while (length) {
                    length -= 1;
                    totalWidth += inlineWidth(dictionaries.getProductServiceTime(data[length].ProductId));

                    if ((totalWidth + 30) > tools.svgWidth) { // +30 т.к. уходит последний талон за край svg
                        totalWidth = startX + (maxWidthS + paddingX) * ((data.length + 0.5) / 2); // 0.5 для запаса
                        return totalWidth > tools.svgWidth ? 3 : 2;
                    }
                }

                return 1;
            },

            getRectHeight = function (floors) {
                var baseHeight = 17;
                return floors > 1 ? baseHeight : baseHeight * 2;
            },

            getRadius = function (floors) {
                var baseRadius = 2;
                return floors > 1 ? baseRadius : baseRadius * 2;
            },

            getFontSize = function (floors) {
                return floors > 1 ? 12 : 16;
            },

            getColor = function (productId) {
                return dictionaries.getProductColorById(productId);
            },

            getNumber = function (d) {
                return d.Number[0] + ' ' + d.Number[1];
            },

            key = function (d) {
                return d.Id;
            },

            calcWidth = function (d, floors) {
                var time = dictionaries.getProductServiceTime(d.ProductId);
                time = !time || isNaN(time) || time === 0 ? 0 : time;

                if (floors === 1) {
                    return inlineWidth(time);
                }

                return sinusoidWidth(time);
            },

            drawCurrentTimer = function (tools, array, scope, height) {
                var timer,
                    data = (function () {
                        if (array.length > 0 && array[0].State === currentState.progress) {
                            return array;
                        }

                        return [];
                    }());

                timer = tools.html.selectAll('timer.current')
                    .data(data, key);

                timer.exit()
                    .each(function () {
                        scope.$broadcast('timer-stop');
                    })
                    .remove();

                //TODO $destroy
                timer.enter()
                    .append('timer')
                    .attr({
                        'start-time': function (d) {
                            var date = new Date(),
                                now = Date.now(),
                                result;
                            date.setHours(0);
                            date.setMinutes(0);
                            date.setSeconds(d.Seconds);
                            result = date.getTime();
                            return result > now ? now : result;
                        },
                        'class': function (d) {
                            var norm = dictionaries.getProductServiceTime(d.ProductId) * 60,
                                date = new Date(),
                                secs = date.getSeconds() + (60 * date.getMinutes()) + (60 * 60 * date.getHours()),
                                actual = Math.abs(secs - d.Seconds);

                            return actual > norm ? 'current warning' : 'current';
                        },
                        interval: "1000"
                    })
                    .style({
                        top: (tools.svgHeight / 2 + height / 2 - 1) + 'px'
                    })
                    .text('{{hours < 10 ? "0" + hours : hours}}:{{minutes < 10 ? "0" + minutes : minutes}}:{{seconds < 10 ? "0" + seconds : seconds}}')
                    .each(function () {
                        $compile(this)(scope);
                    });
            },

            drawCurrent = function (tools, scope) {
                var width = 54,
                    height = 34,
                    array = scope.model.Ticket ? [scope.model.Ticket] : [],
                    showEmpty = !scope.model.Ticket && scope.model.Future && scope.model.Future.length > 0,
                    current, g;

                current = tools.svg.selectAll('g.current')
                    .data(array, key);

                current.exit().remove();

                g = current.enter()
                    .append('g')
                    .attr({
                        class: 'current ticket',
                        product: function (d) {
                            return d.ProductId;
                        }
                    });

                g.append('rect')
                    .attr({
                        rx: radius,
                        width: width - strokeWidth * 2,
                        height: height - strokeWidth * 2,
                        transform: "translate(" + 0 + "," + (tools.svgHeight / 2 + strokeWidth - height / 2) + ")"
                    })
                    .style({
                        fill: function (d) {
                            return d.State === currentState.progress ? getColor(d.ProductId) : '#fff';
                        },
                        'stroke-width': strokeWidth,
                        stroke: function (d) {
                            return getColor(d.ProductId);
                        }
                    });

                g.append('text')
                    .attr({
                        transform: "translate(" + width / 2 + "," + tools.svgHeight / 2 + ")",
                        dy: '.35em'
                    })
                    .style({
                        fill: function (d) {
                            return d.State === currentState.progress ? '#fff' : getColor(d.ProductId);
                        }
                    })
                    .text(function (d) {
                        return getNumber(d);
                    });

                current.select('rect')
                    .style({
                        fill: function (d) {
                            return d.State === currentState.progress ? getColor(d.ProductId) : '#fff';
                        }
                    });

                current.select('text')
                    .style({
                        fill: function (d) {
                            return d.State === currentState.progress ? '#fff' : getColor(d.ProductId);
                        }
                    });

                if (showEmpty && tools.svg.selectAll('rect.empty-current')[0].length === 0) {
                    tools.svg.append("rect")
                        .attr({
                            rx: radius,
                            width: width - strokeWidth * 2,
                            height: height - strokeWidth * 2,
                            class: 'empty-current',
                            transform: "translate(" + 2 + "," + (tools.svgHeight / 2 - (height - strokeWidth * 2) / 2) + ")"
                        })
                        .style({
                            fill: '#fff',
                            stroke: dictionaries.defaultProductColor,
                            'stroke-width': strokeWidth
                        });
                } else if (!showEmpty) {
                    tools.svg.select('rect.empty-current').remove();
                }

                if (scope.model.Break && tools.svg.selectAll('text.pause')[0].length === 0) {
                    tools.svg.append('text')
                        .attr({
                            class: 'pause',
                            transform: "translate(" + (2 + (width - strokeWidth * 2) / 2) + "," + (tools.svgHeight / 2) + ")",
                            dy: '.35em'
                        })
                        .text('\uf04c');
                } else if (!scope.model.Break) {
                    tools.svg.selectAll('text.pause').remove();
                }

                drawCurrentTimer(tools, array, scope, height);
            },

            inlineX = function (x, data, index, floors, isText) {
                var padding = 2,
                    i = 0;

                for (i; i < index; i += 1) {
                    x += (padding + calcWidth(data[i], floors));
                }

                if (isText) {
                    x += calcWidth(data[i], floors) / 2;
                }

                return x;
            },

            sinusoidX = function (x, data, index, floors, isText) {
                var paddingX = 16,
                    i = 1;

                for (i; i < index + 1; i += 1) {
                    if (i % floors === 0) {
                        x += (paddingX + maxWidthS);
                    }
                }

                if (isText) {
                    x += (calcWidth(data[index], floors) / 2);
                }

                return x;
            },

            calcX = function (data, index, floors, isText) {
                if (floors === 1) {
                    return inlineX(startX, data, index, floors, isText);
                } else {
                    return sinusoidX(startX, data, index, floors, isText);
                }
            },

            inlineY = function (svgHeight, height, isText) {
                var y = svgHeight / 2 + strokeWidth;
                if (!isText) {
                    y -= height / 2;
                }
                return y;
            },

            sinusoidY = function (svgHeight, height, index, floors, isText) {
                var upToDown = true,
                    i = 1,
                    y;

                y = (svgHeight / 2) - (height * floors + paddingY * (floors - 1)) / 2;

                if (isText) {
                    y += height / 2;
                }

                for (i; i < index + 1; i += 1) {
                    var refocus = i % floors === 0;

                    if (refocus) {
                        upToDown = !upToDown;
                    }

                    if (!refocus) {
                        var diff = height + paddingY;
                        if (!upToDown) {
                            diff *= -1;
                        }
                        y += diff;
                    }
                }

                return y;
            },

            calcY = function (index, floors, height, svgHeight, isText) {
                if (floors === 1) {
                    return inlineY(svgHeight, height, isText);
                } else {
                    return sinusoidY(svgHeight, height, index, floors, isText);
                }
            },

            curvePath = function (points) {
                var path = "C";

                points.forEach(function (point) {
                    path += point.x + ',' + point.y + ' ';
                });

                return path;
            },

            linePath = function (x, y) {
                return 'L' + x + ',' + y + ' ';
            },

            calcPath = function (x1, y1, x2, y2, height, top) {
                var path, y;

                function getY() {
                    return top ? y + radius : y - radius;
                }

                path = 'M' + x1 + ',' + y1 + ' ';

                y = top ? Math.min(y1, y2) - height : Math.max(y1, y2) + height;

                path += linePath(x1, getY());
                path += curvePath(
                    [
                        {x: x1, y: y},
                        {x: x1, y: y},
                        {x: x1 + radius, y: y}
                    ]
                );
                path += linePath(x2 - radius, y);
                path += curvePath(
                    [
                        {x: x2, y: y},
                        {x: x2, y: y},
                        {x: x2, y: getY()}
                    ]
                );
                path += linePath(x2, y2);

                return path;
            },

            calcPaths = function (tools, data, floors) {
                var height = getRectHeight(floors),
                    arcHeight = 6,
                    length = data.length, i = 0,
                    top = false,
                    result = [],
                    ticket,
                    startY = (tools.svgHeight / 2) - (height * floors + paddingY * (floors - 1)) / 2,
                    x = startX,
                    x1 = 27, y1 = (tools.svgHeight / 2) - 17, // 27 и 17 половины длины и высоты текущего талона
                    x2, y2;

                if (floors === 1 && data.length) {
                    var y = tools.svgHeight / 2,
                        line = "M" + (x - paddingX) + "," + y + " " + linePath(x, y);
                    result.push({ id: 1, data: line });

                    return result;
                }

                function calcY() {
                    var diff = height + paddingY;
                    if (!top) {
                        diff *= -1;
                    }
                    startY += diff;
                    return startY;
                }

                for (i; i < length; i += 1) {
                    ticket = data[i];
                    var refocus = i % floors === 0;

                    if (refocus) {
                        top = !top;

                        if (i !== 0) {
                            y1 = top ? startY - strokeWidth : startY + height - strokeWidth * 1.5;
                        }

                        x += i === 0 ? 0 : (paddingX + maxWidthS);
                        x2 = x + calcWidth(ticket, floors) / 2;
                        y2 = top ? startY + strokeWidth - paddingY : startY + height - paddingY;

                        var path = calcPath(x1, y1, x2, y2, arcHeight, top);
                        result.push({ id: i, data: path });
                    } else if (i !== 0) {
                        calcY();
                    }

                    x1 = x + calcWidth(ticket, floors) / 2;
                }

                return result;
            },

            drawLines = function (tools, data, floors) {
                var pathsData = calcPaths(tools, data, floors),
                    paths = tools.queueGroup.lineGroup.selectAll('path.line')
                        .data(pathsData, function (d) {
                            return d.id;
                        });

                paths.exit().remove();

                paths.enter()
                    .append("path")
                    .attr({
                        d: function (d) {
                            return d.data;
                        },
                        class: 'line'
                    })
                    .style({
                        opacity: 0
                    })
                    .transition()
                    .duration(300)
                    .style({
                        opacity: 1
                    });

                paths
                    .attr({
                        d: function (d) {
                            return d.data;
                        }
                    });
            },

            getEndTimeY = function (floors) {
                switch (floors) {
                    case 1:
                        return 20;
                    case 2:
                        return 26;
                    default:
                        return 34;
                }
            },

            drawEndTime = function (tools, floors, scope) {
                var time,
                    array = scope.model.QueueEndSeconds ? [scope.model.QueueEndSeconds] : [],
                    getEndTime = function (array) {
                        if (array.length === 0) {
                            return null;
                        }

                        var date = new Date();
                        date.setHours(0);
                        date.setMinutes(0);
                        date.setSeconds(array[0]);

                        return date.getTime();
                    };

                scope.endTime = getEndTime(array);

                time = tools.html.selectAll('timer.end')
                    .data(array);

                time.exit()
                    .each(function () {
                        scope.$broadcast('timer-stop');
                    })
                    .remove();

                time.enter()
                    .append('timer')
                    .style({
                        position: 'absolute',
                        left: startX + 'px',
                        top: (tools.svgHeight / 2 + getEndTimeY(floors)) + 'px',
                        'font-size': 12
                    })
                    .attr({
                        class: 'end',
                        'end-time': 'endTime'
                    })
                    .text('Очередь закончится через ' + '{{hours ? hours + " ч " : ""}}{{minutes + " мин "}}{{hours ? "" : seconds + " сек"}}')
                    .each(function () {
                        $compile(this)(scope);
                    });

                time.animate(300)
                    .style({
                        top: (tools.svgHeight / 2 + getEndTimeY(floors)) + 'px'
                    })
                    .each(function () {
                        scope.$broadcast('timer-start');
                    });
            },

            drawQueue = function (tools, scope) {
                var data = scope.model.Future || [],
                    floors = getFloors(tools, data),
                    height = getRectHeight(floors),
                    tickets, timeout;

                tickets = tools.queueGroup.selectAll('g.ticket')
                    .data(data, key);

                var groups = tickets
                    .enter()
                    .append('g')
                    .attr({
                        'class': 'ticket',
                        product: function (d) {
                            return d.ProductId;
                        }
                    })
                    .style({
                        opacity: 0
                    })
                    .on("mouseover", function (d) {
                        if (timeout) {
                            $timeout.cancel(timeout);
                        }
                        tools.stopRender = true;
                        scope.$broadcast('timer-stop');

                        var ticket = d3.select(this);
                        ticket.select('rect').style('fill', getColor(d.ProductId));
                        ticket.select('text').style('fill', '#fff');

                        var parentPosition = tools.element.position(),
                            position = $(this).position(),
                            elementRect = this.getBoundingClientRect(),
                            left = position.left + parentPosition.left + tools.marginLeft + elementRect.width / 2,
                            top = position.top + parentPosition.top + tools.marginTop + elementRect.height;

                        $rootScope.$broadcast('svgQueue.ticketHovered', {
                            position: {
                                top: top,
                                left: left
                            },
                            content: angular.extend(
                                {},
                                d,
                                {
                                    color: getColor(d.ProductId)
                                }
                            )
                        });
                    })
                    .on("mouseout", function (d) {
                        var ticket = d3.select(this);
                        ticket.select('rect').style('fill', 'transparent');
                        ticket.select('text').style('fill', getColor(d.ProductId));

                        $rootScope.$broadcast('svgQueue.ticketRest', d.Id);

                        timeout = $timeout(function () {
                            tools.stopRender = false;
                            scope.$broadcast('timer-resume');
                            tools.render();
                        }, 100);
                    });

                groups.fadeIn(200);

                groups.append("rect")
                    .attr({
                        rx: getRadius(floors),
                        width: function (d) {
                            return calcWidth(d, floors) - strokeWidth * 2;
                        },
                        height: height - strokeWidth * 2,
                        x: function (d, i) {
                            return calcX(data, i, floors, false);
                        },
                        y: function (d, i) {
                            return calcY(i, floors, height, tools.svgHeight, false);
                        }
                    })
                    .style({
                        fill: 'transparent',
                        stroke: function (d) {
                            return getColor(d.ProductId);
                        },
                        'stroke-width': strokeWidth
                    });

                groups.append("text")
                    .attr({
                        x: function (d, i) {
                            return calcX(data, i, floors, true);
                        },
                        y: function (d, i) {
                            return calcY(i, floors, height, tools.svgHeight, true);
                        },
                        dy: '.35em'
                    })
                    .style({
                        fill: function (d) {
                            return getColor(d.ProductId);
                        },
                        'font-size': getFontSize(floors)
                    })
                    .text(function (d) {
                        return getNumber(d);
                    });

                tickets.select('rect')
                    .animate(300)
                    .attr({
                        rx: getRadius(floors),
                        width: function (d) {
                            return calcWidth(d, floors) - strokeWidth * 2;
                        },
                        height: height - strokeWidth * 2,
                        x: function (d, i) {
                            return calcX(data, i, floors, false);
                        },
                        y: function (d, i) {
                            return calcY(i, floors, height, tools.svgHeight, false);
                        }
                    })
                    .style({
                        fill: 'transparent',
                        stroke: function (d) {
                            return getColor(d.ProductId);
                        },
                        'stroke-width': strokeWidth
                    });

                tickets.select('text')
                    .animate(300)
                    .attr({
                        x: function (d, i) {
                            return calcX(data, i, floors, true);
                        },
                        y: function (d, i) {
                            return calcY(i, floors, height, tools.svgHeight, true);
                        }
                    })
                    .style({
                        fill: function (d) {
                            return getColor(d.ProductId);
                        },
                        'font-size': getFontSize(floors)
                    })
                    .text(function (d) {
                        return getNumber(d);
                    });

                tickets.exit().remove();

                drawLines(tools, data, floors);

                drawEndTime(tools, floors, scope);
            },

            link = function (scope, element) {
                var tools = {},
                    min = dictionaries.getProductMinServiceTime(),
                    max = dictionaries.getProductMaxServiceTime();

                sinusoidWidth.domain([min, max]);
                inlineWidth.domain([min, max]);

                tools.element = element;
                tools.marginLeft = parseInt(element.css('margin-left'), 10);
                tools.marginTop = parseInt(element.css('margin-top'), 10);

                tools.svgWidth = scope.width || 300;
                tools.svgHeight = scope.height;

                tools.svg = d3.select(element.context)
                    .append("svg")
                    .attr({
                        width: tools.svgWidth,
                        height: tools.svgHeight,
                        class: 'workplace-queue'
                    });

                tools.html = d3.select(element.context)
                    .append('div')
                    .attr({
                        class: 'html'
                    });

                tools.queueGroup = tools.svg.append('g')
                    .attr("class", "queue");

                tools.queueGroup.lineGroup = tools.svg.append('g')
                    .attr("class", "lines");

                tools.render = function () {
                    drawCurrent(tools, scope);
                    drawQueue(tools, scope);
                };

                scope.$watch('width', function (width) {
                    tools.svgWidth = width;
                    tools.svg.attr('width', width);
                    if (scope.model && scope.model.Future) {
                        drawQueue(tools, scope);
                    }
                });

                scope.$watch('model', function (model) {
                    if (model && !tools.stopRender) {
                        tools.render();
                    }
                }, true);

                scope.ticketById = function (id) {
                    var result = {};

                    if (scope.model && scope.model.Future) {
                        scope.model.Future.some(function (item) {
                            if (item.Id === id) {
                                result = item;
                                return true;
                            }
                        });
                    }

                    return result;
                };

                scope.$on('svg-queue.highlight-product', function ($event, id) {
                    if (!id) {
                        return;
                    }
                    tools.svg.selectAll('g.ticket[product="' + id + '"]')
                        .transition()
                        .duration(100)
                        .style('opacity', 1);
                    tools.svg.selectAll('g.ticket:not([product="' + id + '"])')
                        .transition()
                        .duration(100)
                        .style('opacity', 0.4);
                });

                scope.$on('svg-queue.clear-highlighting', function () {
                    tools.svg.selectAll('g.ticket')
                        .transition()
                        .duration(150)
                        .style('opacity', 1);
                });
            };

        return {
            restrict: 'A',
            scope: {
                model: '=',
                width: '=',
                height: '@'
            },
            replace: true,
            link: link
        };
    });
})();