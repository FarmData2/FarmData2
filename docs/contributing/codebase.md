# Overview of the FarmData2 Codebase

This document provides a high level overview of the organization of the FarmData2 codebase, and the tools and technologies that are used.

FarmData2 is built as a plugin module for [farmOS](https://farmos.org/) which is a [Drupal](https://www.drupal.org/) application. However, very little of the FarmData2 code requires any knowledge of Drupal.

Primary development of the module and the associated projects occurs in the [FarmData2 Organization on GitHub](https://github.com/FarmData2). All source code, documentation and other resources can be found there.

- More details coming soon!

modules
entry points
components
libraries




=== Raw Notes Below ===

FarmData2 is a plugin module for [farmOS](https://farmos.org/).

The FarmData2 front-end is [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) with [Vue.js v3](https://vuejs.org/) and [BootstrapVueNext](https://bootstrap-vue-next.github.io/bootstrap-vue-next/). A working knowledge of [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) and [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) are also required for FarmData2 front-end development. FarmData2 accesses its data through the [farmOS.js library](https://github.com/farmOS/farmOS.js), which provides a JavaScript wrapper around the [farmOS API](https://farmos.org/development/api/).

FarmData2 uses several other tools and technologies. Is uses [GitHub flavored Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) for writing documentation and [JSDoc](https://jsdoc.app/) with [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown/wiki) for documenting library code and Vue.js components. It uses the [Cypress](https://www.cypress.io/) testing framework for unit testing, Vue Component Testing, and End-to-End Testing. [Bash scripts](https://www.gnu.org/software/bash/manual/bash.html) automate common tasks in FarmData2. A postgres database and the FarmData2 Development Environment run in [Docker containers](https://docs.docker.com/). Dependencies within the FarmData2 Development Environment are manages with [npm](https://docs.npmjs.com/). [Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks), [GitHub actions](https://docs.github.com/en/actions), and [Vite](https://vitejs.dev/guide/) automate testing, linting and building releases.

While, farmOS is a [Drupal](https://www.drupal.org/) application, little of the FarmData2 code requires any knowledge of Drupal.

The [Overview of the FarmData2 Codebase](codebase.md) document provides further details.
