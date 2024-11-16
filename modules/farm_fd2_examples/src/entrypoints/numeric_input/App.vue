<template>
  <h3>NumericInput Example</h3>
  <p data-cy="description">
    The NumericInput component allows the user to input a numeric value.
  </p>

  <hr />
  <NumericInput
    id="numeric-input"
    data-cy="numeric-input"
    invalidFeedbackText="Invalid Number."
    label="Numeric Input"
    v-bind:required="this.required"
    v-bind:decimalPlaces="this.decimalPlaces"
    v-bind:incDecValues="this.incDecValues"
    v-bind:maxValue="this.maxValue"
    v-bind:minValue="this.minValue"
    v-model:value="form.value"
    v-bind:showValidityStyling="validity.showStyling"
    v-on:valid="
      (valid) => {
        validity.value = valid;
      }
    "
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
        <td>decimalPlaces</td>
        <td>
          <BButton
            v-for="i in [0, 1, 2]"
            v-bind:key="i"
            v-bind:id="`decimal-places-button-${i}`"
            v-bind:data-cy="`decimal-places-button-${i}`"
            variant="outline-primary"
            size="sm"
            v-on:click="updateDecimalPlaces(i)"
            v-bind:disabled="decimalPlaces === i"
          >
            {{ i }}
          </BButton>
        </td>
      </tr>
      <tr>
        <td>incDecValues</td>
        <td>
          <BButton
            v-if="this.incDecValues.length == 3"
            id="remove-increment-button"
            data-cy="remove-increment-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.incDecValues = []"
          >
            Remove Increment Buttons
          </BButton>
          <BButton
            id="add-increment-button"
            data-cy="add-increment-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.incDecValues.push(10 ** incDecValues.length)"
            v-if="this.incDecValues.length < 3"
          >
            Add Increment Button
          </BButton>
        </td>
      </tr>
      <tr>
        <td>minValue: {{ this.minValue }}</td>
        <td>
          <BButton
            id="min-value-decrease-lg"
            data-cy="min-value-decrease-lg"
            variant="outline-primary"
            size="sm"
            v-on:click="
              () => {
                this.minValue -= 100;
              }
            "
            v-bind:disabled="this.minValue - 100 < -1000"
          >
            -100
          </BButton>
          <BButton
            id="min-value-decrease"
            data-cy="min-value-decrease"
            variant="outline-primary"
            size="sm"
            v-on:click="
              () => {
                this.minValue -= 10;
              }
            "
            v-bind:disabled="this.minValue - 10 < -1000"
          >
            -10
          </BButton>
          <BButton
            id="min-value-increase"
            data-cy="min-value-increase"
            variant="outline-primary"
            size="sm"
            v-on:click="
              () => {
                this.minValue += 10;
              }
            "
            v-bind:disabled="this.minValue + 10 >= this.maxValue"
          >
            +10
          </BButton>
          <BButton
            id="min-value-increase-lg"
            data-cy="min-value-increase-lg"
            variant="outline-primary"
            size="sm"
            v-on:click="
              () => {
                this.minValue += 100;
              }
            "
            v-bind:disabled="this.minValue + 100 >= this.maxValue"
          >
            +100
          </BButton>
        </td>
      </tr>
      <tr>
        <td>maxValue: {{ this.maxValue }}</td>
        <td>
          <BButton
            id="max-value-decrease-lg"
            data-cy="max-value-decrease-lg"
            variant="outline-primary"
            size="sm"
            v-on:click="
              () => {
                this.maxValue -= 100;
              }
            "
            v-bind:disabled="this.maxValue - 100 <= this.minValue"
          >
            -100
          </BButton>
          <BButton
            id="max-value-decrease"
            data-cy="max-value-decrease"
            variant="outline-primary"
            size="sm"
            v-on:click="
              () => {
                this.maxValue -= 10;
              }
            "
            v-bind:disabled="this.maxValue - 10 <= this.minValue"
          >
            -10
          </BButton>
          <BButton
            id="max-value-increase"
            data-cy="max-value-increase"
            variant="outline-primary"
            size="sm"
            v-on:click="
              () => {
                this.maxValue += 10;
              }
            "
            v-bind:disabled="this.maxValue + 10 > 1000"
          >
            +10
          </BButton>
          <BButton
            id="max-value-increase-lg"
            data-cy="max-value-increase-lg"
            variant="outline-primary"
            size="sm"
            v-on:click="
              () => {
                this.maxValue += 100;
              }
            "
            v-bind:disabled="this.maxValue + 100 > 1000"
          >
            +100
          </BButton>
        </td>
      </tr>
      <tr>
        <td>value</td>
        <td>
          <BButton
            v-for="i in [10, 100, 1000]"
            v-bind:key="i"
            v-bind:id="`value-button-${i}`"
            v-bind:data-cy="`value-button-${i}`"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.value = i"
            v-bind:disabled="i > this.maxValue || i < this.minValue"
          >
            {{ i }}
          </BButton>
        </td>
      </tr>
    </tbody>
  </table>

  <h5>Component Event Payloads</h5>
  <table class="example-table">
    <thead>
      <tr>
        <th>Event</th>
        <th>Payload</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>update:value</td>
        <td>{{ form.value }}</td>
      </tr>
      <tr>
        <td>valid</td>
        <td>{{ validity.value }}</td>
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
import NumericInput from '@comps/NumericInput/NumericInput.vue';
import { BButton } from 'bootstrap-vue-next';

export default {
  components: {
    NumericInput,
    BButton,
  },
  data() {
    return {
      required: true,
      decimalPlaces: 0,
      incDecValues: [1, 10, 100],
      maxValue: 1000,
      minValue: 0,
      form: {
        /*
         * Use a non-zero value here so that the button rounding
         * effects can be observed.
         */
        value: 3,
      },
      validity: {
        showStyling: false,
        value: true,
      },
      createdCount: 0,
    };
  },
  methods: {
    updateDecimalPlaces(value) {
      this.decimalPlaces = value;
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

<style>
@import url('@css/fd2-examples.css');
@import url('@css/fd2-mobile.css');

/**
 * This ensures that the css for this file is picked up by the builder.
 * Not sure why this is necessary, but without it the css imports
 * above are not processed.
 */
numeric-input-hack {
  display: none;
}
</style>
