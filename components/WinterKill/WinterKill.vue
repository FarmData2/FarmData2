<template>
  <BFormGroup
    id="winter-kill-group"
    data-cy="winter-kill-group"
    label-for="winter-kill-checkbox"
    label-cols="auto"
    label-align="end"
  >
    <template v-slot:label>
      <span data-cy="winter-kill-label">Winter kill:</span>
    </template>

    <div class="grid">
      <BFormCheckbox
        id="winter-kill-checkbox"
        v-bind:checked="checkboxState"
        v-on:change="handleCheckboxChange"
        data-cy="winter-kill-checkbox"
        size="lg"
      />
      <div v-if="checkboxState">
        <div
          id="winter-kill-date-group"
          data-cy="winter-kill-date-group"
          v-bind:class="{ 'full-width': !required }"
        >
          <sup
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
            v-bind:required="checkboxState && required"
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
 *   v-bind:checkboxState="checkboxState"
 *   v-bind:date="date"
 *   v-bind:required="required"
 *   v-bind:showValidityStyling="validity.showStyling"
 *   v-on:update:checkboxState="handleUpdateCheckboxState"
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
 * winter-kill-date-group              | The `div` component containing the date input fields when the checkbox is selected.
 * winter-kill-date-required           | The `sup` element that displays a red asterisk if the date input is required.
 * winter-kill-date-input              | The `BFormInput` component used to select a date.
 * winter-kill-date-invalid-feedback   | The `BFormInvalidFeedback` component that displays an error message when the date is invalid.
 */
export default {
  name: 'WinterKill',
  emits: ['ready', 'valid', 'update:checkboxState', 'update:date'],
  props: {
    /**
     * The state of the checkbox indicating if the crop will be winter killed.
     * @type {Boolean}
     * @default false
     */
    checkboxState: {
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
      if (!this.checkboxState) {
        return true;
      }
      if (this.required) {
        return this.isValid;
      }
      return true;
    },
  },
  methods: {
    /**
     * Handles changes to the checkbox state and updates the date if the checkbox is selected.
     * @param {Event} event
     */
    handleCheckboxChange(event) {
      const isChecked = event.target ? event.target.checked : event;
      this.$emit('update:checkboxState', isChecked);

      if (isChecked && !this.date) {
        const nextYear = new Date().getFullYear() + 1;
        const defaultDate = dayjs(new Date(nextYear, 0, 1)).format(
          'YYYY-MM-DD'
        );
        this.$emit('update:date', defaultDate);
      }

      this.emitValidState();
    },
    /**
     * Emits the valid state of the component.
     */
    emitValidState() {
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
      this.$emit('update:date', this.chosenDate);
      this.emitValidState();
    },
    /**
     * Watches for changes in the date prop and updates the chosen date.
     */
    date() {
      this.chosenDate = this.date;
    },
  },
  created() {
    // Emit the initial valid state of the component's value.
    this.emitValidState();

    /**
     * The component is ready for use.
     */
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

.grid {
  gap: 1rem;
}

#winter-kill-date-group {
  gap: 0.35rem;
}

#winter-kill-date-group.full-width {
  grid-template-columns: 1fr;
}

.form-control-lg {
  padding-top: 0 !important;
  margin-top: 0.25rem;
}

#winter-kill-date-invalid-feedback {
  grid-column: 2/3;
}
</style>
