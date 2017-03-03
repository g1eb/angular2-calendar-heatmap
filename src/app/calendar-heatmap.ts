import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'calendar-heatmap',
  template: `<div #root class="calendar-heatmap"></div>`,
  styleUrls:  ['./src/app/calendar-heatmap.css'],
})
export class CalendarHeatmap  {
  @ViewChild('root') element: object;

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
}
