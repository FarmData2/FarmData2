/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:json/recommended',
    'plugin:prettier/recommended',
    'plugin:md/prettier',
  ],
  overrides: [
    {
      files: ['**/*.comp.cy.js', '**/*.unit.cy.js', '**/*.e2e.cy.js'],
      extends: ['plugin:cypress/recommended'],
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
