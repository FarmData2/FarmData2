# FarmData2

FarmData2 extends farmOS by adding data input forms, reporting, and analytics that support the day-to-day operation of diversified vegetable farms. while also facilitating the keeping of records necessary for organic certification and for the study of sustainable farming practices.

## Use Cases

1. A farm worker will use FarmData2 on a mobile device to enter data as they complete tasks on the farm.
2. A farm manager will use FarmData2 on a laptop or desktop to review reports and create plans.

## AI Agent Role

You, the AI agent, are a software engineer contributing to FarmData2.
As a contributor you must adhere to the following conventions used in FarmData2:

- Commits:
  - All changes to the repository must be committed to a feature branch created for the work
  - All feature branches must be created from the latest development branch, unless explicitly told otherwise
  - Commits to feature branches must have a brief commit message that describes the changes it contains
  - Commits to feature branches do not use conventional commit messages
  - Always request the GitHub ID for any co-authors when making a commit, look up their correct github noreply email, and add them to the commit message as co-authors
  - All commits must pass the checks in the pre-commit git hook that runs automatically when a commit is made
- Pull requests:
  - Work is contributed to FarmData2 by opening a draft pull request for the feature branch created for the work
  - Pull requests in FarmData2 are squash merged only by a human maintainer
  - The pull request title and body become the commit message for the squash merge
- Other:
  - Do not add any new dependencies to the project unless explicitly told to do so

### Code Quality and Style

Code in FarmData2 is written for human readers and you must adhere to the following conventions:

- Generate code for human readability over optimization unless explicitly told to optimize
- Use meaningful names with the following conventions:
  - camelCase for Javascript variables and functions, and Vue.js components, data properties, computed properties and methods
  - kabob-case for HTML id and data-cy properties, and git feature branches
  - snake_case for entrypoints
- Code should be self-documenting
- Comments are used sparingly and only to explain complex, confusing or non-standard approaches
- Each indentation level is 2 spaces
- Javascript statements end with a semicolon
- Every html element or Vue component used in a test must include a data-cy attribute
- Cypress tests access html elements and Vue components using only data-cy attributes
- The Vue.js 3 Options API is used for components and entrypoints
- The Vue.js directives v-on and v-bind are always written out and never abbreviated

### Nonfunctional Requirements

- Data entry forms should fit on a single small mobile screen in portrait mode when all collapsible elements are hidden
- A typical user should be able to enter the data for a form in less than 1 minute

## Planning Agent

When creating a plan, the plan must adhere to the following conventions:

- The first step in every plan must be the creation of a feature branch for the work
- The final step in every plan must be the creation of a draft pull request to merge the feature branch into the development branch unless explicitly told otherwise
- The title of the draft pull request must:
  - Include a brief description of the purpose of the changes being proposed
  - Be a conventional commit message with the following types and scopes:
    - The allowable types are:
      - feat - when the pull request adds a new feature
      - fix - when the pull request fixes a bug
      - refactor - when the pull request improves design or performance without changing the behavior of the application
      - test - when the pull request changes only files with names that end in .cy.js
      - ci - a the pull request changes only the continuous integration files in .github/workflows
      - docs - when the change is to README.MD, CONTRIBUTING.md, CODE_OF_CONDUCT.md, INSTALL.md, any files in the licenses directory, or any of the markdown files in the docs directory
      - When more than one type applies the one higher in the list is used
    - The scopes to be used are:
      - fd2 - when the pull request modifies files in the modules/farm_fd2 directory
      - lib - when the pull request modifies files in the files in the library directory
      - comp - when the pull request modifies files in the components directory
      - examples - when the pull request modifies files in the modules/farm_fd2_examples directory
      - school - when the pull request modifies files in the modules/farm_fd2_school directory
      - dev - when the pull request modifies any . file, the contents of any . directory, any contents of the following directories bin, cypress, or docker
      - deps - when the pull request modifies the package.json or package-lock.json files
      - When more than one scope applies the one higher in the list is used
    - The BREAKING_CHANGE footer must be added if the
- The body of the draft pull request must:
  - Use the `.github/PULL_REQUEST_TEMPLATE.md`
  - Remove the body comments in each section of the templates. These comments start with _ and end with _
  - Complete the relevant sections of the pull request template
  - If the pull request does not contain any new or modified automated tests, the "Testing" section is omitted
  - Include in the "Further Information" section the name and version of the AI model used to generate the changes in the pull request
  - Add a section to the body of the pull request titled "Prompt" and include the prompt that was used to create the plan in that section
  - Apply the "ai generated" label to the draft pull request
- Add the full plan document to the draft pull request as a comment
- When a new commit is added to a pull draft pull request after the plan is completed add a comment to the pull request that:
  - describes what the commit does
  - gives the prompt that led to the commit
  - links to the commit

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
  - Every library function is accompanied by a set of Cypress unit tests that verify the functionality of the functions that it contains
- FarmData2 Components: Custom UI elements that encapsulate the UI elements and relevant logic for UI elements used in FarmData2 input forms
  - FarmData2 Components are built as Vue.js 3 single file components using BootstrapVueNext components
  - Each FarmData2 Component is contained in a .vue file in a subdirectory of the components directory
  - Each FarmData2 Component is accompanied by a set of Cypress component tests that verify its functionality
- Entrypoints: Data input forms built as Vue.js 3 single file components and appear as pages in farmOS
  - Entrypoints are built as Vue.js 3 single file components using custom FarmData2 Components and BootstrapVueNext components
  - Each entrypoint is contained in an App.vue file in a subdirectory of src/entrypoints in farm_fd2, farm_fd2_examples or farm_fd2_school
  - The logic for submitting data from the input form to farmOS is encapsulated in the lib.js file in the entrypoint's directory
  - Every entrypoint is accompanied by a set of Cypress end to end tests that verify its functionality
- Scripts: Bash scripts that automate common tasks
  - The scripts are contained in the bin directory
  - The bin/lib subdirectory contains functions that are used by other scripts
