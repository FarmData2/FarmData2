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
  ],
  overrides: [
    {
      files: ['**/*.comp.cy.js', '**/*.unit.cy.js', '**/*.e2e.cy.js'],
      extends: ['plugin:cypress/recommended'],
    },
    {
      files: ['*.md'],
      extends: ['plugin:md/prettier'],
      parser: 'markdown-eslint-parser',
      rules: {
        'prettier/prettier': ['error', { parser: 'markdown' }],
        'md/remark': [
          'error',
          {
            // From: https://scinos.dev/posts/2020-11-24-eslint-for-markdown/
            plugins: [
              ...require('eslint-plugin-md').configs.prettier.rules[
                'md/remark'
              ][1].plugins,

              // List of disabled rules form the preset
              ['lint-maximum-line-length', false],

              // This special plugin is used to allow the syntax <!--eslint ignore <rule>-->.
              // It has to come last!
              ['message-control', { name: 'eslint', source: 'remark-lint' }],
            ],
          },
        ],
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
