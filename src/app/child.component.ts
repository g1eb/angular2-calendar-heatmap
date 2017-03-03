import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'child-component',
  template: `
    <h1>Object: {{ someObject | json }}</h1>
    <h1>String: {{ someString }}</h1>
    <h1>Number: {{ someNumber }}</h1>
    <input type="text" name="key" [(ngModel)]="key" placeholder="key" />
    <input type="text" name="value" [(ngModel)]="value" placeholder="value" />
    <button (click)="callOnChange()">Click Me</button>
  `,
  styles: [`
    :host {
      color: red;
    }
  `],
  styleUrls:  ['./src/app/child.component.css'],
})

export class ChildComponent  {
  @Input() someObject: any;
  @Input() someString: string;
  @Input() someNumber: number;

  private key: string;
  private value: string;

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  callOnChange () {
    this.someObject[this.key] = this.value;
    this.key = this.value = '';
    this.onChange.emit(this.someObject);
  }
}
