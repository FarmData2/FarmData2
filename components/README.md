# Components

Custom FarmData2 Vue Components.

- Create a directory for each component
  - `.vue` file for the component
  - `.comp.cy.js` files for the component tests

## Creating a new Component

- use `addComponent.bash`

  - describe its use...

- modify `.vue` file as appropriate.
- modify the `.comp.cy.js` file as appropriate.

  - See component testing below...

- Use other components as examples!!
  - copy / paste and modify liberally.

## Component Structure

### Template

- Many components will be one or more [_Form Group_](https://bootstrap-vue-next.github.io/bootstrap-vue-next/docs/components/form-group) elements.

  - the label for a required input element is followed by `<sup v-if="required" class="text-danger">*</sup>`.

- Each input element must have:

  - `<BFormInvalidFeedback>`
    - with its `state` prop `v-bound` to the `invalidStyling` prop

- Elements must also have:
- `id` must be set for each input element.
- All testable elements in the component must have a `data-cy` attribute.
  - e.g. every input element must have a `data-cy` attribute.
  - all `data-cy` in a component should be prefixed by the component name or abbreviation.
    - E.g. `data-cy="crop-group` or `location-0`.
- their `state` prop `v-bound` to the `invalidStyling` computed property
- `BRow` and `BCol` can be used to create more complex layouts.
- `BFormSelect` elements should begin with `{ value: null, text: '' }`.
  - to allow them to be blank when form is reset.
- attributes on component/element tags should appear in the order:
  - id
  - data-cy
  - classes, properties
  - v-if / v-show
  - v-model
  - v-bind
  - v-on

### Script

- imports appear after `<script>` and before the component comment.

  - This is where custom components are imported.

- elements of the script should be in the order:

  - name
  - components - may be empty as Bootstrap-Vue-Next components are automatically imported.
    - When using custom components they should be imported and then listed here.
  - emits
  - props
  - data
  - computed
  - methods
  - created

- list props in alphabetical order.

- All components must have a `required` prop.

  - Indicates that inputs are required field if present.
  - required fields are indicated by a red asterisk

- All components must have a `showValidityStyling` prop

  - This prop is set by the entry point to indicates that bootstrap styling should be shown for inputs.
  - The component indicates the validity of inputs using its `isValid` computed property.

    - Returns true if the input value is valid for the component.

  - The component indicates the type of styling to be used using its `invalidStyling` computed property.

    - This function returns:
      - `true` to apply valid styling (green check)
      - `false` to apply invalid styling (red x and invalidFeedbackText)
      - `null` to not apply either styling.

  - The `showValidityStyling` prop should be is set by the entry point to
    - `true` when "Submit" is clicked
    - `false` when "Reset" is clicked
    - `false` when a submission is successful.

- Components manage props, state and events to allow page to change state via the prop.

  - The component provides a `prop` for every value that is collected by the component
  - The component watches the `props` and the state variables that are `v-modeled` to input elements
  - when a watched prop changes the component updates its state.
  - When the state for a value that a component collects changes, the component emits an `updated:prop_name` event with a payload giving the new value of the prop.
  - The entry point should `v-model` the prop to an element in its `data.form`

- All events emitted must be kabob-case.

- All components must emit a `ready` event when they are ready to be used in tests.

  - e.g. any API calls that were made in `created` have completed.

- If an error occurs, the component must emit an `error` event with a `String` message as the payload. The component should also print more detailed information to the console for debugging. See `CropSelector` for an example.

  - The entrypoint will handle the error.

- All components must emit a `valid` event any time their `isValid` computed property changes.

  - This event will have a `boolean` payload indicating if the component's value is valid or not.
  - The component `watch`es the `isValid` computed property for changes and emits this event.

- If a component only contains one element, then it should be wrapped in a `<div>` element. See the `CommentComponent` component for an example and explanation.

### farmOS Permissions Checking

A component can check the permissions of the logged in farmOS user using appropriate function in `farmosUtil.js`.

If a permission needs to be checked that is not yet supported it can be added to the `$perms` array in the `permissions` function in `modules/farm_fd2/src/module/Controller/FD2_Controller.php` file.

## Component Testing

- use `bin/test.bash`

  - `test.bash --comp --gui` - initially to run individual tests.
  - `test.bash --comp --glob="**/CompName/*.comp.cy.js"` - to run all test on the component headless.

### Component Test Structure

Each test file is structured as follows:

```Javascript
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';

describe('Test the default LocationSelector content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check for the SelectorBase element', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="location-selector"]').should('exist');
      });
  });
});
```

Best practice is to [reset the database state before tests are run](https://docs.cypress.io/guides/references/best-practices#State-reset-should-go-before-each-test). Doing this before every test or even at the start of every file adds significantly to the runtime of the test suite. FarmData2 compromises by resetting the database to the DB that was most recently installed (i.e. using `installDB.bash`) before each test run. A test run is one cypress command (e.g. as is done by `test.bash --comp`). Any test that absolutely requires a clean database (i.e. cannot tolerate changes made by prior tests) can reset it in its `before` hook using the following code:

```Javascript
  before(() => {
    cy.task('initDB');
  });
```

Note: Every test `it` should wait for the `ready` event to be emitted before performing any tests. In some components this will be immediately, in others it will wait for an API call to complete. This is included in all tests for consistency and to reduce test flake.

Use: `cy.task('log', 'message')` to log messages to the console.
Use: `cy.task('logObject', obj)` to log an object to the console.

- Visible in the console when running headless.
- Click on the task in the test events output to print to console in Cypress gui.

### Component Tests Organization

- Every component should have tests that:

  - These should be in approximately the order they can be written as a new component is created.

  - check initial content (`*.content.comp.cy.js`)

    - check all `data-cy` elements exist and have right values for default props.
      - look at `<template>` to see what needs to be tested.
      - check that all of the `data-cy` elements `exist` / `have.text` / `have.value` (as appropriate)
      - if using a sub-component it is sufficient to check that the the sub-component if present.
      - This test should check all of the required props and the default values of the optional props.
      - e.g. `label`, `required`
      - `showValidityStyling` should be checked if a sub-component is used that handles it.
    - check all optional `props` are handled correctly
      - Set each prop to a non-default value and check for its effect.
        - can often be combined into a single test.
      - If using a sub-component (e.g. `SelectorBase`, `NumericInput`) then
        - Check sub-component elements to ensure that props are passed through.
    - check that all content loaded via API calls is actually loaded.
      - e.g. crops or fields vs greenhouses in LocationSelector.

  - check styling (`*.styling.comp.cy.js`)

    - check that the type of valid/invalid styling to be shows as expected based on `isValid` `required`, `showValidityStyling` and any other criteria that is necessary.
      - This is often an enumeration test that checks all 8 combinations of these values.
      - If the computations for displaying the valid/invalid styling are done by a sub-component (e.g. `SelectorBase`) then this test is not required.
        - The `content` test will have checked that `showValidityStyling` is passed and the sub-component's tests will have checked that the type of styling to show is correct.
    - If a component is never styled (e.g. `CommentBox` or `TextDisplay`) then this test is not required.

  - check events (`*.events.comp.cy.js`)

    - check that all events listed in the component's `emits` property are emitted properly
      - Note that the `ready` event is used in all tests so does not need to be tested separately.
      - check that `update:prop_name` and `valid` are emitted as appropriate.
        - if using a sub-component it is sufficient to check that these events are propagated by the parent component, it is not necessary to check their payloads or all circumstances for their emission - the tests of the sub-component will have done that.
      - test all error events (including network errors from API requests) are emitted properly
      - To do the test, do something to cause the event and check that it is emitted properly and has the correct payload.
        - i.e. change the selection, type some text, etc...
        - i.e. Use `cy.intercept` to generate network errors on the appropriate route.

  - check other behaviors (`*.behavior.comp.cy.js`)

    - check that changing each reactive or watched prop has the proper effect.
      - need to give example or point to one where props are changed.
      - e.g. changes to prop changes the component as desired.
      - e.g. watches and deep watches work.
      - Note: if using a sub-component that reacts to a prop, the `content` tests should be sufficient. They show the prop is "wired" correctly, the sub-component tests show that it is reactive to the prop.
    - check that actions in the component have the proper effect.
      - e.g. clicking buttons, validating value (required, length, values, format, etc.)
    - etc.

  - check permission based content (`*.permission.comp.cy.js`)

    - Check that correct content is displayed based on the user's permissions.
      - Do not save and restore `localStorage` or `sessionStorage` between tests as changing users requires a new farmOS instance be created for each test.
      - create `farmOS` instance as `admin` (which should have all permissions).
        - The component code will use the same `farmOS` instance because it requests it with no parameters.
        - Check for the UI elements / behaviors that should be present.
      - Create a `farmOS` instance as `guest` (which should not have many permissions.)
        - Check that the UI elements / behaviors that should not be present are not present.
      - Note: `worker#` and `manager#` have appropriate permissions when logging into farmOS, but when running via API they need to request a scope, which is not currently implemented in `farmosUtil.js`.

## Documenting components

- docs are in `docs/components`

- to generate docs

  - `npm run doc:gen`

- to view docs

  - `npm run doc:view`

- Docs are generated by [vue-docgen-cli](https://vue-styleguidist.github.io/docs/Docgen.html#api)
  - [Documenting Components](https://vue-styleguidist.github.io/docs/Documenting.html)

### Documentation Conventions

- List all minimum expectations here...

Inside the script, after the imports and just before the `export default {` line:

- First line of this comment must be a one sentence description that will appear in the index doc.
- This block should give an example of how to place the component in a page.
- This block must document the data-cy attributes of the component.

````Javascript
/**
 * This component does blah blah blah...
 *
 * More description of the component can go here...
 *
 * ## Example
 *
 * ```html
 * Give example of tag for using component in a page.
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * `data-cy-att-name`    | Identify the element tagged with the attribute.
 * `another-one`         | Blah blah.
 */
````

### Props

- every prop gets a comment
- if the prop is watched the comment should indicate this.
- if the prop is _deep_ watched the comment should indicate this.

### Events

- every event gets a comment. If the same event is emitted multiple times, just the first one gets a comment.
- If the event hasa payload it must include an `@property` tag describing the payload.

### Methods / Computed / Watch

- these are not user facing and are not included in the docs.
- comments in the code can still be helpful to anyone modifying the component.
