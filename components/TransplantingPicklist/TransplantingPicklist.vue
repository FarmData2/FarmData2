<template>
  <BFormGroup
    id="new-comp-group"
    data-cy="new-comp-group"
  >
    <p data-cy="placeholder">Component content goes here.</p>
  </BFormGroup>
</template>

<script>
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
  name: 'TransplantingPicklist',
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
     * Whether validity styling should appear on input elements.
     */
    showValidityStyling: {
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
       * Edit this computed property to return true if the component's value is valid,
       * or false if it is invalid.  This should account for whether the value is
       * required or not if necessary.
       */
      return false;
    },
    // Controls component styling (i.e. when green check or red X and invalid feedback) should be displayed.
    validityStyling() {
      /*
       * Edit this computed property to indicted the type of styling that should be applied
       * to the component based upon `required`, `isValid`, `showInvalidStyling`, and any
       * other criteria that is necessary.
       *
       * Bind this computed property to the `state` prop of the components to be styled.
       */
      return false;
    },
  },
  methods: {},
  watch: {
    isValid() {
      /**
       * The validity of the component has changed.  Also emitted when the component is created.
       * @property {Boolean} valid `true` if the component's value is valid; `false` if it is invalid.
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
