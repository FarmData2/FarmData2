# Working on Entry Points

The purpose of this document is to describe how to create, change and test entry points in FarmData2.

Entry points are pages that provide FarmData2 functionality. The entry points are accessed through the FarmData2 menus (FarmData2, FD2 Examples, FD2 School) that appear in farmOS. For example, the Tray Seeding, Direct Seeding and Transplanting menu options lead to pages (entry points) for collecting data about the corresponding activity.

Familiarity with the [Overview of the FarmData2 Codebase](codebase.md) will be helpful in reading this document.

## Outline

- [Creating a New Entry Point](#creating-a-new-entry-point)
  - [The Entry Point Template](#the-entry-point-template)
  - [Generating a New Entry Point](#generating-a-new-entry-point)
  - [Finding the New Entry Point](#finding-the-new-entry-point)
    - [Finding the Running Entry Point in farmOS](#finding-the-running-entry-point-in-farmos)
    - [Finding the Source Code for the Entry Point](#finding-the-source-code-for-the-entry-point)
  - [Implementing Entry Point Functionality](#implementing-entry-point-functionality)
  - [Watching a Module](#watching-a-module)
  - [Running Entry Point Tests](#running-entry-point-tests)
    - [Running Unit Tests](#running-unit-tests)
    - [Running End-to-End Tests](#running-end-to-end-tests)
- [Tour of an Entry Point](#tour-of-an-entry-point)
  - [Entry Point Directory Structure](#entry-point-directory-structure)
  - [Entry Point Code](#entry-point-code)
    - [The `App.vue` File](#the-appvue-file)
      - [Adding Components to `App.vue`](#adding-components-to-appvue)
      - [`App.vue` Examples](#appvue-examples)
    - [The `lib.js` File](#the-libjs-file)
      - [The `submitForm` Function](#the-submitform-function)
      - [`lib.js` Examples](#libjs-examples)

## Creating a New Entry Point

### The Entry Point Template

New entry points in FarmData2 are created by customizing an entry point template. The entry point template defines the basic structure for an entry point and provides a small set of functionality. It serves as a starting point for creating new entry points and helps to maintain some structural consistency across entry points.

A running instance of an entry point template can be found by choosing the "Example Entry Point" option in the FD2 Examples menu in the FarmData2 Development Environment. The running entry point template looks as follows:

<a href="images/ExampleEntryPoint.png"><img src="images/ExampleEntryPoint.png" alt="The entry point template." width="320" style="border: 1px solid black"></a>

The "Submit" button provided does not submit any data to the farmOS server. Implementing that functionality is part of the customization process.

### Generating a New Entry Point

When you want to add a new entry point to FarmData2, the following command will generate a new entry point from the entry point template as a starting point for you:

```bash
addEntryPoint.bash`
```

This command will prompt you for the following information that will be used to create the new entry point:

1. **The module** in which to create the new entry point. The entry point can be created in the `farm_fd2`, `farm_fd2_examples`, or `farm_fd2_school` module, which correspond to the similarly named FarmData2 menus in farmOS.
1. **The name** for the new entry point. This name is used internally in code and is not visible to users. The name should be entered in `snake_case`, with words being all lowercase and separated by underscore (`_`) characters.
1. **A short title** for the new entry point. The title is the text that will be used as the menu option for accessing the entry point. It also appears at the top of the entry point page. The title should be in Title Case, with words capitalized and separated by spaces. This often uses the same words as the name.
1. A one sentence **description** of the new entry point. This description is used as a tooltip by Drupal and should be written to be meaningful to a user.
1. The **parent menu** on which the option for this entry point should be added. The title for this entry point will appear on the specified menu.
1. The **permissions** that a user must have to see the menu. The permissions that are available can be found by logging into farmOS as `admin` and visiting the [farmOS People page](http://farmos/admin/people/permissions). Then use the browser dev-tools to inspect the check boxes to find the name of the permission.

After confirming the information that you entered, the script will generate the new entry point from the template by:

1. Creating and switching to a new feature branch named `add_<entry_point_name>_entry_point`
2. Creating a subdirectory in the module containing the new entry point.
3. Customizing the entry point template files with the information you entered and copying them into the subdirectory.
4. Updating the module's configuration so that the menu option for the new entry point will appear in farmOS.
5. Running tests to confirm that the new entry point was created.
6. Committing the customized entry point files to the feature branch.

This process typically takes several minutes.

### Finding the New Entry Point

The running instance of the new entry point can be found in farmOS and the source code for it can be found in your FarmData2 repository.

#### Finding the Running Entry Point in farmOS

Open Mozilla Firefox and login to farmOS at [http://farmos](http://farmos). Then use the FarmData2 menus to find the option for the module containing the option for the new entry point that you created. If the entrypoint page is blank when you visit it the first time, hold the "shift" key and click the reload button in the browser (&#10227;).

#### Finding the Source Code for the Entry Point

The directory for the module in which the new entry point is being created will contain a subdirectory for the new entry point's code.

For example, if an entry point named `example_entry_point` is created in the `farm_fd2_examples` module then the `example_entry_point` subdirectory will contain source code for the new entry point, as shown in the following directory tree:

<pre>
FarmData2
├── ...
├── modules
│   ├── css
│   ├── farm_fd2
│   │   └── ...
│   ├── farm_fd2_examples
│   │   ├── dist
│   │   ├── src
│   │   |   ├── entrypoints
│   │   |   │   ├── ...
│   │   |   │   ├── component_examples
│   │   |   │   ├── date_selector
│   │   |   │   ├── <strong>example_entry_point</strong>
│   │   |   │   └── ...
|   |   |   ├── module
|   |   |   └── public
│   │   └── vite.config.js
│   └── farm_fd2_school
│       └── ...
:
</pre>

### Implementing Entry Point Functionality

The functionality of the entry point template is customized to its intended purpose by adding components to the page in the `App.vue` file and implementing the `submitForm` function in the `lib.js` file. Each of these files contain comments that describe how to customize the entry point.

The [Tour of an Entry Point](#tour-of-an-entry-point) section provides more detail and examples of how to customize the entry point template.

### Watching a Module

When the source code associated with an entry point is changed, the module containing it needs to be rebuilt for the changes to appear in farmOS.

Most commonly you will want to _watch_ the module containing the entry point on which you are working. Watching the module causes it to be rebuilt any time changes are made to any of the source files that it uses. To watch a module, open a new terminal and use the command for the module containing the entry point on which you are working:

- `npm run watch:fd2`
- `npm run watch:examples`
- `npm run watch:school`

When changes to the source files are saved, output in the terminal will show the module being rebuilt and will report any errors that occur.

The [Watch and Build Alternatives](#watch-and-build-alternatives) section describes other approaches to watching or building modules that might be useful or preferred in some circumstances.

### Running Entry Point Tests

New entry points are populated with unit tests and end-to-end tests from the template. These tests check the functionality provided by the template.

They will need to be changed and more tests will need be added as the functionality of the entry point is customized. [The Entry Point Test Files](#the-entry-point-test-files) section describes the conventions that are used for these tests.

#### Running Unit Tests

To run the unit tests for an entry point open a new terminal and adapt the following command:

```bash
test.bash --unit -- --gui < module > --glob=modules/**/ < entry_point_name > /*.unit.cy.js
```

- `<module>` must be one of `fd2`, `examples` or `school`.
- `<entry_point_name>` must be the name of the entry point to test.
- The `--gui` flag causes the tests to run in the Cypress GUI. Omit the `--gui` flag to run the tests _headless_ with results reported in the terminal.
- Omit the `--glob` flag to run the unit tests for all entry points in the module.

#### Running End-to-End Tests

To run the end-to-end (e2e) tests for an entry point open a new terminal and adapt the following command:

```bash
test.bash --e2e --live -- < module > --glob=modules/**/ < entry_point_name > /*.e2e.cy.js
```

- `<module>` must be one of `fd2`, `examples` or `school`.
- `<entry_point_name>` must be the name of the entry point to test.
- The `--gui` flag causes the tests to run in the Cypress GUI. Omit the `--gui` flag to run the tests _headless_ with results reported in the terminal.
- Omit the `--glob` flag to run the e2e tests for all entry points in the module.

## Tour of an Entry Point

A newly created entry point will provide minimal functionality designed to be customized to serve its intended purpose. The following sub-sections provide a guide to the structure and functionality of the template and pointers to more information and examples that will be helpful in customizing it.

### Entry Point Directory Structure

The subdirectory created for a new entry point will contain the customized entry point template files as shown in the following directory tree:

<pre>
FarmData2
├── modules
│   ├── ...
│   ├── farm_f2
│   ├── farm_fd2_examples
│   │   ├── dist
│   │   ├── src
│   │   |   ├── entrypoints
│   │   |   │   ├── ...
│   │   |   │   ├── <strong>example_entry_point
│   │   |   │   │   ├── App.vue
│   │   |   │   │   ├── example_entry_point.comment.e2e.cy.js
│   │   |   │   |   ├── example_entry_point.date.e2e.cy.js
│   │   |   │   |   ├── example_entry_point.exists.e2e.cy.js
│   │   |   │   |   ├── example_entry_point.html
│   │   |   │   |   ├── example_entry_point.js
│   │   |   │   |   ├── example_entry_point.submitReset.e2e.cy.js
│   │   |   │   |   ├── index.html
│   │   |   │   |   ├── lib.js
│   │   |   │   |   └── lib.submit.unit.cy.js</strong>
│   │   |   │   └── ...
|   |   |   ├── module
|   |   |   └── public
│   │   └── vite.config.js
│   └── farm_f2_school
:
</pre>

- The `App.vue` and `lib.js` files contain the implementation of the entry point.
  - `App.vue` defines the Vue application for the entry point.
  - `lib.js` contains the `submitForm` function that creates the data records for the entry point in the farmOS database.
- The `*.e2e.cy.js` files contain end-to-end tests for the entry point. More details on these files can be found in the [Entry Point End-to-End Tests](#entry-point-end-to-end-tests) section.
- The `lib.submit.unit.cy.js` file contains unit tests for the `submitForm` function in `lib.js`. More details on these files can be found in the [Entry Point Unit Tests](#entry-point-unit-tests) section.
- The `index.html`, `example_entry_point.html`, and `example_entry_point.js` are boilerplate for the Vue app and do not need to be edited.

### Entry Point Code

The following sub-sections provide a guide to the entry point code and pointers to more information and examples that will be helpful in customizing it. You can follow along by looking at the `example_entry_point` in the `farm_fd2_examples` module, or by having created a new entry point of your own by using the `addEntryPoint.bash` script.

#### The `App.vue` File

The `App.vue` file defines a _Vue Single File Component_ (SFC) using the Vue's _Options API_. This SFC is what is displayed when the entry point is visited in farmOS.

If you are not familiar with Vue SFC or Vue's Options API the following resources are great places to start:

- The "Getting Started" and "Essentials" sections of the [Vue Introduction](https://vuejs.org/guide/introduction.html).
- Vue Mastery's [Intro to Vue 3 video course](https://www.vuemastery.com/courses/intro-to-vue-3/intro-to-vue3) are a great place to start.

##### Adding Components to `App.vue`

Vue Components are added to an entry point's `App.vue` file to customize its input form to its purpose. The following resources will be helpful in customizing the entry point's `App.vue` file:

- The comments in the `App.vue` file in the entry point describe the structure and organization of a FarmData2 entry point SFC.
- The ["Component Basics"](https://vuejs.org/guide/essentials/component-basics.html) section of the Vue Introduction shows how to add Vue component to a SFC.
- The [FarmData2 Documentation](http://localhost:8082/docs/FarmData2.md) page provides a links to the documentation for each custom FarmData2 Vue component, a live running example of the component, and a static code example of its use.
  - The guide to [Working on a Vue.js Component](components.md) provides information about creating and testing custom Vue Components for FarmData2.
- The documentation for the [BootstrapVueNext Components](https://bootstrap-vue-next.github.io/bootstrap-vue-next/docs.html). These Vue Components are typically used inside of the custom Vue Components for FarmData2, but might be used directly in an entry point. Note that BootstrapVueNext is under active development and its documentation is evolving with its development. FarmData2 has pinned to a specific version of BootstrapVueNext for stability. There will be inconsistencies between the BootstrapVueNext documentation and the code in FarmData2.

##### `App.vue` Examples

Examples of `App.vue` files can be found in the existing entry points including:

- [Example Entry Point `App.vue`](../../modules/farm_fd2_examples/src/entrypoints/example_entry_point/App.vue)
- [Tray Seeding `App.vue`](../../modules/farm_fd2/src/entrypoints/tray_seeding/App.vue)
- [Direct Seeding `App.vue`](../../modules/farm_fd2/src/entrypoints/direct_seeding/App.vue)
- [Transplanting `App.vue`](../../modules/farm_fd2/src/entrypoints/transplanting/App.vue)

#### The `lib.js` File

The `lib.js` file is a JavaScript library for the entry point. It contains at least the `submitForm` function, which is called when the "Submit" button is clicked. It can also contain other functions that are useful for the entrypoint.

Implementing the `submitForm` and other functions in the `lib.js` file, as opposed to directly in the `App.vue` file, makes it possible to unit test them. See the [Entry Point Unit Tests](#entry-point-unit-tests) section for more details.

##### The `submitForm` Function

When the "Submit" button on a entry point page is clicked, the `submitForm` function in the `lib.js` file is called. This function must be customized to its entry point's purpose by using the `farmosUtil` library to create the farmOS assets, logs and quantities needed to represent the entry point's operation.

The following resources will be helpful in customizing the entry point's `submitForm` function:

- The [Example Entry Point `lib.js`](../../modules/farm_fd2_examples/src/entrypoints/example_entry_point/lib.js) contains a _TODO_ list and comments that describe the customizations that need to be made.
- The [`farmOSUtil` library](https://github.com/farmOS/farmOSUtil) contains methods for creating the farmOS assets, logs and quantities needed to represent the entry point's operation.
  - The [Guide to working on a Library](library.md) provides information about extending the `farmosUtil` library to include new functions.

##### `lib.js` Examples

Examples of `lib.js` files can be found in the existing entry points including:

- [Tray Seeding `lib.js`](../../modules/farm_fd2/src/entrypoints/tray_seeding/lib.js)
- [Direct Seeding `lib.js`](../../modules/farm_fd2/src/entrypoints/direct_seeding/lib.js)
- [Transplanting `lib.js`](../../modules/farm_fd2/src/entrypoints/transplanting/lib.js)

### The Entry Point Test Files

Entry points have two types of tests associated with them. The functions in the `lib.js` file have unit tests and the functionality in the `App.vue` file has end-to-end tests.

#### Entry Point Unit Tests

The entry point template provides two test files:
- `lib.submit.unit.cy.js` - tests a successful call to the `submitForm` function in `lib.js`.
- `lib.submitError.unit.cy.js` tests an unsuccessful to the `submitForm` function in the `lib.js` file.




The `submitForm` function is not yet implemented, so the tests provided are placeholders to be adapted to your `submitForm` function.

You can find examples of the unit tests for the `submitForm` function in other entry points including:

- [Tray Seeding `lib.submit.unit.cy.js`](../../modules/farm_fd2/src/entrypoints/tray_seeding/lib.submit.unit.cy.js)
- [Tray Seeding `lib.submitError.unit.cy.js`](../../modules/farm_fd2/src/entrypoints/tray_seeding/lib.submitError.unit.cy.js)

If other functions are added to the `lib.js` file, their unit tests should be placed in a file incorporating their name. For example, if a function named `computeValid` is added then its unit tests should be placed in `lib.computeValid.unit.cy.js`.

#### Entry Point End-to-End Tests

The entry point end-to-end tests check that the entry point exists, has all the correct components, the component's props are set, and the form submits the correct data.

The entry point template provides the following end-to-end (e2e) tests:

- `*.exists.e2e.cy.js` - tests that the page exists. can be accessed by appropriate users, and contains the main structural elements.
- `*.date.e2e.cy.js` - tests the `DateSelector` component.
- `*.comment.e2e.cy.js` - tests the `CommentBox` component.
- `*.submitReset.e2e.cy.js` - tests the `SubmitResetButtons` component.

As you begin to customize the entry point's `App.vue` file you will need to:

1. Edit the `*.submitReset.e2e.cy.js` to account for any added components.

   - Use the comments in the file as a guide.

2. Add a `*.<component>.e2e.cy.js` test file for each component that you add. These files should:

   - Check that the component initially:

     - exists or not as appropriate.
     - is visible or not as appropriate.
     - is enabled or not as appropriate.

3. Test that the component's props that are set in `App.vue` are reflected in the page. For example:

   - required or not.
   - default value set by a prop.
   - contents of dropdown affected by props.
   - existence of buttons affected by props.

4. Test the validity styling of the component:

   - Place an in-valid or valid value in the component.
   - Click submit
   - Check component for appropriate styles (`is-valid` or `is-invalid`)
   - If the error feedback message is set by a prop in `App.vue` it should also be checked.

5. Test that the component's behavior that is affected by props is reflected in the page. For example:

   - behavior of buttons affected by props.
   - open collapsible elements and check contents affected by props.
   - and so forth.

6. Add a `*.submission.e2e.cy.js` test file to test successful and unsuccessful submissions.

  - Test successful submit
    - configure form with all fields valid
    - submit
    - check:
      - creates all of the records
      - shows/hides submitting banner
      - resets form leaving "sticky" values in place.
      - shows/hides success banner
  - Test submit w/ error
    - shows/hides error banner

#### Testing Tips

## More Details

### The `--dev` Flag

### Permissions

### Pre-populating farmOS Data

### The Drupal Module Files

### Watch and Build Alternatives

#### The Dev Server

#### The Preview Server

#### Builds

=== Raw Notes Below ===

## Modules

The FarmData2 modules

- farm_fd2 - the main FarmData2 module.
- farm_fd2_examples - the FarmData2 examples module.
- farm_fd2_school - the FarmData2 school module.

- cypress - cypress configuration shared by all modules.
- cypress.config.js - cypress configuration shared by all modules.
  - these are sym linked inside each module directory.

## Module Structure

Inside each of the module directories there are the following directories and files:

- src - contains all source code for the module
- cypress - symbolic link to the `cypress` directory in modules
  - all modules share same configuration for cypress
- cypress.config.js - symbolic link to the `cypress.config.js` file in modules
  - all modules share same configuration for cypress
- vite.config.js - the vite build configuration for the module.
- dist - distribution files for the module
  - generated by the vite build
- src/entrypoints - all of the entrypoints (i.e. pages) in the module.
  - one sub-directory for each entry point.
  - entry point names must be unique within a module.
    - created with bin/addEntrypoint.bash
      - App.vue - code for the entrypoint (you edit this).
      - \*.cy.js - tests for the entrypoint (you create these)
      - index.html - scaffolding (auto generated by bin/addEntrypoint.bash)
      - main.js - scaffolding (auto generated)
  - module - scaffolding (auto edited by bin/addEntrypoint.bash)
  - public - scaffolding
  - shared - scaffolding
  - stores - used by Vue pinia store
  - composer.json - Drupal configuration information (only for farm_fd2)

## Adding an new Entry Point

- ensure you have no uncommitted changes
- switch to `development` branch
- run `addEntrypoint.bash`
  - Will create a new feature branch
  - Switch to that branch
  - Add boilerplate and starter code to it
  - Run some basic tests against the added code
    - Note: running test script also builds the module containing the new entry point.
- Edit `App.vue` to implement the entry point.
- Add `\*.cy.js` files to test the new entry point.

## Rebuilding Modules

- run
  - `npm run build:fd2`
  - `npm run build:examples`
  - `npm run build:school`

## Entry Point Conventions

Document where these things are in the code somehow.

- an example in the Examples module?

- all elements have `id` and `data-cy` attributes

  - prefixed with the entry point name
  - cabob-case
  - e.g. `direct-seeding-toaster`

- all use the `fd2-mobile.css` stylesheet.

  - add `<style scoped>` to the `App.vue` for entry point specific styles.

- Submit button is initially enabled.

  - On click
    - validity styling is shown
    - disabled if
      - any data is invalid
      - any required data is missing
    - Submitting ... banner appears while submitting.
    - Success banner appears when submitted is complete, stays for 2 seconds.
    - Error banner appears if there is an error, stays for 5 seconds.

- Errors are thrown by the `lib.js` file when doing submission (see `tray_seeding/lib.js`).

  - The main `App.vue` then catches the error and displays an error banner with a simplified message for the page.
  - The `lib.js` should print more detailed information to the console for debugging.

- Components indicate errors by emitting an `error` event with the error message.
  - A `v-on:error="(msg) => showErrorToast('Title', msg)"` listener should be attached to any component that emits an error event. The title should be generalized to the entrypoint. The component will have printed more detailed information to the console for debugging. See `tray_seeding/App.vue` for an example.

## farmOS Permissions Checking

A component can check the permissions of the logged in farmOS user using appropriate function in `farmosUtil.js`.

If a permission needs to be checked that is not yet supported it can be added to the `$perms` array in the `permissions` function in `modules/farm_fd2/src/module/Controller/FD2_Controller.php` file.

## Log Categories and Units

The log categories and units used by FarmData2 are installed by the `farm_fd2.install` file in `modules/farm_fd2/src/module`.

To add new log categories or units:

- Edit the `farm_fd2.install` file.
- Rebuild the module.
- Uninstall the FarmData2 module (machine name: `farm_fd2`)
- Re-enable the Farmdata2 module.

Note: the `installDB.bash` script also uninstalls and re-enables the FarmData2 module. Thus, changes to the log categories and units will be reflected when tests are run headless.

## Testing

- use `bin/test.bash` (see its docs).

- Unit test vs e2e tests.

- use watch:fd2 by default and just run in live farmOS???

  - or should we use the dev server?
  - point to another document that discusses the use of the dev and preview servers.

- Any `it` with an `intercept` should include `{ retries: 4 }` to tolerate some of the flake that appears to go with `cy.intercept`.

Best practice is to [reset the database state before tests are run](https://docs.cypress.io/guides/references/best-practices#State-reset-should-go-before-each-test). Doing this before every test or even at the start of every file adds significantly to the runtime of the test suite. FarmData2 compromises by resetting the database to the DB that was most recently installed (i.e. using `installDB.bash`) before each test run. A test run is one cypress command (e.g. as is done by `test.bash --comp`). Any test that absolutely requires a clean database (i.e. cannot tolerate changes made by prior tests) can reset it in its `before` hook using the following code:

```Javascript
  before(() => {
    cy.task('initDB');
  });
```

You can change the database that will be used for testing by using the `installDB.bash` script manually prior to running the tests. This is useful when you want to run tests against a pre-release of the sample database. For example:

```bash
installDB.bash --release=v3.1.0-development.3 --asset=db.sample.tar.gz
```

Use: `cy.task('log', 'message')` to log messages to the console.
Use: `cy.task('logObject', obj)` to log an object to the console.

### Unit Testing

Write code for submission of the form to farmOS in the lib.js file and unit test it.

- Tests do not need to clean up as the db is reset when running headless.
- Can be explicitly reset for specific test files (as above) if necessary.

### E2E Testing

The `addEntryPoint.bash` script creates an `*.exists.e2e.cy.js` test file. It initially tests that admin can access the page. It should be augmented to test as follows:

- `*.exists.e2e.cy.js` - ensure that the entry point exists and is accessible
  - Check that user(s) with proper permission can access the page.
  - Check that user(s) without permission (if one exists) cannot access the page.
  - Check that the following standard elements exist on the page
    - BToaster, BCard, header (contains proper title), BForm
- `*.<component>.e2e.cy.js` - Component specific e2e tests with one test for each component in the entry point.
  - Check that the component initially
    - exists or not.
    - is visible or not.
    - is enabled or not.
  - Check things that are set by props:
    - label, required, default value, dropdown content, buttons etc...
    - no need to duplicate tests from component's own tests.
  - Test validity styling
    - submit and check for appropriate validity styling (valid or invalid or none)
    - may require that values be placed in non-required components to see style.
  - Test behavior of the component
    - increment/decrement buttons, become visible, invisible, etc.
    - no need to duplicate tests from component's own tests.
- `*.submitReset.e2e.cy.js` - Submit/reset component e2e tests
  - Test that buttons are
    - visible and are
    - in the enabled state.
  - Test enabling/disabling of submit button
    - Configure form with one field invalid (helper function that sets all fields to a valid value might help here.)
      - submit.
      - check submit disabled.
    - Make field valid, check submit enabled (don't submit)
    - Repeat for each field.
  - Test reset
    - set all elements to valid state
    - resets all elements to default state
- `*.submission.e2e.cy.js` - test submission of the form.
  - Test successful submit
    - configure form with all fields valid
    - submit
    - check:
      - creates all of the records
      - shows/hides submitting banner
      - resets form leaving "sticky" values in place.
      - shows/hides success banner
  - Test submit w/ error
    - shows/hides error banner

### Common Testing Gotchas

- `clear()` fields with content before `type()`ing in them
- `blur()` any field that was `type()`d in or `clear()`ed before doing a submit or relying on its value. If changing lots of fields, then only need to `blur` the last one.
- When setting or checking the value of a _selector_ or _numeric_ input be sure to get the element from the sub-component (e.g. `selector-input` or `numeric-input`). Some methods work on the parent component, but others do not. So, it is always safest to work with the `*-input` element itself.
- If a contained `data-cy` is unique to a page just use it. `cy.get`ting the parent element and using `find` may not work. Very strange behavior.
- To use `select()` on a component built on top of the `SelectorBase` component, you must use `cy.get(<component>).find('selector-input').select(<item>)`

## Entry point structure

- Main container is a Bootstrap-Vue-Next [_BCard_](https://bootstrap-vue-next.github.io/bootstrap-vue-next/docs/components/card)

- BOIL THIS DOWN TO A MINIMAL EXAMPLE...

```JavaScript
<script setup>
import dayjs from 'dayjs';
import CropSelector from '@comps/CropSelector/CropSelector.vue';
import * as uiUtil from '@libs/uiUtil/uiUtil.js';
</script>

<template>
  <BToaster />
  <BCard
    bg-variant="light"
    header-tag="header"
  >
    <template #header>
      <h2 class="text-center">Tray Seeding</h2>
    </template>

    <BForm
      @submit="submit"
      @reset="reset"
    >
      <!-- Seeding Date -->
      <BFormGroup
        id="ts-date-group"
        label-for="ts-date"
        label-cols="auto"
        label-align="end"
        content-cols="auto"
      >
        <template v-slot:label>Date:<sup class="text-danger">*</sup> </template>
        <BFormInput
          id="ts-date"
          data-cy="ts-date"
          type="date"
          v-model="form.seedingDate"
          aria-describedby="date-help"
          required
        />
        <BFormText id="date-help">Date seeding occurred.</BFormText>
      </BFormGroup>

      <!-- Crop Selection -->
      <CropSelector
        required
        helpText="Select seeded crop."
        v-model:selected="form.crop"
        v-on:ready="createdCount++"
        v-on:error="
          (msg) =>
            uiUtil.showToast('Network Error', msg, 'top-center', 'danger', 5)
        "
      />

      <!-- Submit and Reset Buttons -->

      <!-- TODO: MAKE SO CAN'T SUBMIT AGAIN UNTIL A CHANGE HAS BEEN MADE -->
      <!-- POSSIBLY JUST CLEAR THE LOCATION OR THE CROP? -->
      <BRow>
        <BCol cols="8">
          <BButton
            type="Create"
            class="form-control"
            variant="primary"
            >Submit</BButton
          >
        </BCol>
        <BCol cols="4">
          <BButton
            type="Reset"
            class="form-control"
            variant="danger"
            >Reset</BButton
          >
        </BCol>
      </BRow>
    </BForm>
  </BCard>

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        seedingDate: dayjs().format('YYYY-MM-DD'),
        crop: null,
      },
      createdCount: 0,
    };
  },
  methods: {
    submit() {
      console.log(this.form);
    },
    reset() {
      this.seedingDate = dayjs().format('YYYY-MM-DD');
      this.form.crop = null;
    },
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>
```

Every entry point has a `<BToaster />` element as its first element.

- The `BToaster` allows alert/info/success/error messages to be displayed.

  - A message is displayed for 5 seconds on any error.
  - A submitting message is displayed when the form is submitted. This is dismissed when the submit was successful or an error occurred.
  - A success message is displayed for 1 second if the submit is successful.

  - Every FarmData2 component emits an `error` event with a message when an error occurs.
  - The entrypoint then must have an `on-error` handler that displays the Toast.

```JavaScript
v-on:error="(msg) => showToast('Network Error', msg, 'top-center', 'danger', 5)"
```

- Component / element naming:

  - Every component / element referenced in css or a test gets and `id` and a `data-cy`.
  - Values for the `id` and `data-cy` use `kabob-case`.

- Values for placement and variant should be documented by pointing to the Bootstrap-Vue-Next documentation

- Every entry point will import the `uiUtil` module

- All components are contained in a Bootstrap-Vue-Next [_Form_](https://bootstrap-vue-next.github.io/bootstrap-vue-next/docs/components/form) element.

  - Ideally all components will be FarmData2 components that wrap the Bootstrap-Vue-Next components to simplify their use in FD2.

- Every entry point contains some essential code that facilitates testing.

Every entry point has a data element with at least a `form`, a `validity` and a `createdCount` element:

- form contains values for each form element and are v-modeled to props.
- `validity` contains the validity of each form element and are set by `valid` event handlers.
  - all should be `null` to start.
  - used to determine if the form can be submitted.
  - also contains a `show` attribute bound to the `show-validity` prop
    - set to true to have component styled to show validity.
- createdCount is used to track when the entry point is ready to be used in tests.

```JavaScript
data() {
  return {
    form: {
      ...,
    },
    validity: {
      show: false,
      ...
    }
    createdCount: 0,
  };
},
```

The form will have an `isValid()` computed property that uses the `validity` values to set the `show-validity` prop of all of the components and to enable/disable the submit button.

Every API call made in created must increment `createdCount` when finished.

```JavaScript
created() {

  // once promise from API call resolves...
  this.createdCount++;
},
```

Every FarmData2 component emits a `ready` event when it is ready to be used in tests.

- Every component used must have a `v-on` handler for this event.

  - This handler increments the `createdCount`.

- Props that the entry point uses to affect the component state should be `v-model`ed to the data in `data.form`

```JavaScript
<CropSelector
  required
  helpText="Select seeded crop."
  v-model:selected="form.crop"
  v-on:ready="createdCount++"
  v-on:error="
    (msg) =>
      uiUtil.showToast('Network Error', msg, 'top-center', 'danger', 5)
  "
/>
```

Every entry point has a computed property that indicates when all API calls and components are ready.

```JavaScript
pageDoneLoading() {
  return this.createdCount == 2;
},
```

Every entry point template ends with the following `<div>` that uses the `pageDoneLoading()` property to indicate that the page is ready for testing.

```JavaScript
  <div
    data-cy="page-loaded"
    v-show="false"
  >
    { pageDoneLoading }}
  </div>
```

Cypress tests use `cy.waitForPage()` to wait for the entry point to fully load before running tests.

```JavaScript
describe('Sample test.', () => {
  it('Sample test.', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the desired entry point.
    cy.visit('fd2/tray_seeding/');
    // Wait for everything to be ready before testing.
    cy.waitForPage();

    // Entry point is now fully loaded...
  });
});
```

- Include the following CSS in an entrypoint to optimize the entry point for mobile. This hides and reduces the space required for some of the farmOS UI elements. It reduces margins and borders to increase screen real estate.

```CSS
<style>
@import url('@css/fd2-mobile.css');
</style>
```

## Drupal module and CSS

If an entry point uses a component that contains its own `<style scoped>` element, and that component is used in more than one entry point, then the `.css` file for the component must be included in the entry point's `css` section in the `farm_fd2.libraries.yml` file. See the `direct_seeding` entry point section of `farm_fd2.libraries.yml` for an example.

## Technical Build Details

- both an entry_point.html and an index.html
  - identical.
  - entry_point.html allows vite to put css for SPC in its on dir.
  - index.html allows us to access page using the same url on the dev/prev server as in farmOS.
