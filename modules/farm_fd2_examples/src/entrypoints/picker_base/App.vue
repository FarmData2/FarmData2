<template>
  <h3>PickerBase Example</h3>
  <p>
    PickerBase is a component that allows the user to pick multiple items using
    checkboxes.
  </p>

  <hr />
  <PickerBase
    id="bed-picker"
    data-cy="bed-picker"
    label="Options"
    invalid-feedback-text="At least one choice is required"
    v-bind:required="required"
    v-bind:showValidityStyling="validity.showStyling"
    v-bind:showAllButton="showAllButton"
    v-bind:options="options"
    v-model:picked="form.picked"
    v-on:valid="(valid) => (validity.picked = valid)"
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
        <td>showAllButton</td>
        <td>
          <BFormCheckbox
            id="show-all-button-checkbox"
            data-cy="show-all-button-checkbox"
            switch
            v-model="showAllButton"
          />
        </td>
      </tr>
      <tr>
        <td>picked</td>
        <td>
          <BButton
            id="set-picked-button"
            data-cy="set-picked-button"
            variant="outline-primary"
            size="sm"
            v-on:click="
              index = this.form.picked.indexOf('one');
              if (index > -1) {
                this.form.picked.splice(index, 1);
              } else {
                this.form.picked.push('one');
              }
            "
          >
            Toggle first option
          </BButton>
        </td>
      </tr>
      <tr>
        <td>options</td>
        <td>
          <BButton
            id="add-option-button"
            data-cy="add-option-button"
            variant="outline-primary"
            size="sm"
            v-on:click="
              index = this.options.indexOf('six');
              if (index > -1) {
                this.options.splice(index, 1);
              } else {
                this.options.push('six');
              }
            "
          >
            Toggle sixth option
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
        <td>update:picked</td>
        <td>{{ form.picked }}</td>
      </tr>
      <tr>
        <td>valid</td>
        <td>{{ validity.picked }}</td>
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
import PickerBase from '@comps/PickerBase/PickerBase.vue';

export default {
  components: {
    PickerBase,
  },
  data() {
    return {
      required: true,
      showAllButton: true,
      options: ['one', 'two', 'three', 'four', 'five'],
      form: {
        picked: ['one', 'two', 'three'],
      },
      validity: {
        showStyling: false,
        picked: true,
      },
      createdCount: 0,
    };
  },
  methods: {
    toggleFirstOption() {},
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
picker-base-hack {
  display: none;
}
</style>
