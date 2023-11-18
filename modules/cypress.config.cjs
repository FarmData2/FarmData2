/* eslint-disable no-undef */

/*
 * The cypress.config.js files in farm_fd2, farm_fd2_example, and
 * farm_fd2_school are symbolic links to this file. So they all
 * share the same Cypress configuration.
 */

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  screenshotOnRunFailure: false,
  video: false,
  trashAssetsBeforeRuns: true,
  chromeWebSecurity: false,
  e2e: {
    specPattern: 'src/entrypoints/**/*.cy.js',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
  component: {
    specPattern: '../../components/**/*.comp.cy.js',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
});
