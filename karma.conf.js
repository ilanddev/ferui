module.exports = function(karma) {
  'use strict';

  const config = {
    autoWatch: true,
    basePath: '',
    frameworks: ['jasmine', 'jasmine-matchers', '@angular-devkit/build-angular'],
    plugins: [
      // Frameworks
      require('karma-jasmine'),
      require('karma-jasmine-matchers'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-scss-preprocessor'),
      // Reporters
      require('karma-jasmine-html-reporter'),
      require('karma-htmlfile-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-mocha-reporter'),
      require('karma-notify-reporter'),
      // Launchers
      require('karma-chrome-launcher'),
    ],
    files: [
      // Entry point to all our spec files
      { pattern: './tests/tests.entry.ts', watched: false },
    ],
    preprocessors: {
      'src/ferui-components/**/*.scss': ['scss'],
    },
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ['mocha', 'coverage-istanbul', 'html', 'notify'],
    htmlReporter: {
      outputFile: './reports/unit/index.html',
      useLegacyStyle: true,
      useCompactStyle: true,
    },
    scssPreprocessor: {
      options: {
        sourceMap: true,
        includePaths: ['node_modules'],
      },
    },
    coverageIstanbulReporter: {
      dir: './reports/coverage/',
      fixWebpackSourcePaths: true,
      reports: ['html', 'lcovonly', 'cobertura'],
      thresholds: {
        emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
        global: {
          statements: 90,
          lines: 90,
          branches: 90,
          functions: 90,
        },
      },
    },
    browsers: ['ChromeHeadless'],
    browserNoActivityTimeout: 100000,
    port: 9292,
    runnerPort: 9393,
    colors: true,
    logLevel: karma.LOG_INFO,
    singleRun: !!process.env.CIRCLECI,
    concurrency: Infinity,
    captureTimeout: 120000,
    customLaunchers: {
      base: 'Chrome',
      ChromeHeadless: {
        flags: ['--headless', '--disable-gpu', '--remote-debugging-port=9222'],
      },
    },
    mochaReporter: {
      ignoreSkipped: true,
    },
  };

  karma.set(config);
};
