import { defineConfig } from 'cypress';

export default defineConfig({
  screenshotOnRunFailure: false,
  video: false,
  trashAssetsBeforeRuns: true,
  component: {
    supportFile: '../cypress/support/component.js',
    indexHtmlFile: '../cypress/support/component-index.html',
    specPattern: '**/*.unit.cy.js',
    devServer: {
      bundler: 'vite',
    },
  },
});
