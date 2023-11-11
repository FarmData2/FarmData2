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
- their `state` prop `v-bound` to the `invalidStyling` prop
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

- elements of the script should be in the order:

  - name
  - components - may be empty as Bootstrap-Vue-Next components are automatically imported.
  - emits
  - props
  - data
  - computed
  - methods
  - created

- All components must have a `required` prop.

  - Indicates that inputs are required field if present.
  - required fields are indicated by a red asterisk

- All components must have a `showInvalid` prop

  - This prop is set by the entry point to indicates that bootstrap styling should be shown for invalid inputs.
  - The component indicates the validity of inputs using its `isValid` computed property as described below.
  - The validity styling is shown:

    - When `isValid` is true (regardless of the value of the `showInvalid` prop).
    - When `isValid` is false and `showInvalid` is true.

  - This prop should be is set by the entry point to
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

- Components will have a `isValid()` computed property

  - true if the component's value is valid
  - false if the component's value is invalid
  - is bound to `state` on `<BFormValidFeedback>` and `<BFormInvalidFeedback>`
  - watched and a `valid` event is emitted when validity changes.

- All components must emit a `valid` event any time their validity changes.

  - This event will have a `boolean` payload indicating if the component's value is valid or not.
  - The component `watch`es the `isValid` computed property for changes and emits this event.

- Components have a `invalidStyling()` computed property
  - uses `isValid` computed property and `showInvalid` prop to determine if the component should show its validity styling.
  - provided by `uiUtil.invalidStyling` so that it is consistent across components.

## Component Testing

- use `bin/test.bash`

  - `test.bash --comp --gui` - initially to run individual tests.
  - `test.bash --comp --glob="**/CompName/*.comp.cy.js"` - to run all test on the component headless.

- Every component should have tests that:

  - These should be in approximately the order they can be written as a new component is created.

  - check static content (`*.content.comp.cy.js`)

    - check the default configuration of the component (i.e. no props set)
      - e.g. check that all of the `data-cy` elements exist / `have.text` / `have .value` (as appropriate)
    - check that content set by static props (i.e. not watched)
      - e.g. check that the required element indicators are not present by default but can be added using the `required` prop.
    - NOTE: Do not test content that relies on watched props or API requests.

  - check events (`*.events.comp.cy.js`)

    - test the `ready` event
      - ie. check that data is populated into elements (e.g. by API call) after `ready` is emitted.
    - check watched props

      - i.e. check that changing each watched prop has the desired effect in the component.

    - check that all other events are emitted properly

      - i.e. do something to cause the event and check that it is emitted properly and has the correct payload.
      - include all error events (including network errors) are emitted properly
        - i.e. Use `cy.intercept` to generate network errors on the appropriate route.

    - Give or point to examples that illustrate structure for:

      - waiting for `ready` before doing more.
      - changing props.

  - check other behaviors (`*.behavior.comp.cy.js`)

    - check that actions in the component have the proper effect.
      - e.g. clicking buttons, validating value (required, length, values, format, etc.) etc.
    - Note: do not retest things tested in events.

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
