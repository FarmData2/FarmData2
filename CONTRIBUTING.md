# Contributing

Welcome. We are thrilled that you are interested in contributing to FarmData2. This document contains all the information that you need to get started.

If you are new to Open Source contribution, this document is ordered top-to-bottom to provide what you need to know to begin contributing to FarmData2. Following along in order and exploring the links that it contains would be a good way to start.

If you are an experienced Open Source contributor, you might just skim this document and then jump in by:

- [installing the FarmData2 Development Environment](INSTALL.md).
- reviewing the [Overview of the FarmData2 Codebase](docs/contributing/codebase.md).
- becoming familiar with the [FarmData2 Contribution Workflow](#the-farmdata2-workflow).
- referring to the [FarmData2 Documentation](docs/index.md) as necessary.

## Ways to Contribute

We welcome different types of contributions:

- Documentation: Improve the documentation in any way - from fixing typos and grammar to revising existing documentation for correctness and clarity, to adding new documentation to help others.
- Running Tests: Run the test suite and report or confirm reported failing tests in the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues).
- Issue Gardening: Help to keep the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues) up to date and useful by checking tickets to see if reported bugs still exist or requested improvements still make sense and then adding clarifying information to the associated issue tracker tickets.
- Bug Reporting: Work with the FarmData2 application and use the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues) to report any bugs you encounter.
- Improvement Suggestions: Work with the FarmData2 application and propose your ideas for how FarmData2 can be improved in the [suggestions topic](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com).
- Bug Fix: Make a pull request for changes to the code or tests to fix a bug reported in the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues).
- New Features: Propose, discuss and provide feedback on new features in the [suggestions topic](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com). Then take the next step and make a pull request that implements a new feature.
- Other Ideas: If you have other ideas for contributions, propose them on the [suggestions topic](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com).

## Getting started

The following are some things that you'll need to do to get started on the path to contributing to FarmData2.

### 1. Review FarmData2's Code of Conduct

The FarmData2 community values an open, welcoming, inclusive, and harassment-free experience for all community members.

Review the Code of Conduct before engaging with the FarmData2 community.

- [FarmData2 Code of Conduct](CODE_OF_CONDUCT.md)

### 2. Review FarmData2's Licensing

We use a variety of licenses and agreements to guarantee that FarmData2 continues to be free and open source while protecting both the project and its community of contributors.

Review the Licensing information before contributing to FarmData2.

- [FarmData2 Licensing](LICENSE.md)

### 3. Join the FarmData2 Community

The FarmData2 community uses the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com) as its primary tool for communications. It provides a place where you can search for answers and reach out to the community with questions.

The following are links to some the Zulip _streams_ and _topics_ that you might find useful:

- [Introduce Yourself](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/Introduce.20Yourself) - A stream where new developers can introduce themselves to the community.
- [Newcomer Questions](https://farmdata2.zulipchat.com/#narrow/stream/271292-developers/topic/Newcomer.20Questions) - A topic created specifically as a place for newcomers to FarmData2 to ask questions.
- [Install](https://farmdata2.zulipchat.com/#narrow/stream/270906-install) - A stream dedicated to questions about the installation of FarmData2.
- [Developers](https://farmdata2.zulipchat.com/#narrow/stream/271292-developers) - A stream for developers to ask questions, discuss issues and debate design decisions.
- [Suggestions](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions) - A topic for discussing suggestions for changes, additions or anything related to improving FarmData2.

The [Getting Started with Zulip Page](https://zulip.com/help/getting-started-with-zulip) from the [Zulip Help Center](https://zulip.com/help/) provides a quick introduction on how to use Zulip if you want a some pointers.

### 4. Install the FarmData2 Development Environment

FarmData2 provides a containerized Linux-based development environment with all the necessary tools and dependencies already installed. This simplifies the process of getting up and working toward your first FarmData2 contribution.

The `INSTALL.md` document gives descriptions and links to detailed instructions for several different approaches to installing the FarmData2 Development Environment.

- [Installing the FarmData2 Development Environment](INSTALL.md)

### 5. Take a Tour

With the FarmData2 Development Environment up and running, consider taking a tour of FarmData2 to familiarize yourself with what it does and how it works.

- [Take a quick tour of FarmData2](docs/contributing/tour.md)

### 6. Learn about FarmData2's Codebase

Become familiar with the organization, terminology, and tools and technologies used by FarmData2.

- [Overview of the FarmData2 Codebase](docs/contributing/codebase.md)

## The FarmData2 Workflow

FarmData2 uses a modified [forking workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow) to accept contributions from the community. Not every contribution will be the same, but the prototypical workflow will contain the following steps.

Note that the following instructions assume that you are working within the FarmData2 Development Environment.

### 1. Find Something to Work On

Peruse the Issue Tracker to find an issue on which to work:

- [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues)

If you are new to FarmData2, you can search the Issue Tracker for tickets with the following labels designating issues that are a good place to get started:

- [![Good First Issue](docs/contributing/images/GoodFirstIssueLabel.jpg)](https://github.com/FarmData2/FarmData2/labels/good%20first%20issue) - The issues described in these tickets are the most approachable and do not require an in-depth knowledge of the project or its technologies. They typically involve changes that do not affect the application's behavior. Often a familiarity with Markdown, HTML, JavaScript or Bash scripting is what is necessary for addressing these issues. These issues provide a great way to get familiar with the process of making a contribution.

- [![Good Second Issue](docs/contributing/images/GoodSecondIssueLabel.jpg)](https://github.com/FarmData2/FarmData2/labels/Good%20Second%20Issue) - The issues described in these tickets require some understanding of FarmData2 that is typically limited to one or two source files. They will often require changes that affect behavior and therefor might also require creation or modification of unit, component or end-to-end tests. Thus, a deeper knowledge of Javascript, Vue.js, and Cypress tests will be necessary. These issues provide a great way to dig a little deeper, though still without requiring too deep a knowledge of the project.

If you have an idea that is not already in the Issue Tracker, open an issue or propose it in the _suggestions_ topic on the FarmData2 Zulip chat:

- [FarmData2 Zulip chat \_suggestions Topic](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/suggestions)

### 2. Claim an Issue

When you find an issue that you want to work on, make a comment on the ticket expressing your interest. Use a comment such as the following:

```bash
I would like to work on this issue.
```

If the issue is not assigned, or if it has been dormant for a while, one of the project maintainers will assign the ticket to you.

If you decide not to continue working on that issue, make another comment on the ticket letting us know so that we can assign it to someone else.

### 3. Synchronize `development` with the Upstream

New work in FarmData2 occurs on the `development` branch. Before beginning to address an issue you should synchronize the `development` branch of your local repository and your `origin` repository (your fork on GitHub) with the `upstream` FarmData2 repository. This ensures that you begin your changes with the most up to date code and documentation.

Open a Terminal window and use the following commands:

```bash
cd FarmData2
git pull --ff-only upstream development
git push origin development
```

If you cloned your FarmData2 repository somewhere other than the `FarmData2` directory in the `fd2dev` home directory you'll need to adjust the `cd` command that you use.

Note that all future sections of this document will assume that the directory containing your FarmData2 repository is the current working directory.

### 4. Create and Switch to a Feature Branch

The changes that you want to contribute must be in a _feature branch_.

Use the following commands to create and switch to a feature branch. Be sure to replace the text `MyFeatureBranch` with a descriptive name based on the issue you are working on.

```bash
git switch development
git branch MyFeatureBranch
git switch MyFeatureBranch
git status
```

The output of the `git status` command should confirm that you have created and switched to your new feature branch.

### 5. Make and Test your Changes

Open the _VSCodium IDE_ and edit the contents of the files in your local FarmData2 repository to address the issue.

If your work requires more than one change you should iterate between this step and the following step until you fully solve the issue.

Depending upon what you are working on, one of the following guides might be helpful:

- [Working on a Vue.js Component or Example](docs/contributing/components.md)
- [Working on Documentation](docs/contributing/documentation.md)
- [Working on an Entry Point](docs/contributing/entry-points.md)
- [Working on Infrastructure](docs/contributing/infrastructure.md)
- [Working on a Library](docs/contributing/libraries.md)

### 6. Commit your Changes to your Feature Branch

Each time you complete a _nameable unit of work_ (for example a function, a test, or adding a form element) commit the changes to your feature branch. Use a commit message for your commit that will help you identify it if you need to roll back to that commit later.

```bash
git stage <files>
git commit -m "message that describes the changes"
```

#### Pre-Commit Checks

<!-- vale alex.ProfanityUnlikely = NO -->
<!-- hook is standard terminology here. -->

When you make your commit, a _pre-commit git hook_ in the FarmData2 Development Environment will run and perform a set of checks on the files that you are committing.

<!-- vale alex.ProfanityUnlikely = YES -->

These checks include things such as:

- Checking code for:
  - Proper formatting
  - Spelling errors
  - Linting issues (common coding or stylistic mistakes)
  - Correctness (new and existing tests for staged files must pass)
- Checking documentation for:
  - Spelling errors
  - Broken links
  - Use of inclusive language

<!-- vale alex.ProfanityUnlikely = NO -->
<!-- failure refers to an automated test not a person here. -->

If any of the pre-commit checks fail, the reasons for the failure will be displayed and the commit will not be made.

If a commit fails you will need to:

- Address the reason for the failure.
- Stage any files that you modified in addressing the failure.
- Try the commit again.

<!-- vale alex.ProfanityUnlikely = YES -->

### 7. Push Your Feature Branch

Push your feature branch to your `origin` repository on GitHub. Be sure to replace the text `MyFeatureBranch` with the name of your feature branch.

```bash
git push origin MyFeatureBranch
```

At this point you might:

- go back to [Step #5](#5-make-and-test-your-changes) and add more changes to your feature branch.
- continue to the next step and create a draft pull request to let the maintainers know what you are working on and get some preliminary feedback.
- go to step [Step #10](#10-merge-development-branch-into-your-feature-branch) and then step [Step #11](#11-mark-your-pull-request-as-ready-for-review) to let the maintainers know your pull request is ready for them to review and consider merging it.

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

When you create a pull request for FarmData2 you will need to include:

- Title - a concise summary of the pull request.
- Description - a longer description of the changes you made. This should include:
  - why you made the changes.
  - your approach to implementation.
  - any possible complications caused by your changes.
  - thoughts or questions you have for the maintainers.
  - steps that a reviewer should take to review your changes.
- Closes tags - if your pull request closes any issues, list them here by including one "Closes" tag for each issue that is closed. Include a blank line before your first `Closes` tag. Do not include any blank lines between `Closes` tags if you use more than one. For example:
  - `Closes #123`
- Coauthor footers - if you have any coauthors, list them at the bottom of your pull request by including one "Co-authored-by line" for each coauthor. Include a blank line before your first coauthor footer, and no blank lines between coauthor footers if you have more than one. You can use this nifty little tool to [generate your coauthor footers](https://coauthoredby.netlify.app/).
  <!-- vale RedHat.Hyphens = NO-->
  <!-- vale Microsoft.Vocab = NO -->
  <!-- Co-authored-by must be hyphenated here to be recognized by GitHub -->

  - `Co-authored-by: Awesome Contributor <12345678+awesomec@users.noreply.github.com>`

  <!-- vale RedHat.Hyphens = YES-->
  <!-- vale Microsoft.Vocab =YES -->

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

Maintainer will review (or assign reviewers) and then take one of three actions

- If everything looks good, they will merge your changes into the `development` branch.
- If they have questions or want to see further changes they will comment on the pull request and mark it as a draft pull request again. In this case you will want to review the feedback and respond to it in the comments or by making more changes ([Step #5](#5-make-and-test-your-changes) and [Step #6](#6-commit-your-changes-to-your-feature-branch)) and pushing them ([Step #7](#7-push-your-feature-branch)) to update your pull request.
- If the maintainers determine that your pull request is not suitable for merging into development (even with changes), they will close the pull request with a comment explaining their decision.

### 12. Respond to comments, suggestions, requests for changes

Review your pull request for comments, feedback or questions from the maintainers and respond to them. This might require you to make more changes ([Step #5](#5-make-and-test-your-changes) and [Step #6](#6-commit-your-changes-to-your-feature-branch)) and to push them ([Step #7](#7-push-your-feature-branch)) to update your pull request. When your pull request has addressed all the changes requested by the maintainers, merge the `development` branch again ([Step #10](#10-merge-development-branch-into-your-feature-branch)) and mark your pull request as ready for review ([Step #11](#11-mark-your-pull-request-as-ready-for-review))
