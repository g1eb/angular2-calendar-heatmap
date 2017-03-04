import { Component, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';

// Declare global variables
declare var d3: any;
declare var moment: any;

@Component({
  selector: 'calendar-heatmap',
  template: `<div #root class="calendar-heatmap"></div>`,
  styleUrls:  ['./src/app/calendar-heatmap.css'],
})
export class CalendarHeatmap  {
  @ViewChild('root') element: any;

  @Input() data: Array<object>;
  @Input() color: string = '#ff4500';
  @Input() overview: string = 'year';

  @Output() handler: EventEmitter<object> = new EventEmitter<object>();

  // Defaults
  private gutter: number = 5;
  private item_gutter: number = 1;
  private width: number = 1000;
  private height: number = 200;
  private item_size: number = 10;
  private label_padding: number = 40;
  private max_block_height: number = 20;
  private transition_duration: number = 500;
  private in_transition: boolean = false;

  // Tooltip defaults
  private tooltip_width: number = 250;
  private tooltip_padding: number = 15;

  // Overview defaults
  private history = ['year'];
  private selected = {};

  // D3 related variables
  private svg: any;
  private items: any;
  private labels: any;
  private buttons: any;
  private tooltip: any;

  /**
   * Check if data is available
   */
  ngOnChanges() {
    if ( !this.data ) { return; }

    // Update data summaries
    this.updateDataSummary();

    // Draw the chart
    this.drawChart();
  }

  /**
   * Get hold of the root element and append our svg
   */
  ngAfterViewInit() {
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
  }

  /**
   * Utility function to get number of complete weeks in a year
   */
  getNumberOfWeeks() {
    var dayIndex = Math.round((moment() - moment().subtract(1, 'year').startOf('week')) / 86400000);
    var colIndex = Math.trunc(dayIndex / 7);
    var numWeeks = colIndex + 1;
    return numWeeks;
  }

  /**
   * Utility funciton to calculate chart dimensions
   */
  calculateDimensions() {
    var element = this.element.nativeElement;
    this.width = element.clientWidth < 1000 ? 1000 : element.clientWidth;
    this.item_size = ((this.width - this.label_padding) / this.getNumberOfWeeks() - this.gutter);
    this.height = this.label_padding + 7 * (this.item_size + this.gutter);
    this.svg.attr({'width': this.width, 'height': this.height});
  }

  /**
   * Recalculate dimensions on window resize events
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateDimensions();
    if ( !!this.data && !!this.data[0]['summary'] ) {
      this.drawChart();
    }
  }

  /**
   * Helper function to check for data summary
   */
  updateDataSummary() {
    // Get daily summary if that was not provided
    if ( !this.data[0]['summary'] ) {
      this.data.map(function (d) {
        var summary = d['details'].reduce( function(uniques: any, project: any) {
          if ( !uniques[project.name] ) {
            uniques[project.name] = {
              'value': project.value
            };
          } else {
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
  }

  /**
   * Draw the chart based on the current overview type
   */
  drawChart() {
    if ( !this.svg || !this.data ) { return; }

    if ( this.overview === 'year' ) {
      this.drawYearOverview();
    } else if ( this.overview === 'month' ) {
      this.drawMonthOverview();
    } else if ( this.overview === 'week' ) {
      this.drawWeekOverview();
    } else if ( this.overview === 'day' ) {
      this.drawDayOverview();
    }
  }

  /**
   * Draw year overview
   */
  drawYearOverview() {
    // Add current overview to the history
    if ( this.history[this.history.length-1] !== this.overview ) {
      this.history.push(this.overview);
    }

    var max_value = d3.max(this.data, function (d: any) {
      return d.total;
    });
    var color = d3.scale.linear()
      .range(['#ffffff', this.color || '#ff4500'])
      .domain([-0.15 * max_value, max_value]);

    this.items.selectAll('.item-circle').remove();
    this.items.selectAll('.item-circle')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'item item-circle')
      .style('opacity', 0)
      .attr('x', (d: any) => {
        return this.calcItemX(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
      })
      .attr('y', (d: any) => {
        return this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
      })
      .attr('rx', (d: any) => {
        return this.calcItemSize(d, max_value);
      })
      .attr('ry', (d: any) => {
        return this.calcItemSize(d, max_value);
      })
      .attr('width', (d: any) => {
        return this.calcItemSize(d, max_value);
      })
      .attr('height', (d: any) => {
        return this.calcItemSize(d, max_value);
      })
      .attr('fill', (d: any) => {
        return ( d.total > 0 ) ? color(d.total) : 'transparent';
      })
      .on('click', (d: any) => {
        if ( this.in_transition ) { return; }

        // Don't transition if there is no data to show
        if ( d.total === 0 ) { return; }

        this.in_transition = true;

        // Set selected date to the one clicked on
        this.selected = d;

        // Hide tooltip
        this.hideTooltip();

        // Remove all year overview related items and labels
        this.removeYearOverview();

        // Redraw the chart
        this.overview = 'day';
        this.drawChart();
      })
      .on('mouseover', (d: any) => {
        if ( this.in_transition ) { return; }

        // Pulsating animation
        var circle = d3.select(d3.event.currentTarget);
        var repeat = () => {
          circle = circle.transition()
            .duration(this.transition_duration)
            .ease('ease-in')
            .attr('x', (d: any) => {
              return this.calcItemX(d) - (this.item_size * 1.1 - this.item_size) / 2;
            })
            .attr('y', (d: any) => {
              return this.calcItemY(d) - (this.item_size * 1.1 - this.item_size) / 2;
            })
            .attr('width', this.item_size * 1.1)
            .attr('height', this.item_size * 1.1)
            .transition()
            .duration(this.transition_duration)
            .ease('ease-in')
            .attr('x', (d: any) => {
              return this.calcItemX(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
            })
            .attr('y', (d: any) => {
              return this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
            })
            .attr('width', (d: any) => {
              return this.calcItemSize(d, max_value);
            })
            .attr('height', (d: any) => {
              return this.calcItemSize(d, max_value);
            })
            .each('end', repeat);
        };
        repeat();

        // Construct tooltip
        var tooltip_html = '';
        tooltip_html += '<div class="header"><strong>' + (d.total ? this.formatTime(d.total) : 'No time') + ' tracked</strong></div>';
        tooltip_html += '<div>on ' + moment(d.date).format('dddd, MMM Do YYYY') + '</div><br>';

        // Add summary to the tooltip
        d.summary.filter((d: any) => {
          tooltip_html += '<div><span><strong>' + d.name + '</strong></span>';
          tooltip_html += '<span>' + this.formatTime(d.value) + '</span></div>';
        });

        // Calculate tooltip position
        var x = this.calcItemX(d) + this.item_size;
        if ( this.width - x < (this.tooltip_width + this.tooltip_padding * 3) ) {
          x -= this.tooltip_width + this.tooltip_padding * 2;
        }
        var y = this.calcItemY(d) + this.item_size;

        // Show tooltip
        this.tooltip.html(tooltip_html)
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
            .duration(this.transition_duration / 2)
            .ease('ease-in')
            .style('opacity', 1);
      })
      .on('mouseout', () => {
        if ( this.in_transition ) { return; }

        // Set circle radius back to what it's supposed to be
        d3.select(d3.event.currentTarget).transition()
          .duration(this.transition_duration / 2)
          .ease('ease-in')
          .attr('x', (d: any) => {
            return this.calcItemX(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
          })
          .attr('y', (d: any) => {
            return this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2;
          })
          .attr('width', (d: any) => {
            return this.calcItemSize(d, max_value);
          })
          .attr('height', (d: any) => {
            return this.calcItemSize(d, max_value);
          });

        // Hide tooltip
        this.hideTooltip();
      })
      .transition()
        .delay( () => {
          return (Math.cos(Math.PI * Math.random()) + 1) * this.transition_duration;
        })
        .duration(() => {
          return this.transition_duration;
        })
        .ease('ease-in')
        .style('opacity', 1)
        .call((transition: any, callback: any) => {
          if ( transition.empty() ) {
            callback();
          }
          var n = 0;
          transition
            .each(function() { ++n; })
            .each('end', function() {
              if ( !--n ) {
                callback.apply(this, arguments);
              }
            });
          }, () => {
            this.in_transition = false;
          });

    // Add month labels
    var today = moment().endOf('day');
    var today_year_ago = moment().startOf('day').subtract(1, 'year');
    var month_labels = d3.time.months(today_year_ago.startOf('month'), today);
    var monthScale = d3.scale.linear()
      .range([0, this.width])
      .domain([0, month_labels.length]);
    this.labels.selectAll('.label-month').remove();
    this.labels.selectAll('.label-month')
      .data(month_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-month')
      .attr('font-size', () => {
        return Math.floor(this.label_padding / 3) + 'px';
      })
      .text((d: any) => {
        return d.toLocaleDateString('en-us', {month: 'short'});
      })
      .attr('x', (d: any, i: number) => {
        return monthScale(i) + (monthScale(i) - monthScale(i-1)) / 2;
      })
      .attr('y', this.label_padding / 2)
      .on('mouseenter', (d: any) => {
        if ( this.in_transition ) { return; }

        var selected_month = moment(d);
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transition_duration)
          .ease('ease-in')
          .style('opacity', (d: any) => {
            return moment(d.date).isSame(selected_month, 'month') ? 1 : 0.1;
          });
      })
      .on('mouseout', () => {
        if ( this.in_transition ) { return; }

        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transition_duration)
          .ease('ease-in')
          .style('opacity', 1);
      })
      .on('click', (d: any) => {
        if ( this.in_transition ) { return; }

        // Check month data
        var month_data = this.data.filter((e: any) => {
          return moment(d).startOf('month') <= moment(e.date) && moment(e.date) < moment(d).endOf('month');
        });

        // Don't transition if there is no data to show
        if ( !month_data.length ) { return; }

        // Set selected month to the one clicked on
        this.selected = {date: d};

        this.in_transition = true;

        // Hide tooltip
        this.hideTooltip();

        // Remove all year overview related items and labels
        this.removeYearOverview();

        // Redraw the chart
        this.overview = 'month';
        this.drawChart();
      });

    // Add day labels
    var day_labels = d3.time.days(moment().startOf('week'), moment().endOf('week'));
    var dayScale = d3.scale.ordinal()
      .rangeRoundBands([this.label_padding, this.height])
      .domain(day_labels.map((d: any) => {
        return moment(d).weekday();
      }));
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-day')
      .data(day_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-day')
      .attr('x', this.label_padding / 3)
      .attr('y', (d: any, i: number) => {
        return dayScale(i) + dayScale.rangeBand() / 1.75;
      })
      .style('text-anchor', 'left')
      .attr('font-size', () => {
        return Math.floor(this.label_padding / 3) + 'px';
      })
      .text((d: any) => {
        return moment(d).format('dddd')[0];
      })
      .on('mouseenter', (d: any) => {
        if ( this.in_transition ) { return; }

        var selected_day = moment(d);
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transition_duration)
          .ease('ease-in')
          .style('opacity', (d: any) => {
            return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1;
          });
      })
      .on('mouseout', () => {
        if ( this.in_transition ) { return; }

        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transition_duration)
          .ease('ease-in')
          .style('opacity', 1);
      });
  }

  /**
   * Draw month overview
   */
  drawMonthOverview() {
  }

  /**
   * Draw week overview
   */
  drawWeekOverview() {
  }

  /**
   * Draw day overview
   */
  drawDayOverview() {
  }

  /**
   * Helper function to calculate item position on the x-axis
   * @param d object
   */
  calcItemX(d: any) {
    var date = moment(d.date);
    var year_ago = moment().startOf('day').subtract(1, 'year');
    var dayIndex = Math.round((date - moment(year_ago).startOf('week')) / 86400000);
    var colIndex = Math.trunc(dayIndex / 7);
    return colIndex * (this.item_size + this.gutter) + this.label_padding;
  };

  /**
   * Helper function to calculate item position on the y-axis
   * @param d object
   */
  calcItemY(d: any) {
    return this.label_padding + moment(d.date).weekday() * (this.item_size + this.gutter);
  };

  /**
   * Helper function to calculate item size
   * @param d object
   * @param max number
   */
  calcItemSize(d: any, max: number) {
    if ( max <= 0 ) { return this.item_size; }
    return this.item_size * 0.75 + (this.item_size * d.total / max) * 0.25;
  };

  /**
   * Transition and remove items and labels related to year overview
   */
  removeYearOverview() {
    this.items.selectAll('.item-circle')
      .transition()
      .duration(this.transition_duration)
      .ease('ease')
      .style('opacity', 0)
      .remove();
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-month').remove();
  };

  /**
   * Transition and remove items and labels related to month overview
   */
  removeMonthOverview() {
    this.items.selectAll('.item-block-month').selectAll('.item-block-rect')
      .transition()
      .duration(this.transition_duration)
      .ease('ease-in')
      .style('opacity', 0)
      .attr('x', (d: any, i: number) => {
        return ( i % 2 === 0) ? -this.width/3 : this.width/3;
      })
      .remove();
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-week').remove();
    this.hideBackButton();
  };

  /**
   * Transition and remove items and labels related to week overview
   */
  removeWeekOverview() {
    this.items.selectAll('.item-block-week').selectAll('.item-block-rect')
      .transition()
      .duration(this.transition_duration)
      .ease('ease-in')
      .style('opacity', 0)
      .attr('x', (d: any, i: number) => {
        return ( i % 2 === 0) ? -this.width/3 : this.width/3;
      })
      .remove();
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-week').remove();
    this.hideBackButton();
  };

  /**
   * Transition and remove items and labels related to daily overview
   */
  removeDayOverview() {
    this.items.selectAll('.item-block')
      .transition()
      .duration(this.transition_duration)
      .ease('ease-in')
      .style('opacity', 0)
      .attr('x', (d: any, i: number) => {
        return ( i % 2 === 0) ? -this.width/3 : this.width/3;
      })
      .remove();
    this.labels.selectAll('.label-time').remove();
    this.labels.selectAll('.label-project').remove();
    this.hideBackButton();
  };

  /**
   * Helper function to hide the tooltip
   */
  hideTooltip() {
    this.tooltip.transition()
      .duration(this.transition_duration / 2)
      .ease('ease-in')
      .style('opacity', 0);
  };

  /**
   * Helper function to hide the back button
   */
  hideBackButton() {
    this.buttons.selectAll('.button')
      .transition()
      .duration(this.transition_duration)
      .ease('ease')
      .style('opacity', 0)
      .remove();
  };

  /**
   * Helper function to convert seconds to a human readable format
   * @param seconds Integer
   */
  formatTime(seconds: string) {
    var sec_num = parseInt(seconds, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var time = '';
    if ( hours > 0 ) {
      time += hours === 1 ? '1 hour ' : hours + ' hours ';
    }
    if ( minutes > 0 ) {
      time += minutes === 1 ? '1 minute' : minutes + ' minutes';
    }
    if ( hours === 0 && minutes === 0 ) {
      time = seconds + ' seconds';
    }
    return time;
  };
}
