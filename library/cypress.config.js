import { defineConfig } from 'cypress';

export default defineConfig({
  screenshotOnRunFailure: false,
  video: false,
  trashAssetsBeforeRuns: true,
  component: {
    specPattern: '**/*.unit.cy.js',
    devServer: {
      bundler: 'vite',
    },
  },
});
