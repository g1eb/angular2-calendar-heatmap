/**
 * WEB ANGULAR VERSION
 * (based on systemjs.config.js in angular.io)
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    // DEMO ONLY! REAL CODE SHOULD NOT TRANSPILE IN THE BROWSER
    transpiler: 'ts',
    typescriptOptions: {
      // Copy of compiler options in standard tsconfig.json
      "target": "es5",
      "module": "system",
      "moduleResolution": "node",
      "sourceMap": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "lib": ["es2015", "dom"],
      "noImplicitAny": true,
      "suppressImplicitAnyIndexErrors": true
    },
    meta: {
      'typescript': {
        "exports": "ts"
      }
    },
    paths: {
      // paths serve as alias
      'npm:': 'https://unpkg.com/',
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      // other libraries
      'rxjs': 'npm:rxjs@5.0.1',
      'ts': 'npm:plugin-typescript@5.2.7/lib/plugin.js',
      'typescript': 'npm:typescript@2.0.10/lib/typescript.js',

      // moment
      'moment': 'npm:moment@2.19.1/min/moment.min.js',

      // d3
      'd3': 'npm:d3@4.11.0',
      'd3-array': 'npm:d3-array@1.2.1',
      'd3-collection': 'npm:d3-collection@1.0.4',
      'd3-random': 'npm:d3-random@1.1.0',
      'd3-ease': 'npm:d3-ease@1.0.3',
      'd3-polygon': 'npm:d3-polygon@1.0.3',
      'd3-path': 'npm:d3-path@1.0.5',
      'd3-quadtree': 'npm:d3-quadtree@1.0.3',
      'd3-queue': 'npm:d3-queue@3.0.7',
      'd3-shape': 'npm:d3-shape@1.2.0',
      'd3-color': 'npm:d3-color@1.0.3',
      'd3-interpolate': 'npm:d3-interpolate@1.1.5',
      'd3-dispatch': 'npm:d3-dispatch@1.0.3',
      'd3-dsv': 'npm:d3-dsv@1.0.7',
      'd3-request': 'npm:d3-request@1.0.6',
      'd3-timer': 'npm:d3-timer@1.0.7',
      'd3-time': 'npm:d3-time@1.0.7',
      'd3-format': 'npm:d3-format@1.2.0',
      'd3-time-format': 'npm:d3-time-format@2.1.0',
      'd3-scale': 'npm:d3-scale@1.0.6',
      'd3-selection': 'npm:d3-selection@1.1.0',
      'd3-transition': 'npm:d3-transition@1.1.0',
      'd3-axis': 'npm:d3-axis@1.0.8',
      'd3-hierarchy': 'npm:d3-hierarchy@1.1.5',
      'd3-force': 'npm:d3-force@1.1.0',
      'd3-drag': 'npm:d3-drag@1.2.1',
      'd3-voronoi': 'npm:d3-voronoi@1.1.2',
      'd3-zoom': 'npm:d3-zoom@1.6.0',
      'd3-brush': 'npm:d3-brush@1.0.4',
      'd3-chord': 'npm:d3-chord@1.0.4',
      'd3-geo': 'npm:d3-geo@1.9.0',

      // calendar heatmap
      'angular2-calendar-heatmap':          'dist/calendar-heatmap.js',

    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.ts',
        defaultExtension: 'ts'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'd3': { main: 'build/d3.min.js', defaultExtension: 'js' },
      'd3-array': { main: 'build/d3-array.js', defaultExtension: 'js' },
      'd3-collection': { main: 'build/d3-collection.js', defaultExtension: 'js' },
      'd3-random': { main: 'build/d3-random.js', defaultExtension: 'js' },
      'd3-ease': { main: 'build/d3-ease.js', defaultExtension: 'js' },
      'd3-polygon': { main: 'build/d3-polygon.js', defaultExtension: 'js' },
      'd3-path': { main: 'build/d3-path.js', defaultExtension: 'js' },
      'd3-quadtree': { main: 'build/d3-quadtree.js', defaultExtension: 'js' },
      'd3-queue': { main: 'build/d3-queue.js', defaultExtension: 'js' },
      'd3-shape': { main: 'build/d3-shape.js', defaultExtension: 'js' },
      'd3-color': { main: 'build/d3-color.js', defaultExtension: 'js' },
      'd3-interpolate': { main: 'build/d3-interpolate.js', defaultExtension: 'js' },
      'd3-dispatch': { main: 'build/d3-dispatch.js', defaultExtension: 'js' },
      'd3-dsv': { main: 'build/d3-dsv.js', defaultExtension: 'js' },
      'd3-request': { main: 'build/d3-request.js', defaultExtension: 'js' },
      'd3-timer': { main: 'build/d3-timer.js', defaultExtension: 'js' },
      'd3-time': { main: 'build/d3-time.js', defaultExtension: 'js' },
      'd3-format': { main: 'build/d3-format.js', defaultExtension: 'js' },
      'd3-time-format': { main: 'build/d3-time-format.js', defaultExtension: 'js' },
      'd3-scale': { main: 'build/d3-scale.js', defaultExtension: 'js' },
      'd3-selection': { main: 'build/d3-selection.js', defaultExtension: 'js' },
      'd3-transition': { main: 'build/d3-transition.js', defaultExtension: 'js' },
      'd3-axis': { main: 'build/d3-axis.js', defaultExtension: 'js' },
      'd3-hierarchy': { main: 'build/d3-hierarchy.js', defaultExtension: 'js' },
      'd3-force': { main: 'build/d3-force.js', defaultExtension: 'js' },
      'd3-drag': { main: 'build/d3-drag.js', defaultExtension: 'js' },
      'd3-voronoi': { main: 'build/d3-voronoi.js', defaultExtension: 'js' },
      'd3-zoom': { main: 'build/d3-zoom.js', defaultExtension: 'js' },
      'd3-brush': { main: 'build/d3-brush.js', defaultExtension: 'js' },
      'd3-chord': { main: 'build/d3-chord.js', defaultExtension: 'js' },
      'd3-geo': { main: 'build/d3-geo.js', defaultExtension: 'js' },
    },
  });

})(this);
