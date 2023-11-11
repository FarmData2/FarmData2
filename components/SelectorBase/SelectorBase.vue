<template>
  <BFormGroup
    id="new-comp-group"
    data-cy="new-comp-group"
  >
    <p data-cy="placeholder">Component content goes here.</p>
  </BFormGroup>
</template>

<script>
import * as uiUtil from '@libs/uiUtil/uiUtil.js';

/**
 * A new component.
 *
 * ## Usage Example
 *
 * ```html
 * Add example of how to add this component to a template.
 * See the other components in the `components` directory for examples.
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * `attr-value`          | identify element with the `data-cy="attr-value"`
 */
export default {
  name: 'SelectorBase',
  components: {},
  emits: ['ready', 'valid'],
  props: {
    /**
     * Whether a value for the input element is required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether validity styling should appear on input elements with invalid values.
     * This prop is watched by the component.
     */
    showInvalidStyling: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    isValid() {
      /*
       * Edit this computed property to indicate when the values are valid.
       * This should account for the `required` prop but should be independent of the `showInvalid` prop.
       */
      return true;
    },
    // Controls component styling (i.e. when green check or red X and invalid feedback) should be displayed.
    validationStyling() {
      return uiUtil.validationStyling(this.isValid, this.showInvalidStyling);
    },
  },
  methods: {},
  watch: {
    isValid() {
      /**
       * The validity of the component has changed.  Also emitted when the component is created.
       * @property {*} valid `true` if the component's value is valid; `false` if it is invalid.
       */
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    //Emit the initial valid state of the component's value.
    this.$emit('valid', this.isValid);

    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
