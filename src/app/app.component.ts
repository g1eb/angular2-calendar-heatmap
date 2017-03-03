import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <child-component
      [someObject]="someObject"
      [someString]="someString"
      [someNumber]="someNumber"
      (onChange)="print($event)">
    </child-component>
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
