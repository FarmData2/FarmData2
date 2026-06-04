# Contributing

Welcome. We are thrilled that you are interested in contributing to FarmData2. This document contains all the information that you need to get started.

## Ways to Contribute

We welcome many different types of contributions:

- **Documentation**: Improve the documentation in any way - from fixing typos and grammar to revising existing documentation for correctness and clarity, to adding new documentation to help others.
- **Running Tests**: Run the test suite and report or confirm failing tests in the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues). Be sure search for an existing report before creating a new one.
- **Issue Gardening**: Help to keep the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues) up to date and useful. Pick a ticket and check to see if the bug it reports still exist or the improvement it requests still make sense. Then report your findings and any clarifying information in a comment on the ticket in the issue tracker.
- **Pull Request Reviews**: Find an [open pull request](https://github.com/FarmData2/FarmData2/pulls), check it out locally, build it, and test it. Let the maintainers know if the pull request accomplishes its purpose by adding a comment to the pull request reporting your findings.
- **Bug Reporting**: Work with the FarmData2 application and use the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues) to report any bugs you encounter.
- **Improvement Suggestions**: Work with the FarmData2 application and propose your ideas for how FarmData2 can be improved in the [suggestions topic](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com).
- **Bug Fixes**: Make a pull request for changes to the code or tests to fix a bug reported in the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues).
- **New Features**: Propose, discuss and provide feedback on new features in the [suggestions topic](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com). Then take the next step and make a pull request that implements a new feature.
- **Other Ideas**: If you have other ideas for contributions, propose them on the [suggestions topic](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com).

## Getting started

The following are some things that you'll need to do to get started on the path to contributing to FarmData2.

### 1. Review the FarmData2 Policies

The following documents contain the essential FarmData2 policies.

1. [FarmData2 Code of Conduct](./CODE_OF_CONDUCT.md)
2. [FarmData2 Licensing](./LICENSE.md)
3. [FarmData2 AI Policy](./AI_POLICY.md)

### 2. Join the FarmData2 Community

The FarmData2 community uses [Zulip](https://zulip.com/) for communications.

1. Create a account on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com).
2. [Introduce Yourself](https://farmdata2.zulipchat.com/#narrow/channel/603473-Newcomers/topic/Introduce.20Yourself/with/496454405) to the FarmData2 community.
3. Browse some the _channels_ on the FarmData2 Zulip chat
   - [Newcomers](https://farmdata2.zulipchat.com/#narrow/channel/603473-Newcomers) - A channel created specifically as a place for newcomers to the FarmData2 community to ask questions.
   - [Install](https://farmdata2.zulipchat.com/#narrow/channel/592674-Install) - A channel for questions about the installation of FarmData2.
   - [Contributors](https://farmdata2.zulipchat.com/#narrow/channel/271292-Contributors) - A channel for FarmData2 contributors to ask questions, discuss issues and debate design decisions.
   - [Suggestions](https://farmdata2.zulipchat.com/#narrow/channel/603478-Suggestions) - A channel for discussing suggestions for changes, additions or anything related to improving FarmData2.

If you are new to Zulip, the [Getting Started with Zulip Page](https://zulip.com/help/getting-started-with-zulip) from the [Zulip Help Center](https://zulip.com/help/) provides a quick introduction.

### 3. Install the FarmData2 Development Environment

FarmData2 provides a [Codespaces](https://docs.github.com/en/codespaces/about-codespaces/what-are-codespaces) based development environment that simplifies the process of contributing.

1. [Install the FarmData2 Development Environment](./INSTALL.md)

### 4. Familiarize Yourself with FarmData2

With your FarmData2 Development Environment up and running, you can now familiarize yourself with the FarmData2 application, its codebase and its documentation.

1. Take [A Quick Tour of FarmData2](docs/contributing/tour.md).
2. Get an [Overview of the FarmData2 Codebase](docs/contributing/codebase.md).
3. Browse the [FarmData2 Documentation](docs/index.md) to get an idea of what is available.

### 5. Use the FarmData2 Contribution Workflow

Contributions of code and documentation to FarmData2 are made using a modified [forking workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow). Not every contribution will be the same, but the prototypical workflow will contain the following steps. **Click the step number to see more detailed information about the step.**

<!-- eslint disable no-heading-punctuation maximum-heading-length -->
<!-- prettier-ignore-start -->
<!-- vale RedHat.HeadingPunctuation = NO -->
<!-- vale Google.HeadingPunctuation = NO -->
<!-- vale Microsoft.HeadingPunctuation = NO -->

> #### [0.](./docs/contributing/workflow/0.md) Prerequisite Knowledge.
> #### [1.](./docs/contributing/workflow/1.md) Find something to work on.
> #### [2.](./docs/contributing/workflow/2.md) Comment on the issue ticket that you found.
> #### [3.](./docs/contributing/workflow/3.md) Create or Restart the FarmData2 development environment codespace.
> #### [4.](./docs/contributing/workflow/4.md) Synchronize your `development` branch with the upstream repository.
> #### [5.](./docs/contributing/workflow/5.md) Create and switch to a new feature branch.
> #### [6.](./docs/contributing/workflow/6.md) Make and test changes.
> #### [7.](./docs/contributing/workflow/7.md) Commit changes to your feature branch.
> #### [8.](./docs/contributing/workflow/8.md) Merge changes to the upstream `development` branch into your feature branch.
> #### [9.](./docs/contributing/workflow/9.md) Push your feature branch to your fork on GitHub.
> #### [10.](./docs/contributing/workflow/10.md) Create a pull request asking to merge your feature branch into the upstream `development` branch.
> #### [11.](./docs/contributing/workflow/11.md) Request a Copilot Pull Request Review (optional).
> #### [12.](./docs/contributing/workflow/12.md) Address all comments, questions, and suggestions.
> #### 13. Get your PR merged and celebrate your accomplishment. &#x1F389;

<!-- eslint enable no-heading-punctuation maximum-heading-length -->
<!-- vale RedHat.HeadingPunctuation = YES -->
<!-- vale Google.HeadingPunctuation = YES -->
<!-- vale Microsoft.HeadingPunctuation = YES -->
<!-- prettier-ignore-end -->

If you have any questions about the workflow, reach out on the FarmData2 [Newcomers](https://farmdata2.zulipchat.com/#narrow/channel/603473-Newcomers) or [Contributors](https://farmdata2.zulipchat.com/#narrow/channel/271292-Contributors) channels on Zulip.
