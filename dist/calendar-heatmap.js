"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CalendarHeatmap = (function () {
    function CalendarHeatmap() {
        this.color = '#ff4500';
        this.overview = 'global';
        this.handler = new core_1.EventEmitter();
        // Defaults
        this.gutter = 5;
        this.item_gutter = 1;
        this.width = 1000;
        this.height = 200;
        this.item_size = 10;
        this.label_padding = 40;
        this.max_block_height = 20;
        this.transition_duration = 500;
        this.in_transition = false;
        // Tooltip defaults
        this.tooltip_width = 250;
        this.tooltip_padding = 15;
        // Overview defaults
        this.history = ['global'];
        this.selected = {};
    }
    /**
     * Check if data is available
     */
    CalendarHeatmap.prototype.ngOnChanges = function () {
        if (!this.data) {
            return;
        }
        // Update data summaries
        this.updateDataSummary();
        // Draw the chart
        this.drawChart();
    };
    ;
    /**
     * Get hold of the root element and append our svg
     */
    CalendarHeatmap.prototype.ngAfterViewInit = function () {
        var element = this.element.nativeElement;
        // Initialize svg element
        this.svg = d3.select(element)
            .append('svg')
            .attr('class', 'svg');
        // Initialize main svg elements
        this.items = this.svg.append('g');
        this.labels = this.svg.append('g');
        this.buttons = this.svg.append('g');
        // Add tooltip to the same element as main svg
        this.tooltip = d3.select(element).append('div')
            .attr('class', 'heatmap-tooltip')
            .style('opacity', 0);
        // Calculate chart dimensions
        this.calculateDimensions();
        // Draw the chart
        this.drawChart();
    };
    ;
    /**
     * Utility function to get number of complete weeks in a year
     */
    CalendarHeatmap.prototype.getNumberOfWeeks = function () {
        var dayIndex = Math.round((moment() - moment().subtract(1, 'year').startOf('week')) / 86400000);
        var colIndex = Math.trunc(dayIndex / 7);
        var numWeeks = colIndex + 1;
        return numWeeks;
    };
    ;
    /**
     * Utility funciton to calculate chart dimensions
     */
    CalendarHeatmap.prototype.calculateDimensions = function () {
        var element = this.element.nativeElement;
        this.width = element.clientWidth < 1000 ? 1000 : element.clientWidth;
        this.item_size = ((this.width - this.label_padding) / this.getNumberOfWeeks() - this.gutter);
        this.height = this.label_padding + 7 * (this.item_size + this.gutter);
        this.svg.attr({ 'width': this.width, 'height': this.height });
    };
    ;
    /**
     * Recalculate dimensions on window resize events
     */
    CalendarHeatmap.prototype.onResize = function (event) {
        this.calculateDimensions();
        if (!!this.data && !!this.data[0]['summary']) {
            this.drawChart();
        }
    };
    ;
    /**
     * Helper function to check for data summary
     */
    CalendarHeatmap.prototype.updateDataSummary = function () {
        // Get daily summary if that was not provided
        if (!this.data[0]['summary']) {
            this.data.map(function (d) {
                var summary = d['details'].reduce(function (uniques, project) {
                    if (!uniques[project.name]) {
                        uniques[project.name] = {
                            'value': project.value
                        };
                    }
                    else {
                        uniques[project.name].value += project.value;
                    }
                    return uniques;
                }, {});
                var unsorted_summary = Object.keys(summary).map(function (key) {
                    return {
                        'name': key,
                        'value': summary[key].value
                    };
                });
                d['summary'] = unsorted_summary.sort(function (a, b) {
                    return b.value - a.value;
                });
                return d;
            });
        }
    };
    /**
     * Draw the chart based on the current overview type
     */
    CalendarHeatmap.prototype.drawChart = function () {
        if (!this.svg || !this.data) {
            return;
        }
        if (this.overview === 'global') {
            this.drawGlobalOverview();
        }
        else if (this.overview === 'year') {
            this.drawYearOverview();
        }
        else if (this.overview === 'month') {
            this.drawMonthOverview();
        }
        else if (this.overview === 'week') {
            this.drawWeekOverview();
        }
        else if (this.overview === 'day') {
            this.drawDayOverview();
        }
    };
    ;
    /**
     * Draw global overview (multiple years)
     */
    CalendarHeatmap.prototype.drawGlobalOverview = function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define start and end of the dataset
        var start = moment(this.data[0]['date']).startOf('year');
        var end = moment(this.data[this.data.length - 1]['date']).endOf('year');
        // Define array of years and total values
        var data = this.data;
        var year_data = d3.time.years(start, end).map(function (d) {
            var date = moment(d);
            return {
                'date': date,
                'total': data.reduce(function (prev, current) {
                    if (moment(current.date).year() === date.year()) {
                        prev += current.total;
                    }
                    return prev;
                }, 0),
                'summary': function () {
                    var summary = data.reduce(function (summary, d) {
                        if (moment(d.date).year() === date.year()) {
                            for (var i = 0; i < d.summary.length; i++) {
                                if (!summary[d.summary[i].name]) {
                                    summary[d.summary[i].name] = {
                                        'value': d.summary[i].value,
                                    };
                                }
                                else {
                                    summary[d.summary[i].name].value += d.summary[i].value;
                                }
                            }
                        }
                        return summary;
                    }, {});
                    var unsorted_summary = Object.keys(summary).map(function (key) {
                        return {
                            'name': key,
                            'value': summary[key].value
                        };
                    });
                    return unsorted_summary.sort(function (a, b) {
                        return b.value - a.value;
                    });
                }(),
            };
        });
        // Calculate max value of all the years in the dataset
        var max_value = d3.max(year_data, function (d) {
            return d.total;
        });
        // Define year labels and axis
        var year_labels = d3.time.years(start, end).map(function (d) {
            return moment(d);
        });
        var yearScale = d3.scale.ordinal()
            .rangeRoundBands([0, this.width], 0.05)
            .domain(year_labels.map(function (d) {
            return d.year();
        }));
        // Add month data items to the overview
        this.items.selectAll('.item-block-year').remove();
        var item_block = this.items.selectAll('.item-block-year')
            .data(year_data)
            .enter()
            .append('rect')
            .attr('class', 'item item-block-year')
            .attr('width', function () {
            return (_this.width - _this.label_padding) / year_labels.length - _this.gutter * 5;
        })
            .attr('height', function () {
            return _this.height - _this.label_padding;
        })
            .attr('transform', function (d) {
            return 'translate(' + yearScale(d.date.year()) + ',' + _this.tooltip_padding * 2 + ')';
        })
            .attr('fill', function (d) {
            var color = d3.scale.linear()
                .range(['#ffffff', _this.color || '#ff4500'])
                .domain([-0.15 * max_value, max_value]);
            return color(d.total) || '#ff4500';
        })
            .on('click', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Set in_transition flag
            _this.in_transition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all month overview related items and labels
            _this.removeGlobalOverview();
            // Redraw the chart
            _this.overview = 'year';
            _this.drawChart();
        })
            .style('opacity', 0)
            .on('mouseover', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Construct tooltip
            var tooltip_html = '';
            tooltip_html += '<div><span><strong>Total time tracked:</strong></span>';
            var sec = parseInt(d.total, 10);
            var days = Math.floor(sec / 86400);
            if (days > 0) {
                tooltip_html += '<span>' + (days === 1 ? '1 day' : days + ' days') + '</span></div>';
            }
            var hours = Math.floor((sec - (days * 86400)) / 3600);
            if (hours > 0) {
                if (days > 0) {
                    tooltip_html += '<div><span></span><span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>';
                }
                else {
                    tooltip_html += '<span>' + (hours === 1 ? '1 hour' : hours + ' hours') + '</span></div>';
                }
            }
            var minutes = Math.floor((sec - (days * 86400) - (hours * 3600)) / 60);
            if (minutes > 0) {
                if (days > 0 || hours > 0) {
                    tooltip_html += '<div><span></span><span>' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>';
                }
                else {
                    tooltip_html += '<span>' + (minutes === 1 ? '1 minute' : minutes + ' minutes') + '</span></div>';
                }
            }
            tooltip_html += '<br />';
            if (d.summary.length <= 5) {
                for (var i = 0; i < d.summary.length; i++) {
                    tooltip_html += '<div><span><strong>' + d.summary[i].name + '</strong></span>';
                    tooltip_html += '<span>' + _this.formatTime(d.summary[i].value) + '</span></div>';
                }
                ;
            }
            else {
                for (var i = 0; i < 5; i++) {
                    tooltip_html += '<div><span><strong>' + d.summary[i].name + '</strong></span>';
                    tooltip_html += '<span>' + _this.formatTime(d.summary[i].value) + '</span></div>';
                }
                ;
                tooltip_html += '<br />';
                var other_projects_sum = 0;
                for (var i = 5; i < d.summary.length; i++) {
                    other_projects_sum = +d.summary[i].value;
                }
                ;
                tooltip_html += '<div><span><strong>Other:</strong></span>';
                tooltip_html += '<span>' + _this.formatTime(other_projects_sum) + '</span></div>';
            }
            // Calculate tooltip position
            var x = yearScale(d.date.year()) + _this.tooltip_padding * 2;
            while (_this.width - x < (_this.tooltip_width + _this.tooltip_padding * 5)) {
                x -= 10;
            }
            var y = _this.tooltip_padding * 3;
            // Show tooltip
            _this.tooltip.html(tooltip_html)
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transition_duration / 2)
                .ease('ease-in')
                .style('opacity', 1);
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.hideTooltip();
        })
            .transition()
            .delay(function (d, i) {
            return _this.transition_duration * (i + 1) / 10;
        })
            .duration(function () {
            return _this.transition_duration;
        })
            .ease('ease-in')
            .style('opacity', 1)
            .call(function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            var n = 0;
            transition
                .each(function () { ++n; })
                .each('end', function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            });
        }, function () {
            _this.in_transition = false;
        });
        // Add year labels
        this.labels.selectAll('.label-year').remove();
        this.labels.selectAll('.label-year')
            .data(year_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-year')
            .attr('font-size', function () {
            return Math.floor(_this.label_padding / 3) + 'px';
        })
            .text(function (d) {
            return d.year();
        })
            .attr('x', function (d) {
            return yearScale(d.year());
        })
            .attr('y', this.label_padding / 2)
            .on('mouseenter', function (year_label) {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-block-year')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', function (d) {
                return (moment(d.date).year() === year_label.year()) ? 1 : 0.1;
            });
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-block-year')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', 1);
        })
            .on('click', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Set in_transition flag
            _this.in_transition = true;
            // Set selected month to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all year overview related items and labels
            _this.removeGlobalOverview();
            // Redraw the chart
            _this.overview = 'year';
            _this.drawChart();
        });
    };
    ;
    /**
     * Draw year overview
     */
    CalendarHeatmap.prototype.drawYearOverview = function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define start and end date of the selected year
        var start_of_year = moment(this.selected['date']).startOf('year');
        var end_of_year = moment(this.selected['date']).endOf('year');
        // Filter data down to the selected year
        var year_data = this.data.filter(function (d) {
            return start_of_year <= moment(d.date) && moment(d.date) < end_of_year;
        });
        // Calculate max value of the year data
        var max_value = d3.max(year_data, function (d) {
            return d.total;
        });
        var color = d3.scale.linear()
            .range(['#ffffff', this.color])
            .domain([-0.15 * max_value, max_value]);
        this.items.selectAll('.item-circle').remove();
        this.items.selectAll('.item-circle')
            .data(year_data)
            .enter()
            .append('rect')
            .attr('class', 'item item-circle')
            .style('opacity', 0)
            .attr('x', function (d) {
            return _this.calcItemX(d, start_of_year) + (_this.item_size - _this.calcItemSize(d, max_value)) / 2;
        })
            .attr('y', function (d) {
            return _this.calcItemY(d) + (_this.item_size - _this.calcItemSize(d, max_value)) / 2;
        })
            .attr('rx', function (d) {
            return _this.calcItemSize(d, max_value);
        })
            .attr('ry', function (d) {
            return _this.calcItemSize(d, max_value);
        })
            .attr('width', function (d) {
            return _this.calcItemSize(d, max_value);
        })
            .attr('height', function (d) {
            return _this.calcItemSize(d, max_value);
        })
            .attr('fill', function (d) {
            return (d.total > 0) ? color(d.total) : 'transparent';
        })
            .on('click', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            _this.in_transition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all year overview related items and labels
            _this.removeYearOverview();
            // Redraw the chart
            _this.overview = 'day';
            _this.drawChart();
        })
            .on('mouseover', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Pulsating animation
            var circle = d3.select(d3.event.currentTarget);
            var repeat = function () {
                circle = circle.transition()
                    .duration(_this.transition_duration)
                    .ease('ease-in')
                    .attr('x', function (d) {
                    return _this.calcItemX(d, start_of_year) - (_this.item_size * 1.1 - _this.item_size) / 2;
                })
                    .attr('y', function (d) {
                    return _this.calcItemY(d) - (_this.item_size * 1.1 - _this.item_size) / 2;
                })
                    .attr('width', _this.item_size * 1.1)
                    .attr('height', _this.item_size * 1.1)
                    .transition()
                    .duration(_this.transition_duration)
                    .ease('ease-in')
                    .attr('x', function (d) {
                    return _this.calcItemX(d, start_of_year) + (_this.item_size - _this.calcItemSize(d, max_value)) / 2;
                })
                    .attr('y', function (d) {
                    return _this.calcItemY(d) + (_this.item_size - _this.calcItemSize(d, max_value)) / 2;
                })
                    .attr('width', function (d) {
                    return _this.calcItemSize(d, max_value);
                })
                    .attr('height', function (d) {
                    return _this.calcItemSize(d, max_value);
                })
                    .each('end', repeat);
            };
            repeat();
            // Construct tooltip
            var tooltip_html = '';
            tooltip_html += '<div class="header"><strong>' + (d.total ? _this.formatTime(d.total) : 'No time') + ' tracked</strong></div>';
            tooltip_html += '<div>on ' + moment(d.date).format('dddd, MMM Do YYYY') + '</div><br>';
            // Add summary to the tooltip
            d.summary.map(function (d) {
                tooltip_html += '<div><span><strong>' + d.name + '</strong></span>';
                tooltip_html += '<span>' + _this.formatTime(d.value) + '</span></div>';
            });
            // Calculate tooltip position
            var x = _this.calcItemX(d, start_of_year) + _this.item_size;
            if (_this.width - x < (_this.tooltip_width + _this.tooltip_padding * 3)) {
                x -= _this.tooltip_width + _this.tooltip_padding * 2;
            }
            var y = _this.calcItemY(d) + _this.item_size;
            // Show tooltip
            _this.tooltip.html(tooltip_html)
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transition_duration / 2)
                .ease('ease-in')
                .style('opacity', 1);
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            // Set circle radius back to what it's supposed to be
            d3.select(d3.event.currentTarget).transition()
                .duration(_this.transition_duration / 2)
                .ease('ease-in')
                .attr('x', function (d) {
                return _this.calcItemX(d, start_of_year) + (_this.item_size - _this.calcItemSize(d, max_value)) / 2;
            })
                .attr('y', function (d) {
                return _this.calcItemY(d) + (_this.item_size - _this.calcItemSize(d, max_value)) / 2;
            })
                .attr('width', function (d) {
                return _this.calcItemSize(d, max_value);
            })
                .attr('height', function (d) {
                return _this.calcItemSize(d, max_value);
            });
            // Hide tooltip
            _this.hideTooltip();
        })
            .transition()
            .delay(function () {
            return (Math.cos(Math.PI * Math.random()) + 1) * _this.transition_duration;
        })
            .duration(function () {
            return _this.transition_duration;
        })
            .ease('ease-in')
            .style('opacity', 1)
            .call(function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            var n = 0;
            transition
                .each(function () { ++n; })
                .each('end', function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            });
        }, function () {
            _this.in_transition = false;
        });
        // Add month labels
        var month_labels = d3.time.months(start_of_year, end_of_year);
        var monthScale = d3.scale.linear()
            .range([0, this.width])
            .domain([0, month_labels.length]);
        this.labels.selectAll('.label-month').remove();
        this.labels.selectAll('.label-month')
            .data(month_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-month')
            .attr('font-size', function () {
            return Math.floor(_this.label_padding / 3) + 'px';
        })
            .text(function (d) {
            return d.toLocaleDateString('en-us', { month: 'short' });
        })
            .attr('x', function (d, i) {
            return monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2;
        })
            .attr('y', this.label_padding / 2)
            .on('mouseenter', function (d) {
            if (_this.in_transition) {
                return;
            }
            var selected_month = moment(d);
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', function (d) {
                return moment(d.date).isSame(selected_month, 'month') ? 1 : 0.1;
            });
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', 1);
        })
            .on('click', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Check month data
            var month_data = _this.data.filter(function (e) {
                return moment(d).startOf('month') <= moment(e.date) && moment(e.date) < moment(d).endOf('month');
            });
            // Don't transition if there is no data to show
            if (!month_data.length) {
                return;
            }
            // Set selected month to the one clicked on
            _this.selected = { date: d };
            _this.in_transition = true;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all year overview related items and labels
            _this.removeYearOverview();
            // Redraw the chart
            _this.overview = 'month';
            _this.drawChart();
        });
        // Add day labels
        var day_labels = d3.time.days(moment().startOf('week'), moment().endOf('week'));
        var dayScale = d3.scale.ordinal()
            .rangeRoundBands([this.label_padding, this.height])
            .domain(day_labels.map(function (d) {
            return moment(d).weekday();
        }));
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(day_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.label_padding / 3)
            .attr('y', function (d, i) {
            return dayScale(i) + dayScale.rangeBand() / 1.75;
        })
            .style('text-anchor', 'left')
            .attr('font-size', function () {
            return Math.floor(_this.label_padding / 3) + 'px';
        })
            .text(function (d) {
            return moment(d).format('dddd')[0];
        })
            .on('mouseenter', function (d) {
            if (_this.in_transition) {
                return;
            }
            var selected_day = moment(d);
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', function (d) {
                return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1;
            });
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', 1);
        });
        // Add button to switch back to previous overview
        this.drawButton();
    };
    ;
    /**
     * Draw month overview
     */
    CalendarHeatmap.prototype.drawMonthOverview = function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define beginning and end of the month
        var start_of_month = moment(this.selected['date']).startOf('month');
        var end_of_month = moment(this.selected['date']).endOf('month');
        // Filter data down to the selected month
        var month_data = this.data.filter(function (d) {
            return start_of_month <= moment(d.date) && moment(d.date) < end_of_month;
        });
        var max_value = d3.max(month_data, function (d) {
            return d3.max(d.summary, function (d) {
                return d.value;
            });
        });
        // Define day labels and axis
        var day_labels = d3.time.days(moment().startOf('week'), moment().endOf('week'));
        var dayScale = d3.scale.ordinal()
            .rangeRoundBands([this.label_padding, this.height])
            .domain(day_labels.map(function (d) {
            return moment(d).weekday();
        }));
        // Define week labels and axis
        var week_labels = [start_of_month.clone()];
        while (start_of_month.week() !== end_of_month.week()) {
            week_labels.push(start_of_month.add(1, 'week').clone());
        }
        var weekScale = d3.scale.ordinal()
            .rangeRoundBands([this.label_padding, this.width], 0.05)
            .domain(week_labels.map(function (weekday) {
            return weekday.week();
        }));
        // Add month data items to the overview
        this.items.selectAll('.item-block-month').remove();
        var item_block = this.items.selectAll('.item-block-month')
            .data(month_data)
            .enter()
            .append('g')
            .attr('class', 'item item-block-month')
            .attr('width', function () {
            return (_this.width - _this.label_padding) / week_labels.length - _this.gutter * 5;
        })
            .attr('height', function () {
            return Math.min(dayScale.rangeBand(), _this.max_block_height);
        })
            .attr('transform', function (d) {
            return 'translate(' + weekScale(moment(d.date).week()) + ',' + ((dayScale(moment(d.date).weekday()) + dayScale.rangeBand() / 1.75) - 15) + ')';
        })
            .attr('total', function (d) {
            return d.total;
        })
            .attr('date', function (d) {
            return d.date;
        })
            .attr('offset', 0)
            .on('click', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            _this.in_transition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all month overview related items and labels
            _this.removeMonthOverview();
            // Redraw the chart
            _this.overview = 'day';
            _this.drawChart();
        });
        var item_width = (this.width - this.label_padding) / week_labels.length - this.gutter * 5;
        var itemScale = d3.scale.linear()
            .rangeRound([0, item_width]);
        var item_gutter = this.item_gutter;
        item_block.selectAll('.item-block-rect')
            .data(function (d) {
            return d.summary;
        })
            .enter()
            .append('rect')
            .attr('class', 'item item-block-rect')
            .attr('x', function (d) {
            var total = parseInt(d3.select(this.parentNode).attr('total'));
            var offset = parseInt(d3.select(this.parentNode).attr('offset'));
            itemScale.domain([0, total]);
            d3.select(this.parentNode).attr('offset', offset + itemScale(d.value));
            return offset;
        })
            .attr('width', function (d) {
            var total = parseInt(d3.select(this.parentNode).attr('total'));
            itemScale.domain([0, total]);
            return Math.max((itemScale(d.value) - item_gutter), 1);
        })
            .attr('height', function () {
            return Math.min(dayScale.rangeBand(), _this.max_block_height);
        })
            .attr('fill', function (d) {
            var color = d3.scale.linear()
                .range(['#ffffff', _this.color])
                .domain([-0.15 * max_value, max_value]);
            return color(d.value) || '#ff4500';
        })
            .style('opacity', 0)
            .on('mouseover', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Get date from the parent node
            var date = new Date(d3.select(d3.event.currentTarget.parentNode).attr('date'));
            // Construct tooltip
            var tooltip_html = '';
            tooltip_html += '<div class="header"><strong>' + d.name + '</strong></div><br>';
            tooltip_html += '<div><strong>' + (d.value ? _this.formatTime(d.value) : 'No time') + ' tracked</strong></div>';
            tooltip_html += '<div>on ' + moment(date).format('dddd, MMM Do YYYY') + '</div>';
            // Calculate tooltip position
            var x = weekScale(moment(date).week()) + _this.tooltip_padding;
            while (_this.width - x < (_this.tooltip_width + _this.tooltip_padding * 3)) {
                x -= 10;
            }
            var y = dayScale(moment(date).weekday()) + _this.tooltip_padding * 2;
            // Show tooltip
            _this.tooltip.html(tooltip_html)
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transition_duration / 2)
                .ease('ease-in')
                .style('opacity', 1);
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.hideTooltip();
        })
            .transition()
            .delay(function () {
            return (Math.cos(Math.PI * Math.random()) + 1) * _this.transition_duration;
        })
            .duration(function () {
            return _this.transition_duration;
        })
            .ease('ease-in')
            .style('opacity', 1)
            .call(function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            var n = 0;
            transition
                .each(function () { ++n; })
                .each('end', function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            });
        }, function () {
            _this.in_transition = false;
        });
        // Add week labels
        this.labels.selectAll('.label-week').remove();
        this.labels.selectAll('.label-week')
            .data(week_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-week')
            .attr('font-size', function () {
            return Math.floor(_this.label_padding / 3) + 'px';
        })
            .text(function (d) {
            return 'Week ' + d.week();
        })
            .attr('x', function (d) {
            return weekScale(d.week());
        })
            .attr('y', this.label_padding / 2)
            .on('mouseenter', function (weekday) {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', function (d) {
                return (moment(d.date).week() === weekday.week()) ? 1 : 0.1;
            });
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', 1);
        })
            .on('click', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Check week data
            var week_data = _this.data.filter(function (e) {
                return d.startOf('week') <= moment(e.date) && moment(e.date) < d.endOf('week');
            });
            // Don't transition if there is no data to show
            if (!week_data.length) {
                return;
            }
            _this.in_transition = true;
            // Set selected month to the one clicked on
            _this.selected = { date: d };
            // Hide tooltip
            _this.hideTooltip();
            // Remove all year overview related items and labels
            _this.removeMonthOverview();
            // Redraw the chart
            _this.overview = 'week';
            _this.drawChart();
        });
        // Add day labels
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(day_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.label_padding / 3)
            .attr('y', function (d, i) {
            return dayScale(i) + dayScale.rangeBand() / 1.75;
        })
            .style('text-anchor', 'left')
            .attr('font-size', function () {
            return Math.floor(_this.label_padding / 3) + 'px';
        })
            .text(function (d) {
            return moment(d).format('dddd')[0];
        })
            .on('mouseenter', function (d) {
            if (_this.in_transition) {
                return;
            }
            var selected_day = moment(d);
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', function (d) {
                return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1;
            });
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', 1);
        });
        // Add button to switch back to previous overview
        this.drawButton();
    };
    ;
    /**
     * Draw week overview
     */
    CalendarHeatmap.prototype.drawWeekOverview = function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define beginning and end of the week
        var start_of_week = moment(this.selected['date']).startOf('week');
        var end_of_week = moment(this.selected['date']).endOf('week');
        // Filter data down to the selected week
        var week_data = this.data.filter(function (d) {
            return start_of_week <= moment(d.date) && moment(d.date) < end_of_week;
        });
        var max_value = d3.max(week_data, function (d) {
            return d3.max(d.summary, function (d) {
                return d.value;
            });
        });
        // Define day labels and axis
        var day_labels = d3.time.days(moment().startOf('week'), moment().endOf('week'));
        var dayScale = d3.scale.ordinal()
            .rangeRoundBands([this.label_padding, this.height])
            .domain(day_labels.map(function (d) {
            return moment(d).weekday();
        }));
        // Define week labels and axis
        var week_labels = [start_of_week];
        var weekScale = d3.scale.ordinal()
            .rangeRoundBands([this.label_padding, this.width], 0.01)
            .domain(week_labels.map(function (weekday) {
            return weekday.week();
        }));
        // Add week data items to the overview
        this.items.selectAll('.item-block-week').remove();
        var item_block = this.items.selectAll('.item-block-week')
            .data(week_data)
            .enter()
            .append('g')
            .attr('class', 'item item-block-week')
            .attr('width', function () {
            return (_this.width - _this.label_padding) / week_labels.length - _this.gutter * 5;
        })
            .attr('height', function () {
            return Math.min(dayScale.rangeBand(), _this.max_block_height);
        })
            .attr('transform', function (d) {
            return 'translate(' + weekScale(moment(d.date).week()) + ',' + ((dayScale(moment(d.date).weekday()) + dayScale.rangeBand() / 1.75) - 15) + ')';
        })
            .attr('total', function (d) {
            return d.total;
        })
            .attr('date', function (d) {
            return d.date;
        })
            .attr('offset', 0)
            .on('click', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            _this.in_transition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all week overview related items and labels
            _this.removeWeekOverview();
            // Redraw the chart
            _this.overview = 'day';
            _this.drawChart();
        });
        var item_width = (this.width - this.label_padding) / week_labels.length - this.gutter * 5;
        var itemScale = d3.scale.linear()
            .rangeRound([0, item_width]);
        var item_gutter = this.item_gutter;
        item_block.selectAll('.item-block-rect')
            .data(function (d) {
            return d.summary;
        })
            .enter()
            .append('rect')
            .attr('class', 'item item-block-rect')
            .attr('x', function (d) {
            var total = parseInt(d3.select(this.parentNode).attr('total'));
            var offset = parseInt(d3.select(this.parentNode).attr('offset'));
            itemScale.domain([0, total]);
            d3.select(this.parentNode).attr('offset', offset + itemScale(d.value));
            return offset;
        })
            .attr('width', function (d) {
            var total = parseInt(d3.select(this.parentNode).attr('total'));
            itemScale.domain([0, total]);
            return Math.max((itemScale(d.value) - item_gutter), 1);
        })
            .attr('height', function () {
            return Math.min(dayScale.rangeBand(), _this.max_block_height);
        })
            .attr('fill', function (d) {
            var color = d3.scale.linear()
                .range(['#ffffff', _this.color])
                .domain([-0.15 * max_value, max_value]);
            return color(d.value) || '#ff4500';
        })
            .style('opacity', 0)
            .on('mouseover', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Get date from the parent node
            var date = new Date(d3.select(d3.event.currentTarget.parentNode).attr('date'));
            // Construct tooltip
            var tooltip_html = '';
            tooltip_html += '<div class="header"><strong>' + d.name + '</strong></div><br>';
            tooltip_html += '<div><strong>' + (d.value ? _this.formatTime(d.value) : 'No time') + ' tracked</strong></div>';
            tooltip_html += '<div>on ' + moment(date).format('dddd, MMM Do YYYY') + '</div>';
            // Calculate tooltip position
            var total = parseInt(d3.select(d3.event.currentTarget.parentNode).attr('total'));
            itemScale.domain([0, total]);
            var x = parseInt(d3.select(d3.event.currentTarget).attr('x')) + itemScale(d.value) / 4 + _this.tooltip_width / 4;
            while (_this.width - x < (_this.tooltip_width + _this.tooltip_padding * 3)) {
                x -= 10;
            }
            var y = dayScale(moment(date).weekday()) + _this.tooltip_padding * 1.5;
            // Show tooltip
            _this.tooltip.html(tooltip_html)
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transition_duration / 2)
                .ease('ease-in')
                .style('opacity', 1);
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.hideTooltip();
        })
            .transition()
            .delay(function () {
            return (Math.cos(Math.PI * Math.random()) + 1) * _this.transition_duration;
        })
            .duration(function () {
            return _this.transition_duration;
        })
            .ease('ease-in')
            .style('opacity', 1)
            .call(function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            var n = 0;
            transition
                .each(function () { ++n; })
                .each('end', function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            });
        }, function () {
            _this.in_transition = false;
        });
        // Add week labels
        this.labels.selectAll('.label-week').remove();
        this.labels.selectAll('.label-week')
            .data(week_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-week')
            .attr('font-size', function () {
            return Math.floor(_this.label_padding / 3) + 'px';
        })
            .text(function (d) {
            return 'Week ' + d.week();
        })
            .attr('x', function (d) {
            return weekScale(d.week());
        })
            .attr('y', this.label_padding / 2)
            .on('mouseenter', function (weekday) {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', function (d) {
                return (moment(d.date).week() === weekday.week()) ? 1 : 0.1;
            });
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', 1);
        });
        // Add day labels
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(day_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.label_padding / 3)
            .attr('y', function (d, i) {
            return dayScale(i) + dayScale.rangeBand() / 1.75;
        })
            .style('text-anchor', 'left')
            .attr('font-size', function () {
            return Math.floor(_this.label_padding / 3) + 'px';
        })
            .text(function (d) {
            return moment(d).format('dddd')[0];
        })
            .on('mouseenter', function (d) {
            if (_this.in_transition) {
                return;
            }
            var selected_day = moment(d);
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', function (d) {
                return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1;
            });
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', 1);
        });
        // Add button to switch back to previous overview
        this.drawButton();
    };
    ;
    /**
     * Draw day overview
     */
    CalendarHeatmap.prototype.drawDayOverview = function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Initialize selected date to today if it was not set
        if (!Object.keys(this.selected).length) {
            this.selected = this.data[this.data.length - 1];
        }
        var project_labels = this.selected['summary'].map(function (project) {
            return project.name;
        });
        var projectScale = d3.scale.ordinal()
            .rangeRoundBands([this.label_padding, this.height])
            .domain(project_labels);
        var itemScale = d3.time.scale()
            .range([this.label_padding * 2, this.width])
            .domain([moment(this.selected['date']).startOf('day'), moment(this.selected['date']).endOf('day')]);
        this.items.selectAll('.item-block').remove();
        this.items.selectAll('.item-block')
            .data(this.selected['details'])
            .enter()
            .append('rect')
            .attr('class', 'item item-block')
            .attr('x', function (d) {
            return itemScale(moment(d.date));
        })
            .attr('y', function (d) {
            return (projectScale(d.name) + projectScale.rangeBand() / 2) - 15;
        })
            .attr('width', function (d) {
            var end = itemScale(d3.time.second.offset(moment(d.date), d.value));
            return Math.max((end - itemScale(moment(d.date))), 1);
        })
            .attr('height', function () {
            return Math.min(projectScale.rangeBand(), _this.max_block_height);
        })
            .attr('fill', function () {
            return _this.color;
        })
            .style('opacity', 0)
            .on('mouseover', function (d) {
            if (_this.in_transition) {
                return;
            }
            // Construct tooltip
            var tooltip_html = '';
            tooltip_html += '<div class="header"><strong>' + d.name + '</strong><div><br>';
            tooltip_html += '<div><strong>' + (d.value ? _this.formatTime(d.value) : 'No time') + ' tracked</strong></div>';
            tooltip_html += '<div>on ' + moment(d.date).format('dddd, MMM Do YYYY HH:mm') + '</div>';
            // Calculate tooltip position
            var x = d.value * 100 / (60 * 60 * 24) + itemScale(moment(d.date));
            while (_this.width - x < (_this.tooltip_width + _this.tooltip_padding * 3)) {
                x -= 10;
            }
            var y = projectScale(d.name) + projectScale.rangeBand() / 2 + _this.tooltip_padding / 2;
            // Show tooltip
            _this.tooltip.html(tooltip_html)
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transition_duration / 2)
                .ease('ease-in')
                .style('opacity', 1);
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.hideTooltip();
        })
            .on('click', function (d) {
            if (_this.handler) {
                _this.handler.emit(d);
            }
        })
            .transition()
            .delay(function () {
            return (Math.cos(Math.PI * Math.random()) + 1) * _this.transition_duration;
        })
            .duration(function () {
            return _this.transition_duration;
        })
            .ease('ease-in')
            .style('opacity', 0.5)
            .call(function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            var n = 0;
            transition
                .each(function () { ++n; })
                .each('end', function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            });
        }, function () {
            _this.in_transition = false;
        });
        // Add time labels
        var timeLabels = d3.time.hours(moment(this.selected['date']).startOf('day'), moment(this.selected['date']).endOf('day'));
        var timeScale = d3.time.scale()
            .range([this.label_padding * 2, this.width])
            .domain([0, timeLabels.length]);
        this.labels.selectAll('.label-time').remove();
        this.labels.selectAll('.label-time')
            .data(timeLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-time')
            .attr('font-size', function () {
            return Math.floor(_this.label_padding / 3) + 'px';
        })
            .text(function (d) {
            return moment(d).format('HH:mm');
        })
            .attr('x', function (d, i) {
            return timeScale(i);
        })
            .attr('y', this.label_padding / 2)
            .on('mouseenter', function (d) {
            if (_this.in_transition) {
                return;
            }
            var selected = itemScale(moment(d));
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', function (d) {
                var start = itemScale(moment(d.date));
                var end = itemScale(moment(d.date).add(d.value, 'seconds'));
                return (selected >= start && selected <= end) ? 1 : 0.1;
            });
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', 0.5);
        });
        // Add project labels
        var label_padding = this.label_padding;
        this.labels.selectAll('.label-project').remove();
        this.labels.selectAll('.label-project')
            .data(project_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-project')
            .attr('x', this.gutter)
            .attr('y', function (d) {
            return projectScale(d) + projectScale.rangeBand() / 2;
        })
            .attr('min-height', function () {
            return projectScale.rangeBand();
        })
            .style('text-anchor', 'left')
            .attr('font-size', function () {
            return Math.floor(_this.label_padding / 3) + 'px';
        })
            .text(function (d) {
            return d;
        })
            .each(function (d, i) {
            var obj = d3.select(this), text_length = obj.node().getComputedTextLength(), text = obj.text();
            while (text_length > (label_padding * 1.5) && text.length > 0) {
                text = text.slice(0, -1);
                obj.text(text + '...');
                text_length = obj.node().getComputedTextLength();
            }
        })
            .on('mouseenter', function (project) {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', function (d) {
                return (d.name === project) ? 1 : 0.1;
            });
        })
            .on('mouseout', function () {
            if (_this.in_transition) {
                return;
            }
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transition_duration)
                .ease('ease-in')
                .style('opacity', 0.5);
        });
        // Add button to switch back to previous overview
        this.drawButton();
    };
    ;
    /**
     * Helper function to calculate item position on the x-axis
     * @param d object
     */
    CalendarHeatmap.prototype.calcItemX = function (d, start_of_year) {
        var date = moment(d.date);
        var dayIndex = Math.round((date - moment(start_of_year).startOf('week')) / 86400000);
        var colIndex = Math.trunc(dayIndex / 7);
        return colIndex * (this.item_size + this.gutter) + this.label_padding;
    };
    ;
    /**
     * Helper function to calculate item position on the y-axis
     * @param d object
     */
    CalendarHeatmap.prototype.calcItemY = function (d) {
        return this.label_padding + moment(d.date).weekday() * (this.item_size + this.gutter);
    };
    ;
    /**
     * Helper function to calculate item size
     * @param d object
     * @param max number
     */
    CalendarHeatmap.prototype.calcItemSize = function (d, max) {
        if (max <= 0) {
            return this.item_size;
        }
        return this.item_size * 0.75 + (this.item_size * d.total / max) * 0.25;
    };
    ;
    /**
     * Draw the button for navigation purposes
     */
    CalendarHeatmap.prototype.drawButton = function () {
        var _this = this;
        this.buttons.selectAll('.button').remove();
        var button = this.buttons.append('g')
            .attr('class', 'button button-back')
            .style('opacity', 0)
            .on('click', function () {
            if (_this.in_transition) {
                return;
            }
            // Set transition boolean
            _this.in_transition = true;
            // Clean the canvas from whichever overview type was on
            if (_this.overview === 'year') {
                _this.removeYearOverview();
            }
            else if (_this.overview === 'month') {
                _this.removeMonthOverview();
            }
            else if (_this.overview === 'week') {
                _this.removeWeekOverview();
            }
            else if (_this.overview === 'day') {
                _this.removeDayOverview();
            }
            // Redraw the chart
            _this.history.pop();
            _this.overview = _this.history.pop();
            _this.drawChart();
        });
        button.append('circle')
            .attr('cx', this.label_padding / 2.25)
            .attr('cy', this.label_padding / 2.5)
            .attr('r', this.item_size / 2);
        button.append('text')
            .attr('x', this.label_padding / 2.25)
            .attr('y', this.label_padding / 2.5)
            .attr('dy', function () {
            return Math.floor(_this.width / 100) / 3;
        })
            .attr('font-size', function () {
            return Math.floor(_this.label_padding / 3) + 'px';
        })
            .html('&#x2190;');
        button.transition()
            .duration(this.transition_duration)
            .ease('ease-in')
            .style('opacity', 1);
    };
    ;
    /**
     * Transition and remove items and labels related to global overview
     */
    CalendarHeatmap.prototype.removeGlobalOverview = function () {
        this.items.selectAll('.item-block-year')
            .transition()
            .duration(this.transition_duration)
            .ease('ease-out')
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-year').remove();
    };
    ;
    /**
     * Transition and remove items and labels related to year overview
     */
    CalendarHeatmap.prototype.removeYearOverview = function () {
        this.items.selectAll('.item-circle')
            .transition()
            .duration(this.transition_duration)
            .ease('ease')
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-month').remove();
        this.hideBackButton();
    };
    ;
    /**
     * Transition and remove items and labels related to month overview
     */
    CalendarHeatmap.prototype.removeMonthOverview = function () {
        var _this = this;
        this.items.selectAll('.item-block-month').selectAll('.item-block-rect')
            .transition()
            .duration(this.transition_duration)
            .ease('ease-in')
            .style('opacity', 0)
            .attr('x', function (d, i) {
            return (i % 2 === 0) ? -_this.width / 3 : _this.width / 3;
        })
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    };
    ;
    /**
     * Transition and remove items and labels related to week overview
     */
    CalendarHeatmap.prototype.removeWeekOverview = function () {
        var _this = this;
        this.items.selectAll('.item-block-week').selectAll('.item-block-rect')
            .transition()
            .duration(this.transition_duration)
            .ease('ease-in')
            .style('opacity', 0)
            .attr('x', function (d, i) {
            return (i % 2 === 0) ? -_this.width / 3 : _this.width / 3;
        })
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    };
    ;
    /**
     * Transition and remove items and labels related to daily overview
     */
    CalendarHeatmap.prototype.removeDayOverview = function () {
        var _this = this;
        this.items.selectAll('.item-block')
            .transition()
            .duration(this.transition_duration)
            .ease('ease-in')
            .style('opacity', 0)
            .attr('x', function (d, i) {
            return (i % 2 === 0) ? -_this.width / 3 : _this.width / 3;
        })
            .remove();
        this.labels.selectAll('.label-time').remove();
        this.labels.selectAll('.label-project').remove();
        this.hideBackButton();
    };
    ;
    /**
     * Helper function to hide the tooltip
     */
    CalendarHeatmap.prototype.hideTooltip = function () {
        this.tooltip.transition()
            .duration(this.transition_duration / 2)
            .ease('ease-in')
            .style('opacity', 0);
    };
    ;
    /**
     * Helper function to hide the back button
     */
    CalendarHeatmap.prototype.hideBackButton = function () {
        this.buttons.selectAll('.button')
            .transition()
            .duration(this.transition_duration)
            .ease('ease')
            .style('opacity', 0)
            .remove();
    };
    ;
    /**
     * Helper function to convert seconds to a human readable format
     * @param seconds Integer
     */
    CalendarHeatmap.prototype.formatTime = function (seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
        var time = '';
        if (hours > 0) {
            time += hours === 1 ? '1 hour ' : hours + ' hours ';
        }
        if (minutes > 0) {
            time += minutes === 1 ? '1 minute' : minutes + ' minutes';
        }
        if (hours === 0 && minutes === 0) {
            time = Math.round(seconds) + ' seconds';
        }
        return time;
    };
    ;
    return CalendarHeatmap;
}());
__decorate([
    core_1.ViewChild('root'),
    __metadata("design:type", Object)
], CalendarHeatmap.prototype, "element", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], CalendarHeatmap.prototype, "data", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CalendarHeatmap.prototype, "color", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CalendarHeatmap.prototype, "overview", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], CalendarHeatmap.prototype, "handler", void 0);
__decorate([
    core_1.HostListener('window:resize', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CalendarHeatmap.prototype, "onResize", null);
CalendarHeatmap = __decorate([
    core_1.Component({
        selector: 'calendar-heatmap',
        template: "<div #root></div>",
        styles: ["\n    :host {\n      user-select: none;\n      -ms-user-select: none;\n      -moz-user-select: none;\n      -webkit-user-select: none;\n    }\n    :host >>> .item {\n      cursor: pointer;\n    }\n    :host >>> .label {\n      cursor: pointer;\n      fill: rgb(170, 170, 170);\n      font-family: Helvetica, arial, 'Open Sans', sans-serif;\n    }\n    :host >>> .button {\n      cursor: pointer;\n      fill: transparent;\n      stroke-width: 2;\n      stroke: rgb(170, 170, 170);\n    }\n    :host >>> .button text {\n      stroke-width: 1;\n      text-anchor: middle;\n      fill: rgb(170, 170, 170);\n    }\n    :host >>> .heatmap-tooltip {\n      pointer-events: none;\n      position: absolute;\n      z-index: 9999;\n      width: 250px;\n      max-width: 250px;\n      overflow: hidden;\n      padding: 15px;\n      font-size: 12px;\n      line-height: 14px;\n      color: rgb(51, 51, 51);\n      font-family: Helvetica, arial, 'Open Sans', sans-serif;\n      background: rgba(255, 255, 255, 0.75);\n    }\n    :host >>> .heatmap-tooltip .header strong {\n      display: inline-block;\n      width: 250px;\n    }\n    :host >>> .heatmap-tooltip span {\n      display: inline-block;\n      width: 50%;\n      padding-right: 10px;\n      box-sizing: border-box;\n    }\n    :host >>> .heatmap-tooltip span,\n    :host >>> .heatmap-tooltip .header strong {\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n  "],
    })
], CalendarHeatmap);
exports.CalendarHeatmap = CalendarHeatmap;
//# sourceMappingURL=calendar-heatmap.js.map