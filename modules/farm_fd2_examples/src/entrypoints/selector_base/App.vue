<template>
  <h3>SelectorBase Example</h3>
  <p>
    SelectorBase is a component that allows the user to pick an item from a drop
    down list.
  </p>

  <hr />
  <SelectorBase
    id="selector"
    data-cy="selector"
    label="Select"
    invalid-feedback-text="Selection cannot be empty."
    v-bind:required="required"
    v-bind:showValidityStyling="validity.showStyling"
    v-bind:options="options"
    v-on:add-clicked="handleAddClicked"
    v-model:selected="form.selected"
    v-on:valid="(valid) => (validity.selected = valid)"
    v-on:ready="createdCount++"
    v-bind:popupUrl="popupUrl"
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
        <td>PopupUrl</td>
        <td>
          <BButton
            id="popup-url-button"
            data-cy="popup-url-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.popupUrl = 'date_selector'"
            :disabled="this.popupUrl != null"
          >
            DateSelector URL
          </BButton>
          <BButton
            id="popup-clear-url-button"
            data-cy="popup-clear-url-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.popupUrl = null"
            :disabled="this.popupUrl == null"
          >
            Clear Url
          </BButton>
        </td>
      </tr>
      <tr>
        <td>selected</td>
        <td>
          <BButton
            id="select-first-button"
            data-cy="select-first-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.selected = 'one'"
          >
            Select first option
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
        <td>update:selected</td>
        <td>{{ form.selected }}</td>
      </tr>
      <tr>
        <td>valid</td>
        <td>{{ validity.selected }}</td>
      </tr>
      <tr>
        <td>add-clicked</td>
        <td>{{ addClicked }}</td>
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
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';

export default {
  components: {
    SelectorBase,
  },
  data() {
    return {
      required: true,
      showAllButton: true,
      popupUrl: null,
      options: ['one', 'two', 'three', 'four', 'five'],
      form: {
        selected: null,
      },
      validity: {
        showStyling: false,
        selected: false,
      },
      createdCount: 0,
      addClicked: false,
    };
  },
  methods: {
    handleAddClicked() {
      this.addClicked = 'empty payload';
    },
  },
  watch: {
    includeAddButton(newValue) {
      if (!newValue) {
        this.addClicked = false;
      }
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
selector-base-hack {
  display: none;
}
</style>
