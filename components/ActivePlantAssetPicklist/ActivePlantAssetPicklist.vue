<template>
  <div
    id="active-plant-asset-picklist"
    data-cy="active-plant-asset-picklist"
  >
    <!-- Location Selection -->
    <LocationSelector
      id="active-plant-asset-picklist-location"
      data-cy="active-plant-asset-picklist-location"
      label="Location"
      invalid-feedback-text="Selection cannot be empty."
      v-bind:required="required"
      v-bind:includeFields="includeFields"
      v-bind:includeGreenhouses="includeGreenhouses"
      v-bind:includeGreenhousesWithBeds="includeGreenhousesWithBeds"
      v-bind:selected="selected"
      v-bind:pickedBeds="pickedBeds"
      v-bind:allowBedSelection="allowBedSelection"
      v-bind:requireBedSelection="requireBedSelection"
      v-bind:selectAllBedsByDefault="selectAllBedsByDefault"
      v-bind:showValidityStyling="showValidityStyling"
      v-on:valid="handleLocationValid($event)"
      v-on:update:beds="
        (checkedBeds, totalBeds) => handleBedsUpdate(checkedBeds, totalBeds)
      "
      v-on:update:selected="handleLocationUpdate($event)"
    />

    <!-- Termination Event -->
    <div
      id="active-plant-asset-picklist-group"
      data-cy="active-plant-asset-picklist-group"
      class="d-flex flex-column align-items-center"
      v-if="showPicklistBase"
    >
      <BFormGroup
        id="active-plant-asset-picklist-termination-event-group-checkbox"
        data-cy="active-plant-asset-picklist-termination-event-group-checkbox"
        class="w-100"
        label-for="active-plant-asset-picklist-termination-event-checkbox"
        label-cols="auto"
        label-align="end"
      >
        <template v-slot:label>
          <span
            id="active-plant-asset-picklist-termination-event-label"
            data-cy="active-plant-asset-picklist-termination-event-label"
            >Termination Event:</span
          >
        </template>

        <BFormCheckbox
          id="active-plant-asset-picklist-termination-event-checkbox"
          data-cy="active-plant-asset-picklist-termination-event-checkbox"
          v-model="termination"
          size="lg"
        />
      </BFormGroup>
      <PicklistBase
        id="active-plant-asset-picklist-table"
        data-cy="active-plant-asset-picklist-table"
        class="w-100"
        v-bind:required="pickRequired"
        invalidFeedbackText="At least one bed must be selected."
        v-bind:showValidityStyling="showValidityStyling"
        v-bind:columns="picklistColumns"
        v-bind:labels="picklistLabels"
        v-bind:rows="affectedPlants"
        v-bind:showInfoIcons="false"
        v-bind:picked="picked"
        v-on:valid="(valid) => (validity.picked = !plantsAtLocation || valid)"
        v-on:update:picked="handlePickedUpdate($event)"
      />
    </div>
    <hr />
  </div>
</template>

<script>
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';

export default {
  name: 'ActivePlantAssetPicklist',
  components: { LocationSelector, PicklistBase },
  emits: [
    'ready',
    'valid',
    'update:selected',
    'update:beds',
    'update:termination',
  ],

  props: {
    isInTrays: { type: Boolean, default: false },
    isInGround: { type: Boolean, default: true },
    allowBedSelection: { type: Boolean, default: true },
    requireBedSelection: { type: Boolean, default: true },
    includeFields: { type: Boolean, default: false },
    includeGreenhouses: { type: Boolean, default: false },
    includeGreenhousesWithBeds: { type: Boolean, default: false },
    selectAllBedsByDefault: { type: Boolean, default: false },
    pickRequired: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    showPicklistBase: { type: Boolean, default: true },
    showValidityStyling: { type: Boolean, default: false },
    selected: { type: String, default: null },
    pickedBeds: { type: Array, default: () => [] },
  },

  data() {
    return {
      selectedLocation: this.selected,
      locationValid: false,
      termination: false,
      affectedPlants: [],
      picked: new Map(),
      picklistColumns: ['crop', 'bed', 'timestamp'],
      picklistLabels: {
        crop: 'Crop',
        bed: 'Bed',
        timestamp: 'Planted Date',
      },
    };
  },

  computed: {
    isValid() {
      if (!this.required) {
        return true;
      }
      if (!this.selectedLocation) {
        return false;
      }
      if (this.requireBedSelection && this.allowBedSelection) {
        if (!this.pickedBeds || this.pickedBeds.length === 0) {
          return false;
        }
      }
      return true;
    },
    validityStyling() {
      return this.isValid;
    },
  },

  methods: {
    handleLocationUpdate(newLocation) {
      this.selectedLocation = newLocation;
      this.checkPlantsAtLocation();
      this.$emit('update:selected', newLocation);
    },
    handleLocationValid(validStatus) {
      this.locationValid = validStatus;
      this.$emit('valid', this.isValid);
    },
    handleBedsUpdate(checkedBeds, totalBeds) {
      console.log('handleBedsUpdate was called with:', checkedBeds, totalBeds);
      this.$emit('update:beds', checkedBeds, totalBeds);
    },
    async checkPlantsAtLocation() {
      if (this.selectedLocation) {
        try {
          let results = await farmosUtil.getPlantAssets(
            this.selectedLocation,
            [],
            this.isInTrays, // ask
            this.isInGround // ask
          );
          // Map results to rows for PicklistBase
          this.affectedPlants = results.flatMap((plant) =>
            plant.beds.length > 0
              ? plant.beds.map((bed) => ({
                  crop: plant.crop.join(', '),
                  bed,
                  timestamp: plant.timestamp,
                  uuid: plant.uuid,
                  location: plant.location,
                  created_by: plant.created_by.join(', '),
                }))
              : [
                  {
                    crop: plant.crop.join(', '),
                    bed: 'N/A',
                    timestamp: plant.timestamp,
                    uuid: plant.uuid,
                    location: plant.location,
                    created_by: plant.created_by.join(', '),
                  },
                ]
          );

          // Check if all plants have 'N/A' beds and adjust columns accordingly
          const allBedsNA = this.affectedPlants.every(
            (plant) => plant.bed === 'N/A'
          );

          if (allBedsNA) {
            this.picklistColumns = ['crop', 'timestamp'];
            this.picklistLabels = {
              crop: 'Crop',
              timestamp: 'Planted Date',
            };
          } else {
            this.picklistColumns = ['crop', 'bed', 'timestamp'];
            this.picklistLabels = {
              crop: 'Crop',
              bed: 'Bed',
              timestamp: 'Planted Date',
            };
          }
        } catch (error) {
          console.error('Error fetching plant assets:', error);
          this.form.affectedPlants = [];
        }
      } else {
        this.affectedPlants = [];
      }
    },
  },

  watch: {
    /**
     * Re-emit validity whenever isValid changes
     */
    isValid(newVal) {
      this.$emit('valid', newVal);
    },
    /**
     * 3) Whenever termination changes, emit it to the parent
     */
    termination(newVal) {
      this.$emit('update:termination', newVal);
    },
  },

  created() {
    this.$emit('valid', this.isValid);
    this.$emit('ready');
  },
};
</script>

<style scoped>
/*
 * Import a set of standard CSS styles for FarmData2
 * entry points that optimize the page for mobile devices.
 */
@import url('@css/fd2-mobile.css');

#active-plant-asset-picklist-location {
  margin-bottom: 8px;
}

#active-plant-asset-picklist-group {
  display: flex;
  align-items: center;
}

#active-plant-asset-picklist-group label {
  padding-bottom: 0px;
  padding-top: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}

#active-plant-asset-picklist-group div.form-check.form-control-lg {
  padding-bottom: 0px;
  padding-top: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}

#active-plant-asset-picklist-termination-event-checkbox {
  align-items: center;
  padding: 0.25rem;
  background-color: #fff;
}

#active-plant-asset-picklist-group {
  border: 1px solid rgb(222, 226, 230);
}
</style>
