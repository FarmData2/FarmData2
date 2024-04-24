# Overview of the FarmData2 Codebase

This document provides a high level overview of the tools and technologies used in FarmData2 and the organization of the codebase.

FarmData2 is built as a plugin module for [farmOS](https://farmos.org/) which is a [Drupal](https://www.drupal.org/) application. However, very little of the FarmData2 code requires any knowledge of Drupal.

Primary development of the module and the associated projects occurs in the [FarmData2 Organization on GitHub](https://github.com/FarmData2). All source code, documentation and other resources can be found there.

- More details coming soon!

===

The FarmData2 front-end is built in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) using [Vue.js v3](https://vuejs.org/) with [BootstrapVueNext](https://bootstrap-vue-next.github.io/bootstrap-vue-next/). A working knowledge of [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) and [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) are also required for FarmData2 front-end development. FarmData2 accesses its data using the [farmOS.js library](https://github.com/farmOS/farmOS.js), which provides a JavaScript wrapper around the [farmOS API](https://farmos.org/development/api/).

A number of other tools and technologies are involved in development work on FarmData2. [GitHub flavored Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) is used for writing documentation and [JSDoc](https://jsdoc.app/) with [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown/wiki) is used for documenting library code and Vue.js components. The [Cypress](https://www.cypress.io/) testing framework is used for unit testing, Vue Component Testing and End-to-End Testing. [Bash scripts](https://www.gnu.org/software/bash/manual/bash.html) are used to automate many of the common tasks in FarmData2. [Docker containers](https://docs.docker.com/) are used to run farmOS, a postgres database and the FarmData2 Development Environment. [npm](https://docs.npmjs.com/) is used to manage dependencies within the FarmData2 Development Environment. [Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks), [GitHub actions](https://docs.github.com/en/actions), and [Vite](https://vitejs.dev/guide/) are used for automated testing, linting and building releases.
