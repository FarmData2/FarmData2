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
  <ul>
    <li>
      <BFormCheckbox
        id="required-checkbox"
        data-cy="required-checkbox"
        switch
        v-model="required"
      >
        required
      </BFormCheckbox>
    </li>
    <li>
      <BFormCheckbox
        id="styling-checkbox"
        data-cy="styling-checkbox"
        switch
        v-model="validity.showStyling"
      >
        showValidityStyling
      </BFormCheckbox>
    </li>
    <li>
      <BButton
        id="set-date-button"
        data-cy="set-date-button"
        variant="outline-primary"
        size="sm"
        v-on:click="nextDay"
      >
        Next
      </BButton>
      date
    </li>
  </ul>

  <strong>Component State:</strong>
  <ul>
    <li>date: {{ form.date }}</li>
    <li>valid: {{ validity.date }}</li>
  </ul>

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
import DateSelector from '@comps/DateSelector/DateSelector.vue';
import { BButton } from 'bootstrap-vue-next';
import dayjs from 'dayjs';

export default {
  components: {
    DateSelector,
    BButton,
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
  methods: {
    nextDay() {
      this.form.date = dayjs(this.form.date).add(1, 'day').format('YYYY-MM-DD');
    },
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
