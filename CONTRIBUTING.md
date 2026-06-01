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

The FarmData2 community uses the [Zulip](https://zulip.com/) for communications.

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


All contributions must be submitted by a human author.
As per the contributing document you may:
- Create a Pull Request manually
- Use the Pull Request skill


Squash merge generally
  - admittedly introduces provenance issues when AI assists.
  - Critial clearly copyrightable parts should be their own PR.



## The FarmData2 Workflow


******* REVIEW ALL OF THIS AND COMPARE TO THE STEP DETAIL DOCUMENTS TO BE SURE WE GOT EVERYTHING!!!!!


### 7. Push Your Feature Branch

Push your feature branch to your `origin` repository on GitHub. Be sure to replace the text `MyFeatureBranch` with the name of your feature branch.

```bash
git push origin MyFeatureBranch
```

At this point you might:

- go back to [Step #5](#5-make-and-test-your-changes) and add more changes to your feature branch.
- continue to the next step and create a draft pull request to let the maintainers know what you are working on and get some preliminary feedback.
- go to [Step #10](#10-merge-development-branch-into-your-feature-branch) and then [Step #11](#11-mark-your-pull-request-as-ready-for-review) to let the maintainers know your pull request is ready for them to review and consider merging it.

### 8. Create a Draft Pull Request

As you are working on your change you can create a [_draft pull request_](https://github.blog/2019-02-14-introducing-draft-pull-requests/). Creating a draft pull request lets the maintainers know you are working on an issue. It makes your work visible to them, but also makes it clear that your pull request is still a work in progress and not ready for a full review. Draft pull requests are a great way to begin a discussion about what you are doing and get some feedback on your work.

To create a draft pull request:

- Visit your fork of FarmData2 (your `origin`) on GitHub
- [Create the draft pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) for your feature branch.
  - When following the linked directions be sure to use:
    - the `upstream` FarmData2 repository as the "base repository"
    - `development` as the "base branch"
    - your `origin` as the "head repository"
    - your feature branch as the "compare branch"

When you create a new pull request for FarmData2 it will be pre-populated with a template. Each section of the template includes a comment describing what content should be provided in that section. The comments and any unused sections will need to be removed before creating the pull request.

**Be sure to read the "Licensing Certification" section and review the [Developer Certificate of Origin](https://developercertificate.org/) and then check the box.**. Your pull request will not be able to be merged if you do not check the box.

### 9. Discuss and Repeat

If your pull request is ready for review, go to the next step.

Otherwise, go back to [Step #5](#5-make-and-test-your-changes) and continue working on your changes. But, be sure to check your draft pull request frequently for comments, feedback or questions from the maintainers and respond to them.

### 10. Merge `development` Branch into your Feature Branch

The `development` branch might have had new commits added to it since you began your work. These changes might conflict with your changes. To resolve any conflicts you should merge the current `development` branch into your feature branch and resolve any merge conflicts.

```bash
git switch development
git pull --ff-only upstream development
git push origin development
git switch MyFeatureBranch
git merge development
<Resolve Any Merge Conflicts>
git push origin MyFeatureBranch
```

### 11. Mark Your Pull Request as Ready for Review

When you think you have finished your changes and are ready to have the maintainers review them [mark your pull request as ready for review](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/changing-the-stage-of-a-pull-request#marking-a-pull-request-as-ready-for-review)

Maintainer will review (or assign reviewers) and then take one of three actions:

- If everything looks good, they will merge your changes into the `development` branch.
- If they have questions or want to see further changes they will comment on the pull request and mark it as a draft pull request again. In this case you will want to review the feedback and respond to it in the comments or by making more changes ([Step #5](#5-make-and-test-your-changes) and [Step #6](#6-commit-your-changes-to-your-feature-branch)) and pushing them ([Step #7](#7-push-your-feature-branch)) to update your pull request.
- If the maintainers determine that your pull request is not suitable for merging into development (even with changes), they will close the pull request with a comment explaining their decision.

### 12. Respond to comments, suggestions, requests for changes

Review your pull request for comments, feedback or questions from the maintainers and respond to them. This might require you to make more changes ([Step #5](#5-make-and-test-your-changes) and [Step #6](#6-commit-your-changes-to-your-feature-branch)) and to push them ([Step #7](#7-push-your-feature-branch)) to update your pull request. When your pull request has addressed all the changes requested by the maintainers, merge the `development` branch again ([Step #10](#10-merge-development-branch-into-your-feature-branch)) and mark your pull request as ready for review ([Step #11](#11-mark-your-pull-request-as-ready-for-review))
