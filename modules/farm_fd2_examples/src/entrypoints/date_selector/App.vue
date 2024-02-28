<template>
  <p data-cy="description">
    The DateSelector allows the user to select a date.
  </p>

  <hr />

  <DateSelector
    id="date-selector"
    data-cy="date-selector"
    v-bind:required="required"
    v-model:date="form.date"
    v-bind:showValidityStyling="validity.showStyling"
    v-on:valid="(valid) => (validity.date = valid)"
    v-on:ready="createdCount++"
  />

  <hr />

  <strong>Component Props:</strong>
  <UL>
    <li>
      <BFormCheckbox
        id="required-checkbox"
        data-cy="required-checkbox"
        v-model="required"
        >required</BFormCheckbox
      >
    </li>
    <LI>
      <BFormCheckbox
        id="styling-checkbox"
        data-cy="styling-checkbox"
        v-model="validity.showStyling"
        >showValidityStyling</BFormCheckbox
      ></LI
    >
  </UL>

  <strong>Component State:</strong>
  <UL>
    <li>date: {{ form.date }}</li>
    <LI>valid: {{ validity.date }}</LI>
  </UL>

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
import DateSelector from '@comps/DateSelector/DateSelector.vue';
import dayjs from 'dayjs';

export default {
  components: {
    DateSelector,
  },
  data() {
    return {
      required: true,
      form: {
        date: dayjs().format('YYYY-MM-DD'),
      },
      validity: {
        showStyling: false,
        date: true,
      },
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>
