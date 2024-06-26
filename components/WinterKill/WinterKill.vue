<template>
  <BFormGroup
    id="winter-kill-group"
    data-cy="winter-kill-group"
    label-for="winter-kill-checkbox"
    label-cols="auto"
    label-align="end"
    :state="componentIsValid"
  >
    <template v-slot:label>
      <span data-cy="winter-kill-label">Winter kill:</span>
    </template>

    <div class="grid">
      <BFormCheckbox
        id="winter-kill-checkbox"
        data-cy="winter-kill-checkbox"
        v-model="selectedCheckbox"
        v-on:change="handleCheckboxChange"
        size="lg"
      />
      <div v-if="selectedCheckbox">
        <div
          id="winter-kill-date-group"
          data-cy="winter-kill-date-group"
          v-bind:class="{ 'full-width': !required }"
        >
          <sup
            id="winter-kill-date-required"
            data-cy="winter-kill-date-required"
            v-if="required"
            class="text-danger"
            >*</sup
          >
          <BFormInput
            id="winter-kill-date-input"
            data-cy="winter-kill-date-input"
            type="date"
            v-model="chosenDate"
            v-bind:state="validityStyling"
            v-bind:required="selectedCheckbox && required"
          />
          <BFormInvalidFeedback
            id="winter-kill-date-invalid-feedback"
            data-cy="winter-kill-date-invalid-feedback"
            v-if="showInvalidFeedback"
          >
            A valid estimated kill date is required.
          </BFormInvalidFeedback>
        </div>
      </div>
    </div>
  </BFormGroup>
</template>

<script>
import dayjs from 'dayjs';

/**
 * The WinterKill component provides a UI element for specifying if a crop seeding will be winter killed.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/winter_kill">The WinterKill Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/winter_kill/App.vue">App.vue</a>
 * ## Usage Example
 *
 * ```html
 * <WinterKill
 *   id="winter-kill-example"
 *   data-cy="winter-kill-example"
 *   v-bind:picked="picked"
 *   v-bind:date="date"
 *   v-bind:required="required"
 *   v-bind:showValidityStyling="validity.showStyling"
 *   v-on:update:picked="handleUpdateCheckboxState"
 *   v-on:update:date="handleUpdateDate"
 *   v-on:valid="handleValid"
 *   v-on:ready="createdCount++"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name                      | Description
 * ------------------------------------| -----------
 * winter-kill-group                   | The `BFormGroup` component containing the winter kill checkbox and date input fields.
 * winter-kill-label                   | The `span` component containing the "Winter kill:" label.
 * winter-kill-checkbox                | The `BFormCheckbox` component used to indicate if the crop will be winter killed.
 * winter-kill-date-group              | The `div` component containing the date input field and its associated elements (e.g., required asterisk, invalid feedback).
 * winter-kill-date-required           | The `sup` element that displays a red asterisk if the date input is required.
 * winter-kill-date-input              | The `BFormInput` component used to select a date.
 * winter-kill-date-invalid-feedback   | The `BFormInvalidFeedback` component that displays an error message when the date is invalid.
 */
export default {
  name: 'WinterKill',
  emits: ['ready', 'valid', 'update:picked', 'update:date'],
  props: {
    /**
     * The state of the checkbox indicating if the crop will be winter killed.
     * @type {Boolean}
     * @default false
     */
    picked: {
      type: Boolean,
      default: false,
    },
    /**
     * The selected date for winter kill.
     * @type {String}
     * @default ''
     */
    date: {
      type: String,
      default: '',
    },
    /**
     * Whether a date selection is required or not.
     * @type {Boolean}
     * @default false
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether validity styling should appear on input elements.
     * @type {Boolean}
     * @default false
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedCheckbox: this.picked,
      chosenDate: this.date,
    };
  },
  computed: {
    /**
     * Determines if the chosen date is empty or invalid.
     * @returns {Boolean}
     */
    isEmpty() {
      return (
        this.chosenDate === '' ||
        this.chosenDate === 'Invalid Date' ||
        this.chosenDate === null
      );
    },
    /**
     * Determines if the date input is valid based on the chosen date.
     * @returns {Boolean}
     */
    isValid() {
      return dayjs(this.chosenDate).isValid();
    },
    /**
     * Controls component styling for validity (i.e., when green check or red X should be displayed).
     * @returns {Boolean|null}
     */
    validityStyling() {
      if (this.showValidityStyling) {
        if (!this.required && this.isEmpty) {
          return null;
        } else {
          return this.isValid;
        }
      } else {
        return null;
      }
    },
    /**
     * Determines whether to show the invalid feedback.
     * @returns {Boolean}
     */
    showInvalidFeedback() {
      return this.required && !this.isValid;
    },
    /**
     * Determines if the entire component is valid.
     * @returns {Boolean}
     */
    componentIsValid() {
      if (!this.selectedCheckbox) {
        return true;
      } else if (this.required) {
        return this.isValid;
      } else {
        return true;
      }
    },
  },
  methods: {
    // Handles changes to the checkbox state and updates the date if the checkbox is selected.
    handleCheckboxChange(event) {
      const isChecked = event.target ? event.target.checked : event;
      this.selectedCheckbox = isChecked;
      /**
       * The state of the checkbox changed.
       * @property {boolean} event whether the checkbox is checked or not.
       */
      this.$emit('update:picked', isChecked);

      if (isChecked && !this.chosenDate) {
        const nextYear = new Date().getFullYear() + 1;
        const defaultDate = dayjs(new Date(nextYear, 0, 1)).format(
          'YYYY-MM-DD'
        );
        this.chosenDate = defaultDate;
        this.$emit('update:date', defaultDate);
      } else if (!isChecked) {
        this.chosenDate = '';
        this.$emit('update:date', '');
      }
      this.emitValidState();
    },
    // Emits the valid state of the component.
    emitValidState() {
      /**
       * The validity of the component changed.
       * @property {boolean} event whether the component is valid or not.
       */
      this.$emit('valid', this.componentIsValid);
    },
  },
  watch: {
    /**
     * Watches for changes in the valid state and emits the new valid state.
     */
    componentIsValid() {
      this.$emit('valid', this.componentIsValid);
    },
    /**
     * Watches for changes in the chosen date and emits the updated date.
     */
    chosenDate() {
      /**
       * The selected date for winter kill changed.
       * @property {string} event the new date value.
       */
      this.$emit('update:date', this.chosenDate);
    },
    /**
     * Watches for changes in the date prop and updates the chosen date.
     */
    date() {
      this.chosenDate = this.date;
    },
    /**
     * Watches for changes in the picked prop and updates the selectedCheckbox state.
     */
    picked() {
      this.selectedCheckbox = this.picked;
    },
  },
  created() {
    // Emit the initial valid state of the component's value.
    this.emitValidState();
    this.$emit('ready');
  },
};
</script>

<style scoped>
.grid,
#winter-kill-date-group {
  display: grid;
  grid-template-columns: min-content 1fr;
}

#winter-kill-date-group {
  gap: 0.35rem;
}

#winter-kill-date-group.full-width {
  grid-template-columns: 1fr;
}

.form-control-lg {
  padding-top: 0 !important;
  padding-right: 0.5rem;
  margin-top: 0.25rem;
}

#winter-kill-date-invalid-feedback {
  grid-column: 2/3;
}

label {
  padding: 0;
}
</style>
