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

- Components manage props, state and events to allow page to change state via the prop.

  - The component provides a `prop` for every value that is collected by the component
  - The component watches the `props` and the state variables that are `v-modeled` to input elements
  - when a watched prop changes the component updates its state.
  - When the state for a value that a component collects changes, the component emits an `updated:prop_name` event with a payload giving the new value of the prop.
  - The entry point should `v-model` the prop to an element in its `data.form`

- All events emitted must be kabob-case.

- All components must emit a `ready` event when they are ready to be used in tests.

  - e.g. any API calls that were made in `created` have completed.

- If an error occurs, the component must emit an `error` event with a `String` message as the payload.

  - The entrypoint will handle the error.

- All components must emit a `valid` event any time their `isValid` computed property changes.

  - This event will have a `boolean` payload indicating if the component's value is valid or not.
  - The component `watch`es the `isValid` computed property for changes and emits this event.

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

Any test that uses the database should reset it in the `before` hook.

Note: Every test `it` should wait for the `ready` event to be emitted before performing any tests. In some components this will be immediately, in others it will wait for an API call to complete. This is included in all tests for consistency and to reduce test flake.

### Component Tests Organization

- Every component should have tests that:

  - These should be in approximately the order they can be written as a new component is created.

  - check static content (`*.content.comp.cy.js`)

    - check everything that does not depend upon a prop change or an action.
      - e.g. check that all of the `data-cy` elements exist / `have.text` / `have .value` (as appropriate)
    - check that content set by static props (i.e. not watched)
      - e.g. check that the required element indicators are not present by default but can be added using the `required` prop.
    - check that content is loaded via API calls.
      - e.g. fields vs greenhouses in LocationSelector.

  - check styling (`*.styling.comp.cy.js`)

    - check that the valid/invalid styling is applied as expected based on `isValid` `required`, `showValidityStyling` and any other criteria that is necessary.
    - if component uses a sub-component (e.g. `SelectorBase`) then just check that the `showValidityStyling` prop is passed, because the sub-component will have tested the actual styling that is applied.

  - check events (`*.events.comp.cy.js`)

    - check that all events are emitted properly

      - Note that the `ready` event is used in all tests so does not need to be tested separately.
      - check that `update:prop_name` and `valid` are emitted as appropriate.
      - include all error events (including network errors) are emitted properly

      - do something to cause the event and check that it is emitted properly and has the correct payload.

        - i.e. Use `cy.intercept` to generate network errors on the appropriate route.

    - Give or point to examples that illustrate structure for:

      - changing props.

  - check other behaviors (`*.behavior.comp.cy.js`)

    - check that changing a reactive or watched prop has the proper effect.

      - e.g. changes to prop changes the component as desired.
      - e.g. watches and deep watches work.

    - check that actions in the component have the proper effect.

      - e.g. clicking buttons, validating value (required, length, values, format, etc.) etc.

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
