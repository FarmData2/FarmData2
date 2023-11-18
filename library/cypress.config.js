import { defineConfig } from 'cypress';

export default defineConfig({
  screenshotOnRunFailure: false,
  video: false,
  trashAssetsBeforeRuns: true,
  e2e: {
    baseUrl: 'http://farmos',
    specPattern: '**/*.unit.cy.js',
    devServer: {
      bundler: 'vite',
    },
  },
});
