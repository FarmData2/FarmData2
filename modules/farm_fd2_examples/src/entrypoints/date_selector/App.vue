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
    v-on:valid="
      (valid) => {
        validity.date = valid;
      }
    "
    v-on:ready="createdCount++"
  />
  <hr />

  <h5>Component Props:</h5>
  <table>
    <thead>
      <th>Prop</th>
      <th>Control</th>
    </thead>
    <tbody>
      <tr>
        <td>required</td>
        <td>
          <BFormCheckbox
            id="required-checkbox"
            data-cy="required-checkbox"
            switch
            v-model="required"
          />
        </td>
      </tr>
      <tr>
        <td>showValidityStyling</td>
        <td>
          <BFormCheckbox
            id="styling-checkbox"
            data-cy="styling-checkbox"
            switch
            v-model="validity.showStyling"
          />
        </td>
      </tr>
      <tr>
        <td>date</td>
        <td>
          <BButton
            id="set-date-button"
            data-cy="set-date-button"
            variant="outline-primary"
            size="sm"
            v-on:click="nextDay"
          >
            Next
          </BButton>
        </td>
      </tr>
    </tbody>
  </table>

  <h5>Component Event Payloads</h5>
  <table>
    <thead>
      <th>Event</th>
      <th>Payload</th>
    </thead>
    <tbody>
      <tr>
        <td>date</td>
        <td>{{ form.date }}</td>
      </tr>
      <tr>
        <td>valid</td>
        <td>{{ validity.date }}</td>
      </tr>
    </tbody>
  </table>

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

<style scoped>
@import url('@css/fd2-examples.css');
</style>
