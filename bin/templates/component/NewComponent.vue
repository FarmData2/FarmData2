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
  name: '%COMPONENT_NAME%',
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
     * Text that appears below the input element when value is valid.
     */
    validText: {
      type: String,
      default: 'Default valid message.',
    },
    /**
     * Text that appears below the input element when value is invalid.
     */
    invalidText: {
      type: String,
      default: 'Default invalid message.',
    },
    /**
     * Whether to show the validity styling of the input elements.
     * This prop is watched by the component.
     */
    showValidity: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      validate: this.showValidity,
    };
  },
  computed: {
    isValid() {
      // Indicates if the current value of the component is valid.
      if (this.required) {
        return false;  // TODO: Add validation here.
      } else {
        return true;
      }
    },
    useValidityStyling() {
      // Indicates if the component UI validity should be shown.
      // 'null' if the entrypoint says not to showValidity
      // `true` if the entrypoint says to showValidity and component value is valid.
      // `false` otherwise.
      if (!this.validate) {
        return null;
      } else {
        return this.isValid;
      }
    },
  },
  methods: {},
  watch: {
    showValidity() {
      this.validate = this.showValidity;
    },
    isValid() {
      /**
       * The validity of the component has changed.
       * @property {boolean} valid whether the component's value is valid or not.
       */
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    /**
     * This component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
