import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

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
  private width: number  = 1000;
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
}
