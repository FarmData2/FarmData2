import { defineConfig } from 'cypress';

export default defineConfig({
  screenshotOnRunFailure: false,
  video: false,
  trashAssetsBeforeRuns: true,
  e2e: {
    baseUrl: 'http://farmos',
    supportFile: '../cypress/support/e2e.js',
    specPattern: '**/*.unit.cy.js',
    devServer: {
      bundler: 'vite',
    },
  },
});
