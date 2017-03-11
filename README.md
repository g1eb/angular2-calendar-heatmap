# Angular component for D3.js Calendar Heatmap

This [d3.js](https://d3js.org/) heatmap representing time series data is used to visualize tracked time over the past year, showing details for each of the days on demand. Converted into an angular component for your convenience :)  

Includes visualization of year, month, week and day overview.  

Inspired by Github's contribution chart.

Based on [D3.js Calendar Heatmap](https://github.com/DKirwan/calendar-heatmap) by [Darragh Kirwan](https://github.com/DKirwan)  
Aaand [Calendar View](https://bl.ocks.org/mbostock/4063318) by [Mike Bostock](https://github.com/mbostock)

## Demo
Click <a href="https://rawgit.com/g1eb/angular2-calendar-heatmap/master/" target="_blank">here</a> for a live demo.

### Year overview
[![Angular component for d3.js calendar heatmap - year overview](https://raw.githubusercontent.com/g1eb/angular2-calendar-heatmap/master/images/screenshot_year_overview.png)](https://rawgit.com/g1eb/angular2-calendar-heatmap/master/)

### Month overview
[![Angular component for d3.js calendar heatmap - month overview](https://raw.githubusercontent.com/g1eb/angular2-calendar-heatmap/master/images/screenshot_month_overview.png)](https://rawgit.com/g1eb/angular2-calendar-heatmap/master/)

### Week overview
[![Angular component for d3.js calendar heatmap - week overview](https://raw.githubusercontent.com/g1eb/angular2-calendar-heatmap/master/images/screenshot_week_overview.png)](https://rawgit.com/g1eb/angular2-calendar-heatmap/master/)

### Day overview
[![Angular component for d3.js calendar heatmap - day overview](https://raw.githubusercontent.com/g1eb/angular2-calendar-heatmap/master/images/screenshot_day_overview.png)](https://rawgit.com/g1eb/angular2-calendar-heatmap/master/)

## Installation

1) Install 'angular2-calendar-heatmap' with bower

```
bower install angular2-calendar-heatmap
```

Or:

```
npm install angular2-calendar-heatmap
```

2) Import CalendarHeatmap component in your angular module


```javascript
import { CalendarHeatmap } from 'calendar-heatmap';

declarations: [ ...... , CalendarHeatmap ],
```

3) Use 'calendar-heatmap' component inside a template

```html
<calendar-heatmap
  [data]="data"
  [color]="color"
  [overview]="overview"
  (handler)="print($event)">
</calendar-heatmap>
```

### Attributes

|Property        | Usage           | Default  | Required |
|:------------- |:-------------|:-----:|:-----:|
| data | Time series data from max a year back | none | yes |
| color | Theme hex color | #45ff00 | no |
| overview | Initial overview type (choices are: year, month, day) | year | no |
| handler | Handler function is fired on click of a time entry in daily overview | none | no |

### Example data

Time series data for each day going 1 year back.
Each day has a total time tracked (in seconds).
Details, if provided, are shown in a tooltip as well as in daily overview.

```
var data = [{
  "date": "2016-01-01",
  "total": 17164,
  "details": [{
    "name": "Project 1",
    "date": "2016-01-01 12:30:45",
    "value": 9192
  }, {
    "name": "Project 2",
    "date": "2016-01-01 13:37:00",
    "value": 6753
  },
  .....
  {
    "name": "Project N",
    "date": "2016-01-01 17:52:41",
    "value": 1219
  }]
}]
```

### Optimization

In some cases details array could be large and in order to fit the data into the tooltip a short summary is generated with distinct projects and their total tracked time for that date.
In terms of optimization summary data can be computed server-side and passed in using the ```summary``` attribute.
And in addition to the data structure described above this would result in a summary dictionary with distinct project names and total values of tracked time in seconds, e.g.:

```
var data = [{
  "date": "2016-01-01",
  "total": 17164,
  "details": [.....],
  "summary": [{
    "name": "Project 1",
    "value": 9192
  }, {
    "name": "Project 2",
    "value": 6753
  },
  .....
  {
    "name": "Project N",
    "value": 1219
  }]
}]
```

See [index.html](https://github.com/g1eb/angular2-calendar-heatmap/blob/master/index.html) for an example implementation with random data or click <a href="https://rawgit.com/g1eb/angular2-calendar-heatmap/master/" target="_blank">here</a> for a live demo.

## AngularJS directive

If you want to use this heatmap as an AngularJS directive (version 1.x), see [angular-calendar-heatmap](https://github.com/g1eb/angular-calendar-heatmap)

## Non-Angular version

If you are looking for a plain vanilla javascript version of the heatmap, check out [calendar-heatmap-graph](https://github.com/g1eb/calendar-heatmap)

## Dependencies

* [Angular](https://angular.io/)
* [moment.js](https://momentjs.com/)
* [d3.js](https://d3js.org/)
