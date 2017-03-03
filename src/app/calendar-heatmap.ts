import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'calendar-heatmap',
  template: `
    <h1>Data: {{ data | json }}</h1>
    <h1>Color: {{ color }}</h1>
    <h1>Overview: {{ overview }}</h1>
    <button (click)="clickHandler()">Click Me</button>
  `,
  styles: [`
    :host {
      color: red;
    }
  `],
  styleUrls:  ['./src/app/calendar-heatmap.css'],
})
export class CalendarHeatmap  {
  @Input() data: Array<object>;
  @Input() color: string;
  @Input() overview: string;

  @Output() handler: EventEmitter<object> = new EventEmitter<object>();

  clickHandler () {
    this.handler.emit(this.data);
  }
}
