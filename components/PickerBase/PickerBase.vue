<template>
  <BFormGroup
    id="picker-group"
    data-cy="picker-group"
    label-for="picker-options"
    label-cols="auto"
    label-align="end"
  >
    <template v-slot:label>
      <span data-cy="picker-label">{{ label }}:</span>
      <sup
        data-cy="picker-required"
        class="text-danger"
        v-if="required"
        >*</sup
      >
    </template>

    <BInputGroup
      id="picker-input"
      data-cy="picker-input"
    >
      <BFormCheckboxGroup
        data-cy="picker-options"
        id="picker-options"
        name="picker-options"
        v-model="checked"
        v-bind:options="options"
        v-bind:state="validationStyling"
        v-on:change="updatePicked($event)"
      />

      <BFormInvalidFeedback
        id="picker-invalid-feedback"
        data-cy="picker-invalid-feedback"
        v-bind:state="validationStyling"
      >
        {{ invalidFeedbackText }}
      </BFormInvalidFeedback>
    </BInputGroup>
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
  name: 'PickerBase',
  components: {},
  emits: ['ready', 'update:picked', 'valid'],
  props: {
    /**
     * Whether it is required that at least one item be picked or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * The text to display if the input is invalid.
     */
    invalidFeedbackText: {
      type: String,
      required: true,
    },
    /**
     * Whether validity styling should appear on input elements.
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
    /**
     * The label for the picker.
     */
    label: {
      type: String,
      required: true,
    },
    /**
     * An array of strings for the options to be displayed in the picker.
     */
    options: {
      type: Array,
      required: true,
    },
    /**
     * An an array of strings indicating which picker options are checked.
     */
    picked: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checked: this.picked,
    };
  },
  computed: {
    isValid() {
      return !this.required || this.checked.length > 0;
    },
    // Controls component styling (i.e. when green check or red X and invalid feedback) should be displayed.
    validationStyling() {
      const R = this.required;
      const V = this.isValid;
      const S = this.showValidityStyling;

      if (V && S) {
        return true;
      } else if (R && !V && S) {
        return false;
      } else {
        return null;
      }
    },
  },
  methods: {
    updatePicked() {
      /**
       * The picked options have changed.
       * @property {Array} picked An array of strings with the text of the picker options are checked.
       */
      this.$emit('update:picked', this.checked);
    },
  },
  watch: {
    isValid() {
      /**
       * The validity of the component has changed.  Also emitted when the component is created.
       * @property {Boolean} valid `true` if the component's value is valid; `false` if it is invalid.
       */
      this.$emit('valid', this.isValid);
    },
    picked() {
      this.checked = this.picked;
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
