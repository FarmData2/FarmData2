<template>
  <h3>LocationSelector Example</h3>
  <p>
    LocationSelector is a component that allows the user to pick a location from
    a drop down list.
  </p>

  <hr />
  <LocationSelector
    id="location-selector"
    data-cy="location-selector"
    label="Location"
    invalid-feedback-text="Selection cannot be empty."
    v-bind:required="required"
    v-bind:showValidityStyling="validity.showStyling"
    v-bind:includeFields="includeFields"
    v-bind:includeGreenhouses="includeGreenhouses"
    v-bind:includeGreenhousesWithBeds="includeGreenhousesWithBeds"
    v-bind:allowBedSelection="allowBedSelection"
    v-bind:requireBedSelection="requireBedSelection"
    v-bind:selectAllBedsByDefault="selectAllBedsByDefault"
    v-model:selected="this.form.selected"
    v-model:pickedBeds="this.form.pickedBeds"
    v-on:update:beds="(beds) => (this.form.pickedBeds = beds)"
    v-on:valid="(valid) => (validity.selected = valid)"
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
        <td>includeFields</td>
        <td>
          <BFormCheckbox
            id="includeFields-checkbox"
            data-cy="includeFields-checkbox"
            switch
            v-model="includeFields"
          />
        </td>
      </tr>
      <tr>
        <td>includeGreenhouses</td>
        <td>
          <BFormCheckbox
            id="includeGreenhouses-checkbox"
            data-cy="includeGreenhouses-checkbox"
            switch
            v-model="includeGreenhouses"
            v-on:change="
              () => {
                if (includeGreenhouses) {
                  includeGreenhousesWithBeds = true;
                }
              }
            "
          />
        </td>
      </tr>
      <tr>
        <td>includeGreenhousesWithBeds</td>
        <td>
          <BFormCheckbox
            id="includeGreenhousesWithBeds-checkbox"
            data-cy="includeGreenhousesWithBeds-checkbox"
            switch
            v-model="includeGreenhousesWithBeds"
            v-bind:disabled="includeGreenhouses"
          />
        </td>
      </tr>
      <tr>
        <td>allowBedSelection</td>
        <td>
          <BFormCheckbox
            id="allowBedSelection-checkbox"
            data-cy="allowBedSelection-checkbox"
            switch
            v-model="allowBedSelection"
            v-on:change="
              () => {
                if (!allowBedSelection) {
                  form.pickedBeds = [];
                }
              }
            "
          />
        </td>
      </tr>
      <tr>
        <td>requireBedSelection</td>
        <td>
          <BFormCheckbox
            id="requireBedSelection-checkbox"
            data-cy="requireBedSelection-checkbox"
            switch
            v-model="requireBedSelection"
          />
        </td>
      </tr>
      <tr>
        <td>selectAllBedsByDefault</td>
        <td>
          <BFormCheckbox
            id="selectAllBedsByDefault-checkbox"
            data-cy="selectAllBedsByDefault-checkbox"
            switch
            v-model="selectAllBedsByDefault"
          />
        </td>
      </tr>
      <tr>
        <td>selected</td>
        <td>
          <BButton
            id="clear-selected-field-button"
            data-cy="clear-selected-field-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.selected = ''"
            v-bind:disabled="!includeFields || this.form.selected == ''"
          >
            None
          </BButton>
          <BButton
            id="select-field-button"
            data-cy="select-field-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.selected = 'A'"
            v-bind:disabled="!includeFields || this.form.selected == 'A'"
          >
            Field
          </BButton>
          <BButton
            id="select-field-beds-button"
            data-cy="select-field-beds-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.selected = 'ALF'"
            v-bind:disabled="!includeFields || this.form.selected == 'ALF'"
          >
            Field w/ Beds
          </BButton>
          <BButton
            id="select-greenhouse-button"
            data-cy="select-greenhouse-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.selected = 'JASMINE'"
            v-bind:disabled="
              !includeGreenhouses || this.form.selected == 'JASMINE'
            "
          >
            Greenhouse
          </BButton>
          <BButton
            id="select-greenhouse-beds-button"
            data-cy="select-greenhouse-beds-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.selected = 'CHUAU'"
            v-bind:disabled="
              (!includeGreenhouses && !includeGreenhousesWithBeds) ||
              this.form.selected == 'CHUAU'
            "
          >
            Greenhouse w/ Beds
          </BButton>
        </td>
      </tr>
      <tr>
        <td>pickedBeds</td>
        <td>
          <BButton
            id="select-bed-button"
            data-cy="select-bed-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.pickedBeds.push(this.form.selected + '-1')"
            v-bind:disabled="
              !['ALF', 'CHUAU', 'GHANA'].includes(this.form.selected) ||
              this.form.pickedBeds.includes(this.form.selected + '-1') ||
              !this.allowBedSelection
            "
          >
            Select Bed
          </BButton>
          <BButton
            id="clear-bed-button"
            data-cy="clear-bed-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.pickedBeds = []"
            v-bind:disabled="
              this.form.pickedBeds.length == 0 || !this.allowBedSelection
            "
          >
            Clear Beds
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
        <td>update:beds</td>
        <td>{{ form.pickedBeds }}</td>
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
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';

export default {
  components: {
    LocationSelector,
  },
  data() {
    return {
      required: true,
      includeFields: true,
      includeGreenhouses: true,
      includeGreenhousesWithBeds: true,
      allowBedSelection: true,
      requireBedSelection: false,
      selectAllBedsByDefault: false,
      form: {
        selected: null,
        pickedBeds: [],
      },
      validity: {
        showStyling: false,
        selected: false,
      },
      createdCount: 0,
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
location-selector-hack {
  display: none;
}
</style>
