<template>
  <h3>TraySizeSelector Example</h3>
  <p>
    TraySizeSelector is a component that allows the user to pick a tray size
    from a drop down list. It dynamically fetches its options.
  </p>

  <hr />
  <TraySizeSelector
    id="tray-size-selector"
    data-cy="tray-size-selector"
    label="Select Tray Size"
    invalid-feedback-text="Tray size selection cannot be empty."
    v-bind:required="required"
    v-bind:showValidityStyling="validity.showStyling"
    v-model:selected="form.selected"
    v-on:valid="(valid) => (validity.selected = valid)"
    v-on:ready="handleTraySizeSelectorReady"
    v-on:error="handleTraySizeSelectorError"
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
        <td>selected (v-model)</td>
        <td>
          <BButton
            id="select-first-available-button"
            data-cy="select-first-available-button"
            variant="outline-primary"
            size="sm"
            v-on:click="selectFirstAvailableOption"
            title="Selects the first non-disabled option fetched by TraySizeSelector. Will only work after 'ready' event."
            v-bind:disabled="!traySizeSelectorIsReady"
          >
            Select first available
          </BButton>
          <BButton
            id="clear-button"
            data-cy="clear-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.selected = null"
            v-bind:disabled="this.form.selected == null"
          >
            Clear
          </BButton>
          <small
            class="d-block mt-1"
            v-if="!traySizeSelectorIsReady && !traySizeSelectorError"
          >
            (Button disabled until TraySizeSelector is ready)
          </small>
        </td>
      </tr>
    </tbody>
  </table>

  <h5>Component Event Payloads / Status:</h5>
  <table class="example-table">
    <thead>
      <tr>
        <th>Event/Status</th>
        <th>Payload/Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>ready (from TraySizeSelector)</td>
        <td>{{ traySizeSelectorIsReady }}</td>
      </tr>
      <tr>
        <td>error (from TraySizeSelector)</td>
        <td v-bind:class="{ 'text-danger': traySizeSelectorError }">
          {{ traySizeSelectorError || 'null' }}
        </td>
      </tr>
      <tr>
        <td>update:selected</td>
        <td>{{ form.selected === null ? 'null' : form.selected }}</td>
      </tr>
      <tr>
        <td>valid</td>
        <td>{{ validity.selected }}</td>
      </tr>
    </tbody>
  </table>

  <div
    id="page-loaded"
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
import TraySizeSelector from '@comps/TraySizeSelector/TraySizeSelector.vue';

export default {
  name: 'TraySizeSelectorExamplePage',
  components: {
    TraySizeSelector,
  },
  data() {
    return {
      required: true,
      form: {
        selected: null,
      },
      validity: {
        showStyling: false,
        selected: false,
      },
      traySizeSelectorIsReady: false,
      traySizeSelectorError: null,
    };
  },
  methods: {
    handleTraySizeSelectorReady() {
      this.traySizeSelectorIsReady = true;
      this.traySizeSelectorError = null;
    },
    handleTraySizeSelectorError(errorMessage) {
      this.traySizeSelectorError = errorMessage;
      this.traySizeSelectorIsReady = false;
    },
    selectFirstAvailableOption() {
      if (this.traySizeSelectorIsReady) {
        this.form.selected = '72';
      }
    },
  },
  computed: {
    pageDoneLoading() {
      return this.traySizeSelectorIsReady || !!this.traySizeSelectorError;
    },
  },
  created() {},
};
</script>

<style>
@import url('@css/fd2-examples.css');
@import url('@css/fd2-mobile.css');

tray-size-selector-example-hack {
  display: none;
}
.text-danger {
  color: red;
}
</style>
