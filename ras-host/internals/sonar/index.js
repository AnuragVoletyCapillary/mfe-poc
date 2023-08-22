const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner({
  serverUrl: 'http://localhost:9005',
  options: {
    'sonar.projectKey': 'LoyaltyPlus',
    'sonar.projectName': 'LoyaltyPlus',
    'sonar.projectVersion': '1.0',
    'sonar.sources': 'app/components',
    'sonar.exclusions': 'app/**/i18n.js,app/**/initialState.js,app/**/constants.js,app/**/tests/**/*.js,app/constants/**/*.js,app/constants/**/*.constants.js,app/**/*.stories.js,app/**/*.mockData.js,app/**/mockData.js,app/**/mockData/**/*.js,app/**/__mocks__/*.js,app/**/Loadable.js,app/**/index.js,app/**/tests/data.js,app/**/*.style.js,app/**/style.js,app/**/actions.js,app/**/*.stories.js,app/**/messages.js,app/**/*.snap,app/**/config/*.js,app/**/mocks/*.js',
    'sonar.tests': 'app/components',
    'sonar.test.inclusions': 'app/**/*.test.js',
    'sonar.javascript.lcov.reportPaths': 'reports/coverage/lcov.info',
    'sonar.testExecutionReportPaths': 'reports/tests/test-reporter.xml'
  }
}, () => {});