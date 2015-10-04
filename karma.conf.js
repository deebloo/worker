module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      './src/worker.js',
      './spec/*.spec.js'
    ],

    // web server port
    port: 14523,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    preprocessors: {
      'src/*.js': 'coverage'
    },

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    browsers: ['Chrome', 'Firefox', 'Safari'],

    reporters: ['coverage', 'progress'],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
