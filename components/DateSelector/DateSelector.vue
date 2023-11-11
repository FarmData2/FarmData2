<template>
  <BFormGroup
    id="date-group"
    data-cy="date-group"
    label-for="date"
    label-cols="auto"
    label-align="end"
    content-cols="auto"
  >
    <template v-slot:label>
      <span data-cy="date-label">Date:</span>
      <sup
        data-cy="required-star"
        v-if="required"
        class="text-danger"
        >*</sup
      >
    </template>

    <BFormInput
      id="date-input"
      data-cy="date-input"
      type="date"
      v-model="chosenDate"
      v-bind:state="validationStyling"
      v-bind:required="required"
    />
    <BFormInvalidFeedback
      id="date-invalid-feedback"
      data-cy="date-invalid-feedback"
      v-bind:state="validationStyling"
    >
      A valid date is required.
    </BFormInvalidFeedback>
  </BFormGroup>
</template>

<script>
import dayjs from 'dayjs';
import * as uiUtil from '@libs/uiUtil/uiUtil.js';

/**
 * A component for selecting a date.
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
 * Attribute Name            | Description
 * --------------------------| -----------
 * `date-group`              | The `BFormGroup` component containing this component.
 * `date-label`              | The `span` component containing the "Date:" label.
 * `required-star`           | The `*` that appears in the label if the input is required.
 * `date-input`              | The `BFormInput` component used to select a date.
 * `date-invalid-feedback`   | The `BFormInvalidFeedback` component that displays help when the date is invalid.
 */
export default {
  name: 'DateSelector',
  emits: ['ready', 'update:date', 'valid'],
  props: {
    /**
     * Whether a crop selection is required or not.
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
    /**
     * The selected date. This prop is watched by the component.
     */
    date: {
      type: String,
      default: dayjs().format('YYYY-MM-DD'), // default to today.
    },
  },
  data() {
    return {
      chosenDate: this.date,
    };
  },
  computed: {
    isValid() {
      // Indicates if the current value of the component is valid.
      if (this.required) {
        return this.chosenDate != null && this.chosenDate.length === 10;
      } else {
        return true;
      }
    },
    // Controls component styling (i.e. when green check or red X and invalid feedback) should be displayed.
    validationStyling() {
      return uiUtil.validationStyling(this.isValid, this.showInvalidStyling);
    },
  },
  methods: {},
  watch: {
    chosenDate() {
      /**
       * The selected date has changed.
       * @property {string} date the newly chosen date (YYYY-MM-DD).
       */
      this.$emit('update:date', this.chosenDate);
    },
    date() {
      this.chosenDate = this.date;
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
    // Emit the initial valid state of the component's value.
    this.$emit('valid', this.isValid);

    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
