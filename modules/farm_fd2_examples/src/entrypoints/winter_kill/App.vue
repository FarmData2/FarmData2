<template>
  <div>
    <h3>WinterKill Example</h3>
    <p>
      The WinterKill component allows the user to specify if a crop will be
      winter killed.
    </p>

    <hr />
    <WinterKill
      id="winter-kill-example"
      data-cy="winter-kill-example"
      v-bind:picked="checkboxState"
      v-bind:date="date"
      v-bind:required="required"
      v-bind:showValidityStyling="validity.showStyling"
      v-on:update:picked="handleUpdateCheckboxState"
      v-on:update:date="handleUpdateDate"
      v-on:valid="handleValid"
      v-on:ready="createdCount++"
    />
    <hr />

    <h5>Component Props:</h5>
    <table class="example-table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Control</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Required for Date</td>
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
          <td>Show Validity Styling</td>
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
          <td>Checkbox State</td>
          <td>
            <BButton
              id="toggle-checkbox"
              data-cy="toggle-checkbox"
              v-on:click="toggleCheckbox"
              variant="outline-primary"
              size="sm"
            >
              Toggle Checkbox
            </BButton>
          </td>
        </tr>
        <tr>
          <td>Change Date</td>
          <td>
            <BButton
              id="next-date"
              data-cy="next-date"
              v-on:click="incrementDate"
              variant="outline-primary"
              size="sm"
            >
              Next Date
            </BButton>
          </td>
        </tr>
      </tbody>
    </table>

    <h5>Component Event Payloads:</h5>
    <table class="example-table">
      <thead>
        <tr>
          <th>Event</th>
          <th>Payload</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>checkboxState</td>
          <td>{{ checkboxState }}</td>
        </tr>
        <tr>
          <td>date</td>
          <td>{{ checkboxState ? date : 'N/A' }}</td>
        </tr>
        <tr>
          <td>valid</td>
          <td>{{ validity.isValid }}</td>
        </tr>
      </tbody>
    </table>

    <div
      data-cy="page-loaded"
      v-show="false"
    >
      {{ pageDoneLoading }}
    </div>
  </div>
</template>

<script>
import WinterKill from '@comps/WinterKill/WinterKill.vue';
import dayjs from 'dayjs';

export default {
  components: {
    WinterKill,
  },
  data() {
    return {
      required: true,
      checkboxState: false,
      date: '',
      validity: {
        showStyling: false,
        isValid: true,
      },
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
  },
  methods: {
    handleUpdateCheckboxState(newState) {
      this.checkboxState = newState;
      if (!newState) {
        this.date = '';
      } else if (!this.date) {
        const nextYear = new Date().getFullYear() + 1;
        this.date = dayjs(new Date(nextYear, 0, 1)).format('YYYY-MM-DD');
      }
      this.updateValidState();
    },
    handleUpdateDate(newDate) {
      this.date = newDate;
      this.updateValidState();
    },
    handleValid(valid) {
      this.validity.isValid = valid;
    },
    toggleCheckbox() {
      this.checkboxState = !this.checkboxState;
      if (!this.checkboxState) {
        this.date = '';
      } else if (!this.date) {
        const nextYear = new Date().getFullYear() + 1;
        this.date = dayjs(new Date(nextYear, 0, 1)).format('YYYY-MM-DD');
      }
      this.updateValidState();
    },
    incrementDate() {
      if (this.date) {
        this.date = dayjs(this.date).add(1, 'day').format('YYYY-MM-DD');
        this.updateValidState();
      }
    },
    updateValidState() {
      const isValid =
        !this.required || (this.checkboxState && dayjs(this.date).isValid());
      this.validity.isValid = isValid;
    },
  },
  created() {
    this.createdCount++;
    this.updateValidState();
  },
};
</script>

<style>
@import url('@css/fd2-examples.css');
@import url('@css/fd2-mobile.css');

/**
 * This ensures that the css for this file is picked up by the builder.
 * Not sure why this is necessary, but without it the css imports
 * above are not processed.
 */
winter-kill-hack {
  display: none;
}
</style>
