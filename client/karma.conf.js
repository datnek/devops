// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

/*Étant donné que l'hôte, sur lequel le pipeline exécute toutes
 les étapes automatisées, n'a pas installé Chrome,
  nous devons ajouter un marionnettiste pour pouvoir
utiliser ChromeHeadless sur Azure DevOps.
 */

const process = require('process');
process.env.CHROME_BIN = require('puppeteer').executablePath();


module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-junit-reporter')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reports: ['html', 'lcovonly', 'text-summary', 'cobertura'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml', 'junit'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    //browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
