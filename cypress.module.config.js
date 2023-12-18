/*
 * The cypress.config.js files in farm_fd2, farm_fd2_example, and
 * farm_fd2_school are symbolic links to this file. So they all
 * share the same Cypress configuration.
 */

import { defineConfig } from 'cypress';

export default defineConfig({
  screenshotOnRunFailure: false,
  video: false,
  trashAssetsBeforeRuns: true,
  chromeWebSecurity: false,
  e2e: {
    supportFile: '../../cypress/support/e2e.js',
    specPattern: 'src/entrypoints/*/*.e2e.cy.js',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
  component: {
    supportFile: '../../cypress/support/component.js',
    indexHtmlFile: '../../cypress/support/component-index.html',
    specPattern: 'src/entrypoints/*/*.unit.cy.js',
    devServer: {
      bundler: 'vite',
    },
  },
});
