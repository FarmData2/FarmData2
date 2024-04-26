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
git switch development
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

### 6. Commit your Changes to your Feature Branch

Each time you complete a _nameable unit of work_ (e.g. a function, a test, adding a form element, etc.) commit the changes to your feature branch using a commit message that will help you identify the commit if you need to roll back to that commit later.

```bash
git stage <files>
git commit -m "message that describes the changes"
```

#### Pre-Commit Checks

When you make your commit, a _pre-commit git hook_ in the FarmData2 Development Environment will run and perform a set of checks _on the files that you are committing_. Only the files that you have staged for the commit will be checked.

These checks include things like:

- Checking code for:
  - Proper formatting
  - Spelling errors
  - Linting issues (i.e. common coding or stylistic mistakes)
  - Correctness (both new and existing tests for staged files are run)
- Checking documentation for:
  - Spelling errors
  - Broken links
  - Use of inclusive language

If any of the pre-commit checks fail, the reasons for the failure will be displayed and the commit will not be made.

If a commit fails you will need to:

- Address the reason for the failure.
- Stage any files that you modified in addressing the failure.
- Try the commit again.

### 7. Push Your Feature Branch

Push your feature branch to your `origin` repository on GitHub. Be sure to replace the text `MyFeatureBranch` with the name of your feature branch.

```bash
git push origin MyFeatureBranch
```

At this point you may:

- go back to [Step #5](#5-make-and-test-your-changes) and add more changes to your feature branch.
- continue to the next step and create a draft pull request to let the maintainers know what you are working on and get some early feedback.
- go to step [Step #10](#10-merge-development-branch-into-your-feature-branch) and then step [Step #11](#11-mark-your-pull-request-as-ready-for-review) to let the maintainers know your pull request is ready for them to review and consider merging it.

### 8. Create a Draft Pull Request

As you are working on your change you can create a [_draft pull request_](https://github.blog/2019-02-14-introducing-draft-pull-requests/). Creating a draft pull request lets the maintainers know you are working and allows them to see your code, while also making it clear that your pull request is still a work in progress and not ready for a full review. Draft pull requests are a great way get some early discussion and feedback on your work.

To create a draft pull request:

- Visit your fork of FarmData2 (i.e. your `origin`) on GitHub
- [Create the draft pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) for your feature branch.
  - Following the above directions be sure to use:
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
  - additional thoughts or questions you have for the maintainers.
  - steps that a reviewer should take to review your changes.
- Closes tags - if your pull request closes any issues, list them here by including one line like the following for each issue that is closed. Include a blank line before your first `Closes` tag, and no blank lines between multiple `Closes` tags.
  - `Closes #123`
- Co-author footers - if you have any co-authors, list them here by including one line like the following for each co-author. Include a blank line before your first co-author footer, and no blank lines between multiple co-author footers. You can use this nifty little tool to [generate your co-author footers](https://coauthoredby.netlify.app/).
  - `Co-authored-by: Awesome Contributor <12345678+awesomec@users.noreply.github.com>`

### 9. Discuss & Repeat

If your pull request is ready for review, go to the next step.

Otherwise, go back to [Step #5](#5-make-and-test-your-changes) and continue working on your changes. But, be sure to monitor your draft pull request for comments, feedback or questions from the maintainers and respond to them in a timely manner.

### 10. Merge `development` Branch into your Feature Branch

It is possible that the `development` branch has had new commits added to it since you began your work. These changes may conflict with your changes. So you should merge the current `development` branch into your feature branch and resolve any merge conflicts.

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
- If they have questions or would like to see additional changes they will comment on the pull request and mark it as a draft pull request again. In this case you will want to review the feedback and respond to it in the comments and/or by making additional changes ([Step #5](#5-make-and-test-your-changes) and [Step #6](#6-commit-your-changes-to-your-feature-branch)) and pushing them ([Step #7](#7-push-your-feature-branch)) to update your pull request.
- If the maintainers determine that your pull request is not suitable for merging into development (even with changes), they will close the pull request with a comment explaining their decision.

### 12. Respond to comments, suggestions, requests for changes

Monitor your pull request for comments, feedback or questions from the maintainers and respond to them in a timely manner. This may require you to make additional changes ([Step #5](#5-make-and-test-your-changes) and [Step #6](#6-commit-your-changes-to-your-feature-branch)) and to push them ([Step #7](#7-push-your-feature-branch)) to update your pull request. When you think your pull request has addressed all of the changes requested by the maintainers, you should merge the `development` branch again ([Step #10](#10-merge-development-branch-into-your-feature-branch)) and mark your pull request as ready for review again ([Step #11](#11-mark-your-pull-request-as-ready-for-review))
