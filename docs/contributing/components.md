# Working on Vue.js Components or Examples

- Details coming soon.

- Tour of a Component


===

Include discussion of why build simple custom components..
- reusability (e.g. fetching locations)
- testability

## Components

Custom FarmData2 Vue Components.

- Create a directory for each component
  - `.vue` file for the component
  - `.comp.cy.js` files for the component tests

## Creating a new Component

- use `addComponent.bash`

  - describe its use...
    - creates its own branch
  - To add component in a branch...
    - run it
    - switch to branch
    - then commit

- modify `.vue` file as appropriate.
- modify the `.comp.cy.js` file as appropriate.

  - See component testing below...

- Use other components as examples!!
  - copy / paste and modify liberally.

## Component Structure

### Template

- Include a `<div>` or a `<span>` inside `<template>` to ensure that `cy.get` and `cy.find` will work consistently across components. Without this extra level of nesting it seems that the Vue component element containing the component can sometimes be optimized away. Thus, trying to `cy.get` that element will fail in tests.

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

    - If `isValid` returns false if the component should block submission of the form that contains it.
      - If the component is not required then blank/empty/no value/etc is considered a valid value.
      - If the component is required then blank/empty/no value/etc is not considered a valid value.
    - The submit function in the page will use this value to determine if the submit button should be enabled or disabled and whether or not to add non-required fields to the submission.

  - The component indicates the type of styling to be used using its `validityStyling` computed property.

    - This function returns:
      - `true` to apply valid styling (green check)
      - `false` to apply invalid styling (red x and invalidFeedbackText)
      - `null` to not apply either styling. This should be applied when showValidityStyling is set false, and also to non-required inputs that are blank/empty.

  - The `showValidityStyling` prop should be is set by the entry point to
    - `true` when "Submit" is clicked
    - `false` when "Reset" is clicked
    - `false` when a submission is successful.

- Components manage props, state and events to allow page to change state via the prop.

  - The component provides a `prop` for every value that is collected by the component
    - An entry point can `v-model` the associated `prop` to an element in its `data.form`
  - The `prop` is assigned to some internal state (in `data`)
  - The internal state is `v-model`ed to the input element or sub-component.
  - The component watches the `props`
    - when a watched `prop` changes the component updates the internal state.
  - The component listens (`v-on`) for `update` events from the input element or sub-component.
    - When an `update` event occurs the component emits an `updated:prop_name` event with a payload communicating the new value of the `prop` to the entry point or parent component.

- NOTE: Keeping internal state allows for more thorough testing of the component apart from a page that changes props in response to events (i.e. closes the loop). It make this loop more explicit and makes the code more idiomatic across components.

- All events emitted must be kabob-case.

- All components must emit a `ready` event when they are ready to be used in tests.

  - e.g. any API calls that were made in `created` have completed.

- If an error occurs, the component must emit an `error` event with a `String` message as the payload. The component should also print more detailed information to the console for debugging. See `CropSelector` for an example.

  - The entrypoint will handle the error.

- All components must emit a `valid` event any time their `isValid` computed property changes.

  - This event will have a `boolean` payload indicating if the component's value is valid or not.
  - The component `watch`es the `isValid` computed property for changes and emits this event.
  - This event should be emitted when:
    - any time the component's `isValid` computed property changes. This should be done with a `watch` for the `isValid` computed property.
      - If `isValid` is `null` then this watcher should not emit the event.

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

You can change the database that will be used for testing by using the `installDB.bash` script manually prior to running the tests. This is useful when you want to run tests against a pre-release of the sample database. For example:

```bash
installDB.bash --release=v3.1.0-development.3 --asset=db.sample.tar.gz
```

Note: Every test `it` should wait for the `ready` event to be emitted before performing any tests. In some components this will be immediately, in others it will wait for an API call to complete. This is included in all tests for consistency and to reduce test flake.

Use: `cy.task('log', 'message')` to log messages to the console.
Use: `cy.task('logObject', obj)` to log an object to the console.

- Visible in the console when running headless.
- Click on the task in the test events output to print to console in Cypress gui.

- Add pointers to canonical examples of tests:
  - basic existence
    - checking styles
  - events
    - interacting with elements
    - generating network errors
  - changing props
  - Others???

### Component Tests Organization

- Every component should have tests that:

  - These should be in approximately the order they can be written as a new component is created.

  - check initial content (`*.content.comp.cy.js`)

    - Check required props and default prop values
      - Set only required props in the test.
      - Check static content not controlled by props.
      - check effect of all required props
        - e.g. `label`, `invalidFeedback`, etc.
      - Check default values of all optional props.
        - e.g. `required`, `showValidityStyling`, etc.
      - look at `<template>` to see what elements need to be tested.
        - check existence of `data-cy` elements using `exist`.
        - use `have.class` / `have.text` / `have.value` on elements
        - If component uses other components, check sub-component elements as necessary.
      - can usually be done in one test.
    - check that non-default optional `prop` values are handled correctly
      - Set each optional prop to a non-default value and check for its effect.
      - use `have.class` / `have.text` / `have.value` on elements
        - If component uses other components, check sub-component elements as necessary.
      - ideally one test per optional prop.
    - check that all content loaded via API on creation is loaded correctly.
      - e.g. crops or fields vs greenhouses in LocationSelector.

  - check styling (`*.styling.comp.cy.js`)

    - check that the type of valid/invalid styling to be shows as expected based on `isValid` `required`, `showValidityStyling` and any other criteria that is necessary.
      - This is often an enumeration test that checks all combinations of these values.
    - If the computations for displaying the valid/invalid styling are done by a sub-component (e.g. `SelectorBase`) then this test is not required because the prop will have been tested by the `content` test and the styling will have been tested by the sub-component.
      - The `content` test will have checked that `showValidityStyling` is passed and the sub-component's tests will have checked that the type of styling to show is correct.
    - If a component is never styled (e.g. `CommentBox` or `TextDisplay`) then this test is not required.

  - check events (`*.events.comp.cy.js`)

    - check that all events listed in the component's `emits` property are emitted properly
      - If the component computes `isValid` for itself then the `valid` event should be tested exhaustively.
      - At least one test per event for all other events:
        - Do something that should cause the event to be emitted.
          - e.g. change the selection, type some text, etc...
          - e.g. Use `cy.intercept` to generate network errors on the appropriate route.
        - Check that it is emitted and has the correct payload.
      - If using a sub-component check propagated events.
        - It is not necessary to check the payloads for these events or all circumstances for their emission - the tests of the sub-component will have done that.
      - The `ready` event is used in all tests so does not need to be tested separately.

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
    - If there is no user permission based content then this test is not required.

## Testing Idioms

- NOT ALL OF THESE ARE FOLLOWED UNIVERSALLY AT THIS POINT. SHOULD HAVE ISSUES CREATED FOR THEM.

- use `cy.get(@spy).its('callCount').should('equal', 1);` instead of `should('be.called.once')` etc. because `'called'` passes if the spy was called at least the specified number of times (`once`, `twice`, etc). [ This may not be true since calls may not have registered before the check unless it is in a then. ]

- `wrapper.setProps` - should always be first thing in a `then` because it does not wait for `cy` calls before it and can mess things up.

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


### Permissions

A component can check the permissions of the logged in farmOS user using appropriate function in `farmosUtil.js`.

If a permission needs to be checked that is not yet supported it can be added to the `$perms` array in the `permissions` function in `modules/farm_fd2/src/module/Controller/FD2_Controller.php` file.

### Pre-populating farmOS Data

The log categories and units used by FarmData2 are installed by the `farm_fd2.install` file in `modules/farm_fd2/src/module`.

To add new log categories or units:

- Edit the `farm_fd2.install` file.
- Rebuild the module.
- Uninstall the FarmData2 module (machine name: `farm_fd2`)
- Re-enable the Farmdata2 module.

Note: the `installDB.bash` script also uninstalls and re-enables the FarmData2 module. Thus, changes to the log categories and units will be reflected when tests are run headless.