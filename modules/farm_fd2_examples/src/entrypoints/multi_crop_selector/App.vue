<template>
  <h3>MultiCropSelector Example</h3>
  <p>
    The MultiCropSelector component allows the user to select multiple crops
    multiple dropdowns.
  </p>

  <hr />
  <MultiCropSelector
    id="multi-crop-selector"
    data-cy="multi-crop-selector"
    invalid-feedback-text="Selection cannot be empty."
    v-bind:required="required"
    v-bind:showValidityStyling="validity.showStyling"
    v-bind:selected="form.selected"
    v-on:valid="
      (valid) => {
        validity.selected = valid;
      }
    "
    v-on:ready="createdCount++"
    v-on:error="(msg) => showErrorToast('Network Error', msg)"
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
        <td>selected</td>
        <td>
          <BButton
            id="select-button"
            data-cy="select-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.selected.push('ARUGULA')"
          >
            Select Arugula
          </BButton>
          <BButton
            id="remove-button"
            data-cy="remove-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.selected.pop()"
          >
            Remove Last
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
        <td>update:selected</td>
        <td>{{ form.selected }}</td>
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
import MultiCropSelector from '@comps/MultiCropSelector/MultiCropSelector.vue';

export default {
  components: {
    MultiCropSelector,
  },
  data() {
    return {
      required: true,
      form: {
        selected: [],
      },
      validity: {
        showStyling: false,
        selected: false,
      },
      createdCount: 0,
    };
  },
  methods: {},
  watch: {},
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
selector-base-hack {
  display: none;
}
</style>
