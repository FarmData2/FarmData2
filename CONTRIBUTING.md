# Contributing

TODO: NEED TO EXPAND, REVISE AND CLEAN THIS UP!

## Connecting

- Dev server

  - npm run dev:fd2 (or examples, or school)
  - localhost:5173/fd2/main/ (or fd2_examples/main/ or fd2_school/main/)
    - note: trailing / is important!
    - changes are live

- Preview server

  - npm run preview:fd2 (or examples, or school)
  - localhost:4173/fd2/main/ (or fd2_examples/main/ or fd2_school/main/)
    - note: trailing / is important!
    - changes are not live (tests bundling)
      - use npm run watch:fd2 (or examples, or school) to see changes live

- Live server

  - npm run build:fd2 (or examples, or school)
  - farmos
  - changes are not live (running from build)
    - use npm run watch:fd2 (or examples, or school) to see changes live

## Pre-commit checks

- npm run check:staged
- If tests do not complete... fd2-down.bash, fd2-up.bash

  - usually a zombie dev server out there.

- cspell runs on all files
  - use a known word or add to .fd2-cspell.txt if unavoidable.
- prettier runs on all files that it knows how to format.
  - formatting is automatically applied.
- shellcheck runs on all bash scripts
- shfmt runs on all bash scripts
  - formatting is automatically applied.
- markdown-link-check on all md files
- eslint on all .vue .js .jsx .cjs .mjs .json .md
- e2e tests (in modules)
  - all cy.js tests in entrypoint directory for a staged .vue
  - all .cy.js files that are staged.
- unit tests (in modules)
  - all lib.\*.unit.cy.js tests in entrypoint directory if lib.js is staged.
  - all lib.\*.unit.cy.js tests in entrypoint directory that are staged
- component tests (in components)
  - all comp.cy.js tests in component directory for a staged .vue
  - all comp.cy.js files that are staged.
- unit tests (in library)
  - all unit.cy.js tests in library directory for a staged .js
  - all unit.cy.js tests that are staged.

### Development Workflow

To change, modify, update, add to FarmData2

- Prerequisites:
  - Install Docker Desktop and TigerVNC Viewer
  - Fork the `FarmData2` upstream repository to your local machine
  - cd FarmData2/docker
  - ./fd2-up.bash
  - connect to localhost:5901 with Tiger VNC viewer

1. Ensure that your `development` branch is synchronized with the `upstream`
2. Create a new feature branch from the `development` branch
3. Make and test changes in your feature branch
4. Commit to your feature branch.
   - Identify and resolve any issues raised by the pre-commit checks.
   - Try your commit again as necessary.
5. Pull and merge any new changes to the `development` branch into your feature branch
6. Create a pull request to the `development` branch in the upstream

A maintainer will:

1. Review your pull request and provide feedback
2. If/when appropriate squash merge your pull request into the `development` branch
   - The maintainer will use a squash merge commit message with a conventional commit message.
     - valid types are: build, chore, ci, docs, feat, fix, perf, refactor, style, test
     - valid scopes are: (dev), (comp), (lib), (fd2), (examples), (school)
     - If a change to farm_fd2 modifies the module it must have type fix or feat.
       - If the commit message has a scope of (fd2) and a type of fix or feat then:
         - The merge will create a pre-release `vX.Y.Z-development.n`
           - X.Y.Z is the semantic version of the next release if it were created at the moment.
           - n is a sequence number for pre-releases with the same semantic version number.
         - fix -> patch bump
         - feat -> minor bump
         - BREAKING CHANGE -> major bump
     - Add examples of conventional commits here for reference.
       - link to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Creating a GitHub Release of the farm_fd2 Module

When changes warranting a new release have been added to the `development` branch a maintainer will create a new release by:

1. Updating the `production` and `development` branches from the upstream.
2. Fast-forward merging the latest `development` branch into the `production` branch
3. Pushing the `production` branch to the upstream
   - This will create a new release `vX.Y.Z` in GitHub
     - X.Y.Z is the semantic version of the release
     - All but the most recent `development` pre-release will be deleted
     - The `CHANGELOG.md` file in the `production` branch is updated with the changes added
     - The `production` branch is _backmerged_ into the `development` branch
   - A release for the farm_fd2 module will be setup in git.drupalcode.org
     - Code changes to farm_fd2 module will be pushed to the release branch
     - A tag will be created with the current sem ver number.
   - The local production and development branches will be updated.
4. Manually create the drupal release by visiting: <https://www.drupal.org/node/add/project-release/3396323> and selecting the "Release branch or tag" for the new release.
   - See <https://www.drupal.org/docs/develop/git/git-for-drupal-project-maintainers/creating-a-project-release> for detailed instructions about creating the release.

## Development Utilities

### Getting Log / Asset Type Details

Need to figure out how to use the `library/farmosUtil/printFarmOSLogs.js` script.

## Terminology

- Entry Points
- Components
- Libraries
- etc...
