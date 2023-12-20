<template>
  <div>
    <BFormGroup
      id="date-group"
      data-cy="date-group"
      label-for="date"
      label-cols="auto"
      label-align="end"
    >
      <template v-slot:label>
        <span data-cy="date-label">Date:</span>
        <sup
          data-cy="date-required"
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
        v-bind:state="validityStyling"
        v-bind:required="required"
      />
      <BFormInvalidFeedback
        id="date-invalid-feedback"
        data-cy="date-invalid-feedback"
        v-bind:state="validityStyling"
      >
        A valid date is required.
      </BFormInvalidFeedback>
    </BFormGroup>
  </div>
</template>

<script>
import dayjs from 'dayjs';

/**
 * The DateSelector component provides a UI element for selecting a date.
 *
 * ## Usage Example
 *
 * ```html
 * <DateSelector
 *   required
 *   v-model:date="form.seedingDate"
 *   v-bind:showInvalidStyling="validity.show"
 *   v-on:valid="validity.seedingDate = $event"
 *   v-on:ready="createdCount++"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name          | Description
 * ------------------------| -----------
 * date-group              | The `BFormGroup` component containing this component.
 * date-label              | The `span` component containing the "Date:" label.
 * required-star           | The `*` that appears in the label if the input is required.
 * date-input              | The `BFormInput` component used to select a date.
 * date-invalid-feedback   | The `BFormInvalidFeedback` component that displays help when the date is invalid.
 */
export default {
  name: 'DateSelector',
  emits: ['ready', 'update:date', 'valid'],
  props: {
    /**
     * The selected date.
     * This prop is watched and changes are relayed to the component's internal state..
     */
    date: {
      type: String,
      default: dayjs().format('YYYY-MM-DD'), // default to today.
    },
    /**
     * Whether a crop selection is required or not.
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
    return {
      chosenDate: this.date,
    };
  },
  computed: {
    isValid() {
      return dayjs(this.chosenDate).isValid();
    },
    // Controls component styling (i.e. when green check or red X and invalid feedback) should be displayed.
    validityStyling() {
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
  methods: {},
  watch: {
    chosenDate() {
      /**
       * The selected date has changed.
       * @property {String} date the newly chosen date (YYYY-MM-DD).
       */
      this.$emit('update:date', this.chosenDate);
    },
    date() {
      this.chosenDate = this.date;
    },
    isValid() {
      /**
       * The validity of the date has changed.
       * @property {Boolean} valid whether the date is valid or not.
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
