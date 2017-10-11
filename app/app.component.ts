import { Component } from '@angular/core';

// Declare global variables
declare var d3: any;
declare var moment: any;

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

  // Initialize random data for the demo
  private now = moment().endOf('day').toDate();
  private time_ago = moment().startOf('day').subtract(10, 'year').toDate();
  data = d3.timeDays(this.time_ago, this.now).map((dateElement: any, index: number) => {
    return {
      date: dateElement,
      details: Array.apply(null, new Array(Math.floor(Math.random() * 15))).map((e: number, i: number, arr: any) => {
        return {
          'name': 'Project ' + Math.round(Math.random() * 10),
          'date': function () {
            var projectDate = new Date(dateElement.getTime());
            projectDate.setHours(Math.floor(Math.random() * 24))
            projectDate.setMinutes(Math.floor(Math.random() * 60));
            return projectDate;
          }(),
          'value': 3600 * ((arr.length - i) / 5) + Math.floor(Math.random() * 3600) * Math.round(Math.random() * (index / 365))
        }
      }),
      init: function () {
        this.total = this.details.reduce((prev: number, e: any) => {
          return prev + e.value;
        }, 0);
        return this;
      }
    }.init();
  });

  // Set custom color for the calendar heatmap
  color = '#cd2327';

  // Set overview type (choices are year, month and day)
  overview = 'year';

  // Handler function
  print(val: object):void {
    console.log(val);
  }
}
