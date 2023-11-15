/* eslint-disable no-undef */
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  screenshotOnRunFailure: false,
  video: false,
  trashAssetsBeforeRuns: true,
  e2e: {
    baseUrl: 'http://farmos',
    specPattern: '**/*.unit.cy.js',
  },
});
