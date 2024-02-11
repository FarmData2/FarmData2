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
 * A base component that allows the user to pick multiple items using checkboxes.
 * This will typically be used as a base for building special purpose
 * "picker" components (e.g. `BedPicker`).
 *
 * ## Usage Example
 *
 * ```html
 * <PickerBase
 *   v-if="bedList.length > 0"
 *   id="bed-picker"
 *   data-cy="bed-picker"
 *   invalidFeedbackText="At least one bed is required"
 *   label="Beds"
 *   v-bind:options="bedList"
 *   v-bind:picked="picked"
 *   v-bind:required="required"
 *   v-bind:showValidityStyling="showValidityStyling"
 *   v-on:update:picked="handleUpdatePicked($event)"
 *   v-on:valid="handleValid($event)"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name            | Description
 * --------------------------| -----------
 * `picker-group`            | The `BFormGroup` component containing the picker.
 * `picker-label`            | The label for the picker.
 * `picker-required`         | Indicator of whether at least one item is required to be picked or not.
 * `picker-input`            | The `BInputGroup` component containing the picker.
 * `picker-options`          | The `BFormCheckboxGroup` component that displays the check boxes.
 * `picker-invalid-feedback` | The `BFormInvalidFeedback` component that displays the invalid feedback.
 *
 * Note: The `picker-options` component is the stock BootstrapVue `BFormCheckboxGroup`
 * component.  Thus, there are not `data-cy` attributes defined for each of the
 * checkbox input components in the `BFormCheckboxGroup` component.  This means that
 * those must be accessed differently in the tests using `.children()` or `.eq()`.
 * See the `PickerBase.*.comp.cy.js` files for examples.
 */
export default {
  name: 'PickerBase',
  components: {},
  emits: ['ready', 'update:picked', 'valid'],
  props: {
    /**
     * The text to display if the input is invalid.
     */
    invalidFeedbackText: {
      type: String,
      required: true,
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
     * This prop is watched and changes will be reflected in the component.
     */
    options: {
      type: Array,
      required: true,
    },
    /**
     * An an array of strings indicating which picker options are checked.
     * This prop is watched and changes will be reflected in the component.
     */
    picked: {
      type: Array,
      default: () => [],
    },
    /**
     * Whether it is required that at least one item be picked or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether validity styling should appear on input elements.
     * This prop is watched and changes will be reflected in the component.
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
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

<style scoped>
#picker-options {
  padding-top: 7px;
}
</style>
