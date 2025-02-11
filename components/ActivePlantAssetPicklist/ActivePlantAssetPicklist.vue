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
    </div>
    <hr />
  </div>
</template>

<script>
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';

export default {
  name: 'ActivePlantAssetPicklist',
  components: { LocationSelector },
  emits: [
    'ready',
    'valid',
    'update:selected',
    'update:beds',
    'update:termination',
  ],

  props: {
    allowBedSelection: { type: Boolean, default: true },
    requireBedSelection: { type: Boolean, default: true },
    includeFields: { type: Boolean, default: false },
    includeGreenhouses: { type: Boolean, default: false },
    includeGreenhousesWithBeds: { type: Boolean, default: false },
    selectAllBedsByDefault: { type: Boolean, default: false },
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
