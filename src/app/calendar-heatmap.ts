import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'calendar-heatmap',
  template: `<div class="calendar-heatmap"></div>`,
  styleUrls:  ['./src/app/calendar-heatmap.css'],
})
export class CalendarHeatmap  {
  @Input() data: Array<object>;
  @Input() color: string;
  @Input() overview: string;

  @Output() handler: EventEmitter<object> = new EventEmitter<object>();

  // Defaults
  private gutter: number;
  private item_gutter: number;
  private width: number;
  private height: number;
  private item_size: number;
  private label_padding: number;
  private max_block_height: number;
  private transition_duration: number;
  private in_transition: boolean;

  // Tooltip defaults
  private tooltip_width: number;
  private tooltip_padding: number;

  // Overview defaults
  private history: Array<string>;
  private selected: object;

  constructor() {
    this.gutter = 5;
    this.item_gutter = 1;
    this.width = 1000;
    this.height = 200;
    this.item_size = 10;
    this.label_padding = 40;
    this.max_block_height = 20;
    this.transition_duration = 500;
    this.in_transition = false;

    this.tooltip_width = 250;
    this.tooltip_padding = 15;

    this.overview = 'year';
    this.history = ['year'];
    this.selected = {};
  }
}
