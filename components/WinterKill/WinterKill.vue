<template>
  <div>
    <BFormGroup
      id="winter-kill-group"
      data-cy="winter-kill-group"
      label-for="winter-kill-checkbox"
      label-cols="auto"
      label-align="end"
      class="align-items-center"
    >
      <template v-slot:label>
        <span data-cy="winter-kill-label">Winter kill:</span>
        <sup
          data-cy="winter-kill-required"
          v-if="required"
          class="text-danger"
          >*</sup
        >
      </template>

      <div>
        <BFormCheckbox
          id="winter-kill-checkbox"
          :checked="checkboxState"
          @change="handleCheckboxChange"
          data-cy="winter-kill-checkbox"
          :state="checkboxValidityStyling"
          :required="required"
        />
      </div>
    </BFormGroup>
    <div
      v-if="!checkboxState && required"
      class="mt-1"
    >
      <BFormInvalidFeedback
        id="winter-kill-checkbox-invalid-feedback"
        data-cy="winter-kill-checkbox-invalid-feedback"
        :state="checkboxValidityStyling"
      >
        Winter Kill is required for this crop.
      </BFormInvalidFeedback>
    </div>
    <div
      v-if="checkboxState"
      class="mt-2"
    >
      <DateSelector
        label="Winter Kill Date"
        :date="date"
        :state="validityStyling"
        :required="checkboxState"
        :showValidityStyling="showValidityStyling"
        @update:date="handleDateChange"
        @valid="handleDateValid"
        data-cy="winter-kill-date"
      />
    </div>
  </div>
</template>

<script>
import DateSelector from '@comps/DateSelector/DateSelector.vue';
import dayjs from 'dayjs';

/**
 * The WinterKill component provides a UI element for specifying if a cover crop seeding will be winter killed.
 *
 * ## Usage Example
 *
 * ```html
 * <WinterKill
 *   id="winter-kill-example"
 *   data-cy="winter-kill-example"
 *   :checkboxState="checkboxState"
 *   :date="date"
 *   :required="required"
 *   :showValidityStyling="showValidityStyling"
 *   @update:checkboxState="handleUpdateCheckboxState"
 *   @update:date="handleUpdateDate"
 *   @valid="handleValid"
 *   @ready="createdCount++"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name                             | Description
 * -------------------------------------------| -----------
 * `winter-kill-group`                        | The `BFormGroup` component containing this component.
 * `winter-kill-label`                        | The `span` component containing the "Winter kill:" label.
 * `winter-kill-required`                     | The `*` that appears in the label if the input is required.
 * `winter-kill-checkbox`                     | The `BFormCheckbox` component used to select if the crop will be winter killed.
 * `winter-kill-checkbox-invalid-feedback`    | The `BFormInvalidFeedback` component that displays help when the checkbox is required but not checked.
 * `winter-kill-date`                         | The `DateSelector` component used to select the winter kill date.
 */
export default {
  name: 'WinterKill',
  components: {
    DateSelector,
  },
  emits: ['ready', 'valid', 'update:checkboxState', 'update:date'],
  props: {
    /**
     * Whether a value for the input element is required or not.
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
    /**
     * The state of the checkbox indicating if the crop will be winter killed.
     */
    checkboxState: {
      type: Boolean,
      default: false,
    },
    /**
     * The selected date for winter kill.
     */
    date: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dateValid: true,
    };
  },
  computed: {
    isValid() {
      if (this.required && !this.checkboxState) {
        return false;
      }
      if (this.checkboxState && !this.dateValid) {
        return false;
      }
      return true;
    },
    validityStyling() {
      if (this.showValidityStyling) {
        return this.isValid;
      }
      return null;
    },
    checkboxValidityStyling() {
      if (this.showValidityStyling) {
        return this.required && !this.checkboxState ? false : null;
      }
      return null;
    },
  },
  methods: {
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
    handleDateChange(newDate) {
      this.$emit('update:date', newDate);
      this.emitValidState();
    },
    handleDateValid(valid) {
      this.dateValid = valid;
      this.emitValidState();
    },
    emitValidState() {
      this.$emit('valid', this.isValid);
    },
  },
  watch: {
    isValid() {
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
