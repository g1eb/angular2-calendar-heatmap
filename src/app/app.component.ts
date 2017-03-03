import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <calendar-heatmap
      [someObject]="someObject"
      [someString]="someString"
      [someNumber]="someNumber"
      (onChange)="print($event)">
    </calendar-heatmap>
  `,
})

export class AppComponent  {
  someObject = {
    'key': 'value',
  };
  someString = 'asdfasdfadf';
  someNumber = 1234;

  print(val: any) {
    console.log(val);
  }
}
