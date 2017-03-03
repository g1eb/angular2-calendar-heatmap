import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <calendar-heatmap
      [data]="data"
      [color]="color"
      [overview]="overview"
      (handler)="print($event)">
    </calendar-heatmap>
  `,
})
export class AppComponent  {
  data = [{
    'key': 'value',
  }];
  color = '#cd2327';
  overview = 'year';

  print(val: object):void {
    console.log(val);
  }
}
