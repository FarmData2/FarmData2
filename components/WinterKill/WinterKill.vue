<template>
  <BFormGroup
    id="winter-kill-group"
    data-cy="winter-kill-group"
  >
    <BFormCheckbox
      :checked="checkboxState"
      @change="handleCheckboxChange"
      data-cy="winter-kill-checkbox"
    >
      Winter kill
    </BFormCheckbox>
    <DateSelector
      v-if="checkboxState"
      :date="date"
      :state="validityStyling"
      :required="required"
      :showValidityStyling="showValidityStyling"
      @update:date="handleDateChange"
      data-cy="winter-kill-date"
    />
  </BFormGroup>
</template>

<script>
import DateSelector from '@comps/DateSelector/DateSelector.vue';
import dayjs from 'dayjs';

/**
 * A new component.
 *
 * ## Usage Example
 *
 * ```html
 * <WinterKill :checkboxState="true" :date="initialDate" />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * `winter-kill-checkbox`| identify checkbox element
 * `winter-kill-date`    | identify DateSelector element
 */
export default {
  name: 'WinterKill',
  components: {
    DateSelector,
  },
  emits: ['ready', 'valid', 'update:checkboxState', 'update:date'],
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
    checkboxState: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      default: () => {
        const nextYear = new Date().getFullYear() + 1;
        return dayjs(new Date(nextYear, 0, 1)).format('YYYY-MM-DD');
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    isValid() {
      if (this.required && !this.checkboxState) {
        return false;
      }
      return true;
    },
    validityStyling() {
      return this.showValidityStyling ? this.isValid : null;
    },
  },
  methods: {
    handleCheckboxChange(event) {
      const isChecked = event.target.checked;
      this.$emit('update:checkboxState', isChecked);
      this.emitValidState();
    },
    handleDateChange(newDate) {
      this.$emit('update:date', newDate);
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
    this.$emit('valid', this.isValid);
    this.$emit('ready');
  },
};
</script>

<style scoped>
/* Add any necessary styling here */
</style>
