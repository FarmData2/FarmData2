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
      aria-describedby="date-help"
      v-bind:required="required"
    />
    <BFormText
      id="date-help"
      data-cy="date-help"
      >{{ helpText }}</BFormText
    >
  </BFormGroup>
</template>

<script>
import { BFormInput } from 'bootstrap-vue-next';
import dayjs from 'dayjs';

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
 * Attribute Name        | Description
 * ----------------------| -----------
 * `date-group`          | The `BFormGroup` component containing this component.
 * `date-label`          | The `span` component containing the "Date:" label.
 * `required-star`       | The `*` that appears in the label if the input is required.
 * `date-input`          | The `BFormInput` component used to select a date.
 * `date-help`           | The `BFormText` component that displays the help text below the date input.
 */
export default {
  name: 'DateSelector',
  components: { BFormInput },
  emits: ['ready', 'update:date'],
  props: {
    /**
     * Whether a crop selection is required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Help text that appears below the select element.
     */
    helpText: {
      type: String,
      default: 'Select date.',
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
  computed: {},
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
  },
  created() {
    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
