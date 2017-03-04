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
