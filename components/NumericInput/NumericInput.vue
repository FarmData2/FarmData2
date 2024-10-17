<template>
  <div>
    <BFormGroup
      id="numeric-group"
      data-cy="numeric-group"
      label-for="numeric-input"
      label-cols="auto"
      label-align="end"
    >
      <template v-slot:label>
        <span data-cy="numeric-label">{{ label }}:</span>
        <sup
          data-cy="numeric-required"
          class="text-danger"
          v-if="required"
          >*</sup
        >
      </template>
      <BInputGroup class="has-validation">
        <BInputGroupPrepend>
          <BButton
            data-cy="numeric-decrease-lg"
            v-if="showLargeIncDec"
            v-bind:variant="
              disableLargeDec ? 'outline-secondary' : 'outline-success'
            "
            v-bind:disabled="disableLargeDec"
            size="sm"
            v-on:click="adjustValue(-incDecValues[2])"
            >&#x27EA;</BButton
          >
          <BButton
            data-cy="numeric-decrease-md"
            v-if="showMediumIncDec"
            v-bind:variant="
              disableMediumDec ? 'outline-secondary' : 'outline-success'
            "
            v-bind:disabled="disableMediumDec"
            size="sm"
            v-on:click="adjustValue(-incDecValues[1])"
            >&#x27E8;</BButton
          >
          <BButton
            data-cy="numeric-decrease-sm"
            v-if="showSmallIncDec"
            v-bind:variant="
              disableSmallDec ? 'outline-secondary' : 'outline-success'
            "
            v-bind:disabled="disableSmallDec"
            size="sm"
            v-on:click="adjustValue(-incDecValues[0])"
            >&#x2039;</BButton
          >
        </BInputGroupPrepend>
        <BFormInput
          id="numeric-input"
          data-cy="numeric-input"
          number
          lazy
          lazy-formatter
          v-model="valueAsString"
          v-bind:key="inputRefreshKey"
          v-bind:state="validityStyling"
          v-bind:required="required"
          v-bind:formatter="formatter"
          @update:model-value="valueChanged"
        />
        <BInputGroupAppend>
          <BButton
            data-cy="numeric-increase-sm"
            v-if="showSmallIncDec"
            v-bind:variant="
              disableSmallInc ? 'outline-secondary' : 'outline-success'
            "
            v-bind:disabled="disableSmallInc"
            size="sm"
            v-on:click="adjustValue(incDecValues[0])"
            >&#x203A;</BButton
          >
          <BButton
            data-cy="numeric-increase-md"
            v-if="showMediumIncDec"
            v-bind:variant="
              disableMediumInc ? 'outline-secondary' : 'outline-success'
            "
            v-bind:disabled="disableMediumInc"
            size="sm"
            v-on:click="adjustValue(incDecValues[1])"
            >&#x27E9;</BButton
          >
          <BButton
            data-cy="numeric-increase-lg"
            v-if="showLargeIncDec"
            v-bind:variant="
              disableLargeInc ? 'outline-secondary' : 'outline-success'
            "
            v-bind:disabled="disableLargeInc"
            size="sm"
            v-on:click="adjustValue(incDecValues[2])"
            >&#x27EB;</BButton
          >
        </BInputGroupAppend>
        <BFormInvalidFeedback
          id="numeric-invalid-feedback"
          data-cy="numeric-invalid-feedback"
          v-bind:state="validityStyling"
        >
          {{ invalidFeedbackText }}
        </BFormInvalidFeedback>
      </BInputGroup>
    </BFormGroup>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue-next';

/**
 * The NumericInput component is a UI component used to read numeric input values from the user.
 *
 * It can read integer or decimal numbers which can be rounded to a specified number of decimal places.
 * The component optionally includes up to three increase/decrease buttons that adust the value by specified amounts.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/numeric_input">The NumericInput Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/numeric_input/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <NumericInput
 *   id="numeric-input"
 *   v-bind:key="componentKey"
 *   data-cy="numeric-input"
 *   invalidFeedbackText="Invalid Number."
 *   label="Numeric Input"
 *   v-bind:required="this.required"
 *   v-bind:decimalPlaces="this.decimalPlaces"
 *   v-bind:incDecValues="this.incDecValues"
 *   v-bind:maxValue="this.maxValue"
 *   v-bind:minValue="this.minValue"
 *   v-model:value="form.value"
 *   v-bind:showValidityStyling="validity.showStyling"
 *   v-on:valid="
 *     (valid) => {
 *       validity.value = valid;
 *     }
 *   "
 *   v-on:ready="createdCount++"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name             | Description
 * ---------------------------| -----------
 * `numeric-group`            | the `BFormGroup` component containing the numeric input.
 * `numeric-input`            | the `BFormInput` component used to read the numeric input.
 * `numeric-label`            | the `span` component containing the label.
 * `numeric-required`         | the `*` that appears in the label if the input is required.
 * `numeric-decrease-sm`      | the `BButton` component for the small decrease (if present).
 * `numeric-decrease-md`      | the `BButton` component for the medium decrease (if present).
 * `numeric-decrease-lg`      | the `BButton` component for the large decrease (if present).
 * `numeric-increase-sm`      | the `BButton` component for the small increase (if present).
 * `numeric-increase-md`      | the `BButton` component for the medium increase (if present).
 * `numeric-increase-lg`      | the `BButton` component for the large increase (if present).
 * `numeric-invalid-feedback` | the `BFormInvalidFeedback` component used to display feedback if the input is not valid.
 */
export default {
  name: 'NumericInput',
  components: { BButton },
  emits: ['ready', 'update:value', 'valid'],
  props: {
    /**
     * The number of decimal places that the input should round to.
     */
    decimalPlaces: {
      type: Number,
      default: 0,
    },
    /**
     * The values for the small [0], medium [1], and large [2] increase/decrease buttons.
     * For example use: [1, 10] to have buttons that increase/decrease by 1 or 10.
     *
     * If this prop is not set, then the buttons will not be displayed.
     * If the prop is set, an increase and a decrease button will display for each of up to three values in the array.
     */
    incDecValues: {
      type: Array,
      default: null,
    },
    /**
     * The maximum value that the input can be set to.
     */
    maxValue: {
      type: Number,
      default: Infinity,
    },
    /**
     * The minimum value that the input can be set to.
     */
    minValue: {
      type: Number,
      default: 0,
    },
    /**
     * The label for the input element.
     */
    label: {
      type: String,
      required: true,
    },
    /**
     * Whether a value for the numeric input is required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /*
     * The text to display when the input is invalid.
     */
    invalidFeedbackText: {
      type: String,
      required: true,
    },
    /**
     * Whether validity styling should appear on numeric input
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
    /**
     * The value to display in the numeric input.
     *
     * This prop is watched and changes are relayed to the component's internal state.
     */
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      valueAsString: this.formatter(this.value.toString()),
      numericValue: this.value,
      /*
       * Needed so when initial value is changed the updated value can be replaced or updated
       */
      initialValueChanged: false,

      /*
       * This value is used in the "Key-Changing Technique" to force the input to
       * refresh its value. This is necessary when for example, the input is currently
       * 1.75 and the users types 7.75234.  The value of the `valueAsString` variable
       * will still be 1.75 and thus an update of the input will not be triggered.
       *
       * The "Key-Changing Technique" is explained here:
       * https://michaelnthiessen.com/force-re-render
       */
      inputRefreshKey: 0,
    };
  },
  computed: {
    showSmallIncDec() {
      return this.incDecValues != null && this.incDecValues.length > 0;
    },
    showMediumIncDec() {
      return this.incDecValues != null && this.incDecValues.length > 1;
    },
    showLargeIncDec() {
      return this.incDecValues != null && this.incDecValues.length > 2;
    },
    isEmpty() {
      return this.valueAsString == null || this.valueAsString.length == 0;
    },
    disableSmallDec() {
      return this.numericValue - this.incDecValues[0] < this.minValue;
    },
    disableMediumDec() {
      return this.numericValue - this.incDecValues[1] < this.minValue;
    },
    disableLargeDec() {
      return this.numericValue - this.incDecValues[2] < this.minValue;
    },
    disableSmallInc() {
      return this.numericValue + this.incDecValues[0] > this.maxValue;
    },
    disableMediumInc() {
      return this.numericValue + this.incDecValues[1] > this.maxValue;
    },
    disableLargeInc() {
      return this.numericValue + this.incDecValues[2] > this.maxValue;
    },
    isValid() {
      if (!this.required) {
        return (
          this.isEmpty ||
          (!isNaN(parseFloat(this.valueAsString)) &&
            parseFloat(this.valueAsString) >= this.minValue &&
            parseFloat(this.valueAsString) <= this.maxValue)
        );
      } else {
        return (
          !this.isEmpty &&
          !isNaN(parseFloat(this.valueAsString)) &&
          parseFloat(this.valueAsString) >= this.minValue &&
          parseFloat(this.valueAsString) <= this.maxValue
        );
      }
    },
    validityStyling() {
      if (this.showValidityStyling) {
        return this.isValid;
      } else {
        return null;
      }
    },
  },
  methods: {
    adjustValue(amount) {
      if (this.isValid) {
        if (!this.initialValueChanged && amount > this.numericValue) {
          this.valueAsString = this.formatter(amount);
          this.initialValueChanged = true;
        } else {
          this.valueAsString = this.formatter(
            parseFloat(this.valueAsString) + amount
          );
          this.initialValueChanged = true;
        }
      } else {
        this.valueAsString = this.formatter(this.minValue);
      }
    },
    formatter(value) {
      let val = parseFloat(value);
      let formattedVal;

      if (value == 'NaN') {
        formattedVal = '';
      } else if (isNaN(val)) {
        formattedVal = value;
      } else if (val < this.minValue) {
        formattedVal = this.minValue.toFixed(this.decimalPlaces);
      } else if (val > this.maxValue) {
        formattedVal = this.maxValue.toFixed(this.decimalPlaces);
      } else {
        formattedVal = val.toFixed(this.decimalPlaces);
      }

      /*
       * Do this in a timeout so that the formattedVal will be placed
       * into the input component before it is refreshed.
       */
      setTimeout(() => {
        this.inputRefreshKey++;
      }, 5);

      return formattedVal;
    },
    valueChanged() {
      /*
       * Update the initialValueChanged data when the user manually enters a value.
       */
      this.initialValueChanged = true;
    },
  },
  watch: {
    isValid() {
      /**
       * The validity of the numeric value has changed.  Also emitted when the component is created.
       * @property {Boolean} valid `true` if the numeric value is valid; `false` if it is invalid.
       */
      this.$emit('valid', this.isValid);
    },
    value() {
      if (!isNaN(this.value)) {
        this.valueAsString = this.formatter(this.value);
      }
    },
    valueAsString() {
      /**
       * The numeric value has changed.
       * @property {Number} value The new numeric value or NaN if the value is invalid.
       */
      this.$emit('update:value', parseFloat(this.valueAsString));
      this.numericValue = parseFloat(this.valueAsString);
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
