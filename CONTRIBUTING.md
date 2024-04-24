# Contributing

Welcome! We are thrilled that you are interested in contributing to FarmData2. This document contains all of the information that you need to get started.

If you are new to Open Source contribution, this document is ordered top-to-bottom to provide what you need to know to begin contributing to FarmData2. Following along in order and exploring the links that it contains would be a good way to start.

If you are an experienced Open Source contributor, you might just skim this document and then jump in by [installing the FarmData2 Development Environment](INSTALL.md), reviewing the [Overview of the FarmData2 Codebase](docs/contributing/codebase.md) and the [FarmData2 Contribution Workflow](#the-farmdata2-workflow) and then referring to the [FarmData2 Documentation](docs/index.md) as necessary.

## Ways to Contribute

There are many different types of contributions that we welcome:

- Documentation: Improve the documentation in any way - from fixing typos and grammar to revising existing documentation for correctness and clarity, to adding new documentation that others will find useful.
- Running Tests: Run the test suite and report or confirm reported failing tests in the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues).
- Issue Gardening: Help to keep the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues) up to date and useful by checking if bugs still exist or if requested improvements still need to be made and adding clarifying information to the associated issue tracker tickets.
- Bug Reporting: Work with the FarmData2 application and use the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues) to report any bugs you encounter.
- Improvement Suggestions: Work with the FarmData2 application and propose your ideas for how FarmData2 can be improved in the [suggestions topic](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com).
- Bug Fix: Make a pull request for changes to the code and/or tests that fix a bug that has been reported in the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues).
- New Features: Propose, discuss and provide feedback on new features in the the [suggestions topic](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com). Then take the next step and make a pull request that implements a new feature.
- Other Ideas: If you have other ideas for contributions, propose them on the [suggestions topic](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com).

## Getting Started

This section outlines some things that you'll need to do to get started on the path to contributing to FarmData2:

### 1. Review FarmData2's Code of Conduct

FarmData2 is committed to creating an open, welcoming, inclusive, and harassment-free experience for all community members.

Please review the Code of Conduct before engaging with the FarmData2 community.

- [FarmData2 Code of Conduct](CODE_OF_CONDUCT.md)

### 2. Review FarmData2's Licensing

We use a variety of licenses and agreements to ensure that FarmData2 remains free and open source while protecting both the project and its community of contributors.

Please review the Licensing information before contributing to FarmData2.

- [FarmData2 Licensing](LICENSE.md)

### 3. Connect with the FarmData2 Community

The FarmData2 community uses the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com) as its primary tool for communications. It is where you can search for answers and reach out to the community with questions.

The following are links to some the Zulip _streams_ and _topics_ that you may find most useful:

- [Introduce Yourself](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/Introduce.20Yourself) - A stream where new developers can introduce themselves to the community.
- [Newcomer Questions](https://farmdata2.zulipchat.com/#narrow/stream/271292-developers/topic/Newcomer.20Questions) - A topic created specifically as a place for newcomers to FarmData2 to ask questions.
- [Install](https://farmdata2.zulipchat.com/#narrow/stream/270906-install) - A stream dedicated to questions about the installation of FarmData2.
- [Developers](https://farmdata2.zulipchat.com/#narrow/stream/271292-developers) - A stream for developers to ask questions, discuss issues and debate design decisions.
- [Suggestions](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions) - A topic where suggestions for changes, additions or anything related to improving FarmData2 can be discussed.

The [Getting Started with Zulip Page](https://zulip.com/help/getting-started-with-zulip) from the [Zulip Help Center](https://zulip.com/help/) provides a quick introduction to using Zulip if you want a few pointers.

### 4. Install the FarmData2 Development Environment

FarmData2 provides a containerized Linux-based development environment with all of the necessary tools and dependencies already installed. This makes it fast and easy to get up and working toward your first FarmData2 contribution.

Descriptions and links to detailed instructions for several different approaches to installing the FarmData2 Development Environment are given in the `INSTALL.md` document linked below:

- [Installing the FarmData2 Development Environment](INSTALL.md)

### 5. Take a Tour

Once you have the FarmData2 Development Environment up and running you may find it useful to take a quick tour of FarmData2 to better understand what it does and how it works.

- [Take a quick tour of FarmData2](docs/contributing/tour.md)

### 6. Learn about FarmData2's Codebase

This document describes the tools and technologies used, the organization of the FarmData2 codebase and some of the terminology used. It is not necessary to learn everything in this document at once, but keeping this document in mind as a reference might be helpful.

- [Overview of the FarmData2 Codebase](docs/contributing/codebase.md)

## The FarmData2 Workflow

FarmData2 uses a modified [forking workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow) to accept contributions from the community. Not every contribution will be exactly the same, but the prototypical workflow will have the steps outlined below.

Please note that all of the following instructions assume that you are working within the FarmData2 Development Environment.

### 1. Find Something to Work On

Peruse the Issue Tracker to find an issue on which to work:

- [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues)

If you are new to FarmData2, you can search the Issue Tracker for tickets with the following labels that indicate that the issue is a good place to get started:

- [![Good First Issue](docs/contributing/images/GoodFirstIssueLabel.jpg)](https://github.com/FarmData2/FarmData2/labels/good%20first%20issue) - The issues described in these tickets are the most approachable and do not require an in depth knowledge of the project or its technologies. They typically involve changes that do not affect the application's behavior. Often a familiarity with Markdown, HTML, JavaScript or Bash scripting is sufficient for addressing these issues. These issues provide a great way to get familiar with the process of making a contribution.

- [![Good Second Issue](docs/contributing/images/GoodSecondIssueLabel.jpg)](https://github.com/FarmData2/FarmData2/labels/Good%20Second%20Issue) - The issues described in these tickets require some understanding of FarmData2 that is typically limited to one or two source files. They will usually require changes that affect behavior and thus may also require creation or modification of unit, component or end-to-end tests. Thus, greater familiarity with Javascript, Vue.js, and/or Cypress tests may be required. These issues provide a great way to dig a little deeper, though still without requiring too deep a dive into the project.

If you have an idea of your own that isn't already in the Issue Tracker, open an issue or propose it in the _suggestions_ topic on the FarmData2 Zulip chat:

- [FarmData2 Zulip chat \_suggestions Topic](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions)

### 2. Claim an Issue

When you find an issue that you would like to work on, make a comment on the ticket expressing your interest. Something like the following is sufficient:

```bash
I would like to work on this issue.
```

If the issue has not already been assigned, or if it hasn't been worked on in a while, one of the project maintainers will then assign the ticket to you.

If you decide not to continue working on that issue, make another comment on the ticket letting us know so that we can assign it to someone else.

### 3. Synchronize `development` with the Upstream

New work in FarmData2 occurs on the `development` branch. So before beginning to address an issue you should synchronize the `development` branch of your local repository and your `origin` repository (i.e. your fork on GitHub) with the `upstream` FarmData2 repository. This ensures that you begin your changes with the most up to date code and documentation.

Open a Terminal window and use the following commands:

```bash
cd FarmData2
git pull --ff-only upstream development
git push origin development
```

If you cloned your FarmData2 repository somewhere other than the `FarmData2` directory in the `fd2dev` home directory you'll need to adjust the `cd` command above.

Please note that all future sections of this document will assume that the directory containing your FarmData2 repository is the current working directory.

### 4. Create and Switch to a Feature Branch

All of the changes that you would like to contribute must be contained in a _feature branch_.

Use the following commands to create and switch to a feature branch. Be sure to replace the text `MyFeatureBranch` with a descriptive name based on the issue you are working on.

```bash
git branch MyFeatureBranch
git switch MyFeatureBranch
git status
```

The output of the `git status` command should confirm that you have created and switched to your new feature branch.

### 5. Make and Test your Changes

Open the _VSCodium IDE_ and modify the contents of the files in your local FarmData2 repository to address the issue.

If your work requires multiple changes you should iterate between this step and and the following step until the issue is addressed.

Depending upon what you are working on, one of the following guides may be helpful:

- [Working on a Vue.js Component or Example](docs/contributing/components.md)
- [Working on Documentation](docs/contributing/documentation.md)
- [Working on an Entry Point](docs/contributing/entry-points.md)
- [Working on Infrastructure](docs/contributing/infrastructure.md)
- [Working on a Library](docs/contributing/libraries.md)

### 6. Commit your Changes

- Use a commit message that has some meaning to you.

  - Will help you go back if you need to later.

- pre-commit checks
  - resolve, re-stage, try commit again
- running individual checks by hand

Consider pushing and creating a draft Pull Request including

- Description
- Closes #123 footers
- co-author footers
  Repeat
  Mark your draft pull request ready for review
  Maintainer will review and take one of three actions
- merge into development with a conventional commit or
- provide feedback and mark as draft again or
- close
  Respond to comments, suggestions, requests for changes
  Update Pull Request with additional changes
  Return to prior step... mark as ready for review
  Eventually maintainer will merge development into production

===

TODO: NEED TO EXPAND, DIVIDE, REVISE AND CLEAN THIS UP!

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
