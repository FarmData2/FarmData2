<template>
  <h3>ActivePlantAssetPicklist Example</h3>
  <p>
    ActivePlantAssetPicklist allows the user to pick plant assets from a list of
    locations.
  </p>

  <LocationSelector
    id="soil-disturbance-location"
    data-cy="soil-disturbance-location"
    required
    includeFields
    includeGreenhouses
    v-model:selected="form.selected"
    v-bind:allowBedSelection="false"
    v-on:ready="createdCount++"
  />

  <hr />
  <ActivePlantAssetPicklist
    id="active-plant-asset-picklist"
    data-cy="active-plant-asset-picklist"
    v-bind:required="required"
    v-bind:location="form.selected"
    v-bind:showValidityStyling="validity.showStyling"
    v-bind:picked="form.picked"
    v-bind:isInTrays="isInTrays"
    v-bind:isInGround="isInGround"
    v-on:hasPlants="form.hasPlants = $event"
    v-on:update:picked="form.picked = $event"
    v-on:update:area="form.area = $event"
    v-on:valid="validity.selected = $event"
    v-on:error="handleError"
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
        <td>hasPlants</td>
        <td>{{ form.hasPlants }}</td>
      </tr>
      <tr>
        <td>update:picked</td>
        <td>{{ form.picked }}</td>
      </tr>
      <tr>
        <td>update:area</td>
        <td>{{ form.area }}</td>
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
import ActivePlantAssetPicklist from '@comps/ActivePlantAssetPicklist/ActivePlantAssetPicklist.vue';
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';

export default {
  components: {
    ActivePlantAssetPicklist,
    LocationSelector,
  },
  data() {
    return {
      form: {
        selected: '',
        picked: new Map(),
        area: null,
        hasPlants: false,
      },
      validity: {
        showStyling: false,
        selected: false,
      },
      required: false,
      isInTrays: false,
      isInGround: true,
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount === 3;
    },
  },
  methods: {
    handleError(errorMessage) {
      console.error(errorMessage);
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
</style>
