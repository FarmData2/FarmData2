<template>
  <div>
    <BFormGroup
      id="picker-group"
      data-cy="picker-group"
      label-for="picker-options"
      label-cols="auto"
      label-align="end"
    >
      <template v-slot:label>
        <div class="d-grid d-md-flex">
          <div>
            <span
              id="picker-label"
              data-cy="picker-label"
              >{{ label }}:</span
            >
            <sup
              id="picker-required"
              data-cy="picker-required"
              class="text-danger"
              v-if="required"
              >*</sup
            >
          </div>
         <BButton
           v-if="showAllButton"
           id="picker-all-button"
           data-cy="picker-all-button"
           size="sm"
           variant="primary"
           v-on:click="pickAll"
          >
           <span v-if="checked.length === options.length">🚫 All</span>
           <span v-else>✅ All</span>
         </BButton>
        </div>
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
  </div>
</template>

<script>
/**
 * A base component that allows the user to pick multiple items using checkboxes.
 * This will typically be used as a base for building special purpose
 * "picker" components (e.g. `BedPicker`).
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/picker_base">The PickerBase Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/picker_base/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <PickerBase
 *   id="bed-picker"
 *   data-cy="bed-picker"
 *   label="Options"
 *   invalid-feedback-text="At least one choice is required"
 *   v-bind:required="required"
 *   v-bind:showValidityStyling="validity.showStyling"
 *   v-bind:showAllButton="showAllButton"
 *   v-bind:options="options"
 *   v-model:picked="form.picked"
 *   v-on:valid="(valid) => (validity.picked = valid)"
 *   v-on:ready="createdCount++"
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
 * `picker-all-button`       | The `BButton` component for the select "All" button.
 * `picker-invalid-feedback` | The `BFormInvalidFeedback` component that displays the invalid feedback.
 *
 * Note: The `picker-options` component is the stock BootstrapVue `BFormCheckboxGroup`
 * component.  Thus, there are not `data-cy` attributes defined for each of the
 * checkbox input components in the `BFormCheckboxGroup` component.  This means that
 * those must be accessed differently in the tests using `.children()`, `.find()` and `.eq()`.
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
     * Whether the select "All" button should be displayed below the picker label.
     */
    showAllButton: {
      type: Boolean,
      default: true,
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
      if (this.showValidityStyling) {
        if (!this.required && this.checked.length == 0) {
          return null;
        } else {
          return this.isValid;
        }
      } else {
        return null;
      }
    },
  },
  methods: {
    pickAll() {
      if (this.checked.length === this.options.length) {
        this.checked = [];
      } else {
        this.checked = [...this.options];
      }
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
    checked: {
      handler() {
        /**
         * The picked options have changed.
         * @property {Array} picked An array of strings with the names of the picked options.
         */
        this.$emit('update:picked', this.checked);
      },
      deep: true,
    },
    picked() {
      this.checked = this.picked;
    },
    options: {
      handler() {
        if (this.checked.length > 0) {
          this.checked = this.checked.filter((option) =>
            this.options.includes(option)
          );
        }
      },
      deep: true,
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
#picker-input {
  padding-top: 7px;
}
</style>
