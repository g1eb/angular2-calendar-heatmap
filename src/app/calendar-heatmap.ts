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
}
