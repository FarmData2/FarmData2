import { defineConfig } from 'cypress';

export default defineConfig({
  screenshotOnRunFailure: false,
  video: false,
  trashAssetsBeforeRuns: true,
  chromeWebSecurity: false,
  component: {
    supportFile: '../cypress/support/component.js',
    indexHtmlFile: '../cypress/support/component-index.html',
    specPattern: '**/*.comp.cy.js',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
});
