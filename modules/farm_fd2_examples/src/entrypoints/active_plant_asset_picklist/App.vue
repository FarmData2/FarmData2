<template>
  <h3>ActivePlantAssetPicklist Example</h3>
  <p>
    ActivePlantAssetPicklist is a component that allows the user to pick a
    location from a drop-down list and optionally select beds if necessary.
  </p>

  <hr />
  <!-- Pass all props, including new ones like isInTrays, isInGround, pickRequired -->
  <ActivePlantAssetPicklist
    id="location-selector"
    data-cy="location-selector"
    label="Location"
    invalid-feedback-text="Selection cannot be empty."
    :required="required"
    :showValidityStyling="validity.showStyling"
    :includeFields="includeFields"
    :includeGreenhouses="includeGreenhouses"
    :includeGreenhousesWithBeds="includeGreenhousesWithBeds"
    :requireBedSelection="requireBedSelection"
    :selectAllBedsByDefault="selectAllBedsByDefault"
    :pickRequired="pickRequired"
    :isInTrays="isInTrays"
    :isInGround="isInGround"
    v-model:selected="form.selected"
    v-model:pickedBeds="form.pickedBeds"
    v-model:termination="form.termination"
    v-model:picked="form.picked"
    @update:beds="(beds) => (form.pickedBeds = beds)"
    @valid="(valid) => (validity.selected = valid)"
    @ready="createdCount++"
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
      <!-- required -->
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
      <!-- showValidityStyling -->
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
      <!-- includeFields -->
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
      <!-- includeGreenhouses -->
      <tr>
        <td>includeGreenhouses</td>
        <td>
          <BFormCheckbox
            id="includeGreenhouses-checkbox"
            data-cy="includeGreenhouses-checkbox"
            switch
            v-model="includeGreenhouses"
            @change="
              () => {
                if (includeGreenhouses) {
                  includeGreenhousesWithBeds = true;
                }
              }
            "
          />
        </td>
      </tr>
      <!-- includeGreenhousesWithBeds -->
      <tr>
        <td>includeGreenhousesWithBeds</td>
        <td>
          <BFormCheckbox
            id="includeGreenhousesWithBeds-checkbox"
            data-cy="includeGreenhousesWithBeds-checkbox"
            switch
            v-model="includeGreenhousesWithBeds"
            :disabled="includeGreenhouses"
          />
        </td>
      </tr>
      <!-- requireBedSelection -->
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
      <!-- selectAllBedsByDefault -->
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
      <!-- pickRequired -->
      <tr>
        <td>pickRequired</td>
        <td>
          <BFormCheckbox
            id="pickRequired-checkbox"
            data-cy="pickRequired-checkbox"
            switch
            v-model="pickRequired"
          />
        </td>
      </tr>
      <!-- isInTrays -->
      <tr>
        <td>isInTrays</td>
        <td>
          <BFormCheckbox
            id="isInTrays-checkbox"
            data-cy="isInTrays-checkbox"
            switch
            v-model="isInTrays"
          />
        </td>
      </tr>
      <!-- isInGround -->
      <tr>
        <td>isInGround</td>
        <td>
          <BFormCheckbox
            id="isInGround-checkbox"
            data-cy="isInGround-checkbox"
            switch
            v-model="isInGround"
          />
        </td>
      </tr>
      <!-- selected -->
      <tr>
        <td>selected</td>
        <td>
          <BButton
            id="clear-selected-field-button"
            data-cy="clear-selected-field-button"
            variant="outline-primary"
            size="sm"
            @click="form.selected = ''"
            :disabled="!includeFields || form.selected === ''"
          >
            None
          </BButton>
          <BButton
            id="select-field-button"
            data-cy="select-field-button"
            variant="outline-primary"
            size="sm"
            @click="form.selected = 'A'"
            :disabled="!includeFields || form.selected === 'A'"
          >
            Field
          </BButton>
          <BButton
            id="select-field-beds-button"
            data-cy="select-field-beds-button"
            variant="outline-primary"
            size="sm"
            @click="form.selected = 'ALF'"
            :disabled="!includeFields || form.selected === 'ALF'"
          >
            Field w/ Beds
          </BButton>
          <BButton
            id="select-greenhouse-button"
            data-cy="select-greenhouse-button"
            variant="outline-primary"
            size="sm"
            @click="form.selected = 'JASMINE'"
            :disabled="!includeGreenhouses || form.selected === 'JASMINE'"
          >
            Greenhouse
          </BButton>
          <BButton
            id="select-greenhouse-beds-button"
            data-cy="select-greenhouse-beds-button"
            variant="outline-primary"
            size="sm"
            @click="form.selected = 'CHUAU'"
            :disabled="
              (!includeGreenhouses && !includeGreenhousesWithBeds) ||
              form.selected === 'CHUAU'
            "
          >
            Greenhouse w/ Beds
          </BButton>
        </td>
      </tr>
      <!-- pickedBeds -->
      <tr>
        <td>pickedBeds</td>
        <td>
          <BButton
            id="select-bed-button"
            data-cy="select-bed-button"
            variant="outline-primary"
            size="sm"
            @click="form.pickedBeds.push(form.selected + '-1')"
            :disabled="
              !['ALF', 'CHUAU', 'GHANA'].includes(form.selected) ||
              form.pickedBeds.includes(form.selected + '-1') ||
              !requireBedSelection
            "
          >
            Select Bed
          </BButton>
          <BButton
            id="clear-bed-button"
            data-cy="clear-bed-button"
            variant="outline-primary"
            size="sm"
            @click="form.pickedBeds = []"
            :disabled="form.pickedBeds.length === 0 || !requireBedSelection"
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
      <tr>
        <td>update:termination</td>
        <td>{{ form.termination }}</td>
      </tr>
      <!-- New row for update:picked -->
      <tr>
        <td>update:picked</td>
        <td>{{ form.picked }}</td>
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
import ActivePlantAssetPicklist from '@comps/ActivePlantAssetPicklist/ActivePlantAssetPicklist.vue';

export default {
  components: {
    ActivePlantAssetPicklist,
  },
  data() {
    return {
      // The controls for ALL props
      required: true,
      includeFields: true,
      includeGreenhouses: true,
      includeGreenhousesWithBeds: true,
      requireBedSelection: false,
      selectAllBedsByDefault: false,
      pickRequired: false,
      isInTrays: false,
      isInGround: true,

      // Two-way bindings
      form: {
        selected: null,
        pickedBeds: [],
        termination: false,
        picked: new Map(), // Now we store 'picked' from the child
      },

      // For controlling validity styling in the example
      validity: {
        showStyling: false,
        selected: false,
      },

      // Example usage of a loading counter
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      // e.g. if we wait for the child to fire @ready, we increment createdCount
      // once that hits 2, we can consider the page 'loaded'
      return this.createdCount === 2;
    },
  },
  created() {
    // We'll increment once ourselves here, and then once more in @ready
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
