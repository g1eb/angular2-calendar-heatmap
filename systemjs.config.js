/**
 * WEB ANGULAR VERSION
 * (based on systemjs.config.js in angular.io)
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
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
      '@angular/core': 'npm:@angular/core@4.0.0/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common@4.0.0/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler@4.0.0/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser@4.0.0/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@4.0.0/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http@4.0.0/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router@4.0.0/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms@4.0.0/bundles/forms.umd.js',

      // other libraries
      'rxjs': 'npm:rxjs@5.0.1',
      'ts': 'npm:plugin-typescript@5.2.7/lib/plugin.js',
      'typescript': 'npm:typescript@2.0.10/lib/typescript.js',

      // package dependencies
      'moment': 'npm:moment@2.19.1/min/moment.min.js',
      'd3': 'npm:d3@4.11.0/build/d3.min.js',

      // calendar heatmap
      'angular2-calendar-heatmap': 'src/calendar-heatmap.component.ts',

    },

    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './app/main.ts',
        defaultExtension: 'ts'
      },
      rxjs: {
        defaultExtension: 'js'
      },
    },
  });

})(this);
