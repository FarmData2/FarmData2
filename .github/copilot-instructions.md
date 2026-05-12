# FarmData2

FarmData2 extends farmOS by adding data input forms, reporting, and analytics that support the day-to-day operation of diversified vegetable farms. while also facilitating the keeping of records necessary for organic certification and for the study of sustainable farming practices.

## Use Cases

1. A farm worker will use FarmData2 on a mobile device to enter data as they complete tasks on the farm
2. A farm manager will use FarmData2 on a laptop or desktop to review reports and create plans

## AI Agent Role

You, the AI agent, are a software engineer contributing to FarmData2

### Rules

- Commits are made only to feature branches
- Feature branches are made only from the development branch, unless explicitly instructed otherwise
- The development branch is always updated before a feature branch is created
- Draft pull requests always merge changes from a feature branch into the development branch, unless explicitly instructed otherwise
- Apply the "ai assisted" label new pull requests that you create
- Draft pull requests are converted to full pull requests only by humans
- Pull requests in FarmData2 are always squash merged with the pull request title and body becoming the title and commit message for the squash merge
- Pull requests are always merged by a human maintainer
- No new dependencies are to be added unless explicitly requested

### Planning

- The first step in every plan you create must be to make a new feature branch for the work
- The last step in every plan you create must be to make a draft pull request for the feature branch

### Workflow

All contributions to FarmData2 use the following workflow:

1. Update the development branch from the upstream repository
2. Create a new feature branch from the development branch, unless explicitly instructed otherwise
3. Commit changes to the new feature branch
4. Create a draft pull request to the development branch
5. Revise and add commits to the feature branch as necessary to complete, correct and test the work
6. Convert the draft pull request to a full pull request when ready for review
7. Respond to feedback and add commits to the feature branch as necessary to complete, correct and test the work

### Commits

- Every commit has a brief commit message that describes what the commit does
- The first word of the commit message should be an action verb
- Commits to feature branches do not use conventional commit messages
- Before making a commit prompt the user for the GitHub ID of any co-authors, look up their github noreply email, and add a co-author attribution
- All commits must pass the checks in the pre-commit git hook that runs automatically when a commit is made
- When a new commit is added to a pull request a comment is added to the pull request discussion:
  - describing the purpose of the commit
  - giving the prompt that led to the commit
  - linking to the commit

### Pull Requests

- Pull request titles are conventional commit messages with the format "type(scope): description"
  - The description begins with an action verb and briefly describes what the pull request does
  - The conventional commit message uses only the following types:
    - feat - when the pull request adds a new feature
    - fix - when the pull request fixes a bug
    - refactor - when the pull request improves design or performance without changing the behavior of the application
    - test - when the pull request changes only files with names that end in .cy.js
    - ci - a the pull request changes only the continuous integration files in .github/workflows
    - docs - when the change is to README.MD, CONTRIBUTING.md, CODE_OF_CONDUCT.md, INSTALL.md, any files in the licenses directory, or any of the markdown files in the docs directory
    - When more than one type applies the one higher in the list is used
  - The conventional commit message uses only the following scopes:
    - fd2 - when the pull request modifies files in the modules/farm_fd2 directory
    - lib - when the pull request modifies files in the files in the library directory
    - comp - when the pull request modifies files in the components directory
    - examples - when the pull request modifies files in the modules/farm_fd2_examples directory
    - school - when the pull request modifies files in the modules/farm_fd2_school directory
    - dev - when the pull request modifies any . file, the contents of any . directory, any contents of the following directories bin, cypress, or docker
    - deps - when the pull request modifies the package.json or package-lock.json files
    - When more than one scope applies the one higher in the list is used
- Pull request bodies must:
  - Use the `.github/PULL_REQUEST_TEMPLATE.md`
  - Remove the body comments in each section of the templates. These comments start with > _ and end with ._
  - Complete the relevant sections of the pull request template
  - Remove the "Testing" section if no automated tests have been added or modified
  - Place the prompt that was used to generate the work into the "Further Information" section
  - Add an `ai-assisted` attribution that identifies the AI models and versions used to create the plan and the code
  - Add a BREAKING_CHANGE footer if the changes result in a version of the FarmData2 module that cannot be used without an update to the database
- The full plan document is added to the draft pull request as a comment

### Code Quality and Style

- Generate code for human readability over optimization unless explicitly told to optimize
- Use meaningful names with the following conventions:
  - camelCase for Javascript variables and functions, and Vue.js components, data properties, computed properties and methods
  - kabob-case for HTML id and data-cy properties, and git feature branches
  - snake_case for entrypoints
- Code should be self-documenting
- Comments are used sparingly and only to explain complex, confusing or non-standard approaches
- Each indentation level is 2 spaces
- Javascript statements end with a semicolon
- Every html element or Vue component used in a test has a data-cy attribute with a descriptive value
- Cypress tests access html elements and Vue components using only data-cy attributes
- The Vue.js 3 Options API is used for components and entrypoints
- The Vue.js directives v-on and v-bind are always written out and never abbreviated

### Nonfunctional Requirements

- Data entry forms should fit on a single small mobile screen in portrait mode when all collapsible elements are hidden
- FarmData2 features should require as little training as possible to use
- A typical user should be able to enter the data for a form in less than 1 minute

## Technical Stack

FarmData2 uses the following technologies:

- Vue.js 3 Single File Components for:
  - Custom user interface components in the subdirectories of the components directory
  - User input forms in the subdirectories of modules/\*/src/entrypoints directory
- BootstrapVueNext as its UI component library
- farmos.js to access the farmOS API
- Cypress for all testing
- Bash shell scripts for task automation

## Project Architecture

The FarmData2 architecture has four main parts:

- Libraries: Collections of Javascript functions that are used across the FarmData2 Components and entrypoints
  - Each library is contained in a collection of .js files in the subdirectories of the library directory
  - Every library function is documented using JSDoc
  - Every library function is accompanied by a set of Cypress unit tests that verify the functionality of the functions that it contains
- FarmData2 Components: Custom UI elements that encapsulate the UI elements and relevant logic for UI elements used in FarmData2 input forms
  - FarmData2 Components are built as Vue.js 3 single file components using BootstrapVueNext components
  - Each FarmData2 Component is contained in a .vue file in a subdirectory of the components directory
  - Every FarmData2 Component is documented using JSDoc
  - Each FarmData2 Component is accompanied by a set of Cypress component tests that verify its functionality
- Entrypoints: Data input forms built as Vue.js 3 single file components and appear as pages in farmOS
  - Entrypoints are built as Vue.js 3 single file components using custom FarmData2 Components and BootstrapVueNext components
  - Each entrypoint is contained in an App.vue file in a subdirectory of src/entrypoints in farm_fd2, farm_fd2_examples or farm_fd2_school
  - The logic for submitting data from the input form to farmOS is encapsulated in the lib.js file in the entrypoint's directory
  - Every entrypoint is accompanied by a set of Cypress end to end tests that verify its functionality
  - The lib.js file for every entrypoint is accompanied by a set of Cypress unit tests that verify its functionality
- Scripts: Bash scripts that automate common tasks
  - The scripts are contained in the bin directory
  - The bin/lib subdirectory contains functions that are used by other scripts
