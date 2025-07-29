<template>
  <div class="active-plant-asset-picklist-container">
    <PickerBase
      v-if="location && locationHasBeds"
      id="active-plant-asset-bed-picker"
      data-cy="active-plant-asset-bed-picker"
      label="Beds"
      invalid-feedback-text="At least one bed is required."
      v-bind:required="required"
      v-bind:showValidityStyling="showValidityStyling"
      v-bind:options="filteredBedNames"
      v-model:picked="checkedBeds"
    />

    <PicklistBase
      v-if="location && locationHasPlants"
      id="active-plant-asset-picklist"
      data-cy="active-plant-asset-picklist"
      class="w-100"
      v-bind:required="requiredRow"
      invalidFeedbackText="At least one row must be selected."
      v-bind:showValidityStyling="showValidityStyling"
      v-bind:columns="picklistColumns"
      v-bind:labels="picklistLabels"
      v-bind:rows="plantsInLocation"
      v-bind:showInfoIcons="false"
      v-bind:picked="pickedRows"
      v-on:update:picked="handleUpdatePickedRows($event)"
    />
  </div>
</template>

<script>
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';
import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';
import PickerBase from '@comps/PickerBase/PickerBase.vue';

/**
 * The ActivePlantAssetPicklist allows the user to pick crops from a location.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/active_plant_asset_picklist">The ActivePlantAssetPicklist Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/active_plant_asset_picklist/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <ActivePlantAssetPicklist
 *   id="active-plant-asset-picklist"
 *   data-cy="active-plant-asset-picklist"
 *   v-bind:required="required"
 *   v-bind:location="form.selected"
 *   v-bind:showValidityStyling="validity.showStyling"
 *   v-bind:picked="form.picked"
 *   v-bind:isInTrays="isInTrays"
 *   v-bind:isInGround="isInGround"
 *   v-on:hasPlants="form.hasPlants = $event"
 *   v-on:update:picked="form.picked = $event"
 *   v-on:update:area="form.area = $event"
 *   v-on:update:checkedBeds="form.checkedBeds = $event"
 *   v-on:valid="validity.selected = $event"
 *   v-on:error="handleError"
 *   v-on:ready="createdCount++"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name                  | Description
 * --------------------------------| ---------------------------------------
 * `active-plant-bed-picker`       | The `BedPicker` element shows the beds that can be picked.
 * `active-plant-asset-picklist`   | The `PicklistBase` element shows the crops that can be picked.
 */
export default {
  name: 'ActivePlantAssetPicklist',
  components: { PicklistBase, PickerBase },
  emits: [
    'ready',
    'valid',
    'hasPlants',
    'update:picked',
    'update:area',
    'update:checkedBeds',
    'error',
  ],
  props: {
    /**
     * Whether to include plants that are in trays (tray seeded but not transplanted) or not.
     */
    isInTrays: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to include plants that are in the ground (direct seeded or transplanted) or not
     */
    isInGround: {
      type: Boolean,
      default: true,
    },
    /**
     * The name of the location for which the `ActivePlantAssetPicklist` should show crops.
     * The `ActivePlantAssetPicklist` will fetch any crops associated with this location.
     */
    location: {
      type: String,
      required: true,
    },
    /**
     * The crops that are currently picked.
     */
    picked: {
      type: Map,
      default: () => new Map(),
    },
    /**
     * If true, enforce at least one row in the PicklistBase.
     */
    requiredRow: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether at least one crop or bed must be picked.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether validity styling should appear on input elements.
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to include beds that do not have active plant assets.
     */
    includeEmptyBeds: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      pickedRows: new Map(),
      checkedBeds: [],
      plantsInLocation: [],
      bedsInLocation: [],
      picklistColumns: ['crop', 'bed', 'timestamp'],
      picklistLabels: {
        crop: 'Crop',
        bed: 'Bed',
        timestamp: 'Planted Date',
      },
      updateInProgress: false, // flag to ensure one update cycle
    };
  },
  computed: {
    locationHasPlants() {
      return this.plantsInLocation.length > 0;
    },
    locationHasBeds() {
      return this.filteredBedNames.length > 0;
    },
    filteredBedNames() {
      if (this.includeEmptyBeds) {
        const allBedNames = this.bedsInLocation.map(
          (bed) => bed.attributes.name
        );
        return allBedNames;
      } else {
        // Only return bed names that have active plant assets
        const bedsWithPlants = new Set(
          this.plantsInLocation
            .map((plant) => plant.bed)
            .filter((bed) => bed !== 'N/A')
        );
        return Array.from(bedsWithPlants);
      }
    },
    hasSelectedPlantAssets() {
      return this.pickedRows && this.pickedRows.size > 0;
    },
    hasSelectedBeds() {
      return this.checkedBeds && this.checkedBeds.length > 0;
    },
    isValid() {
      if (!this.required) {
        return true;
      }

      if (this.requiredRow) {
        return this.hasSelectedPlantAssets;
      }

      if (this.required) {
        return this.hasSelectedBeds || this.hasSelectedPlantAssets;
      }

      return false;
    },
    affectedAreaPercentage() {
      const beds = this.checkedBeds;
      const rows = this.pickedRows;

      // Case 1: No beds selected, but rows are picked
      if (beds.length === 0 && rows.size > 0) {
        return (rows.size / this.plantsInLocation.length) * 100;
      }

      // Case 2: No beds and no plantAssets
      if (
        this.bedsInLocation.length === 0 &&
        this.plantsInLocation.length === 0
      ) {
        return 100;
      }

      if (beds.length === 0 && rows.size === 0) {
        return 0;
      }

      // Case 3: Beds selected, but no plant assets picked
      if (beds.length > 0 && rows.size === 0) {
        return (beds.length / this.bedsInLocation.length) * 100;
      }

      // Case 4: Beds and plant rows are selected — calculate weighted impact
      const bedTotals = {}; // Total plant assets per bed
      for (const plant of this.plantsInLocation) {
        const bed = plant.bed;
        if (bed && bed !== 'N/A') {
          bedTotals[bed] = (bedTotals[bed] || 0) + 1;
        }
      }

      const bedPicks = {}; // Number of picked plant assets per bed

      // Count picked rows per bed
      for (const { row } of rows.values()) {
        const bed = row.bed || 'N/A';
        if (!bedPicks[bed]) {
          bedPicks[bed] = 0;
        }

        bedPicks[bed]++;
      }

      // Calculate weighted sum of affected beds
      let weightedSum = 0;

      for (const bed of beds) {
        const picked = bedPicks[bed] || 0;
        const total = bedTotals[bed] || 0;

        if (total === 0) {
          // No plant assets in this bed — treat as fully affected
          weightedSum += 1;
        } else {
          weightedSum += picked / total;
        }
      }
      const areaPercentage = Math.round(
        (weightedSum / this.bedsInLocation.length) * 100
      );

      return areaPercentage;
    },
  },
  methods: {
    handleUpdatePickedRows(event) {
      // If we're already processing an update, don't trigger another update cycle
      // or if nothing changed
      if (this.updateInProgress || this.mapsAreEqual(event, this.pickedRows))
        return;

      this.updateInProgress = true; // Start update cycle

      this.pickedRows = event;

      this.updateCheckedBedsFromPickedRows(this.pickedRows);

      // End the update cycle AFTER Vue has processed watcher updates.
      this.$nextTick(() => {
        this.updateInProgress = false;
      });
    },
    updateCheckedBedsFromPickedRows(newPicked) {
      if (!this.picklistColumns.includes('bed')) return;

      // Create a map of counts for each bed in plantsInLocation
      const bedTotals = this.plantsInLocation.reduce((acc, row) => {
        if (row.bed !== 'N/A') {
          acc[row.bed] = (acc[row.bed] || 0) + 1;
        }
        return acc;
      }, {});

      // Count how many rows per bed are selected in the newPicked map
      const bedPicks = [...newPicked.values()].reduce((acc, { row }) => {
        if (row.bed !== 'N/A') {
          acc[row.bed] = (acc[row.bed] || 0) + 1;
        }
        return acc;
      }, {});

      // For each bed with at least one picked row, include in checkedBeds
      const AutoBeds = Object.keys(bedPicks).filter((bed) => bedPicks[bed] > 0);

      // Preserve any existing checkedBeds that are not in picklistBase
      const manualOnly = this.checkedBeds.filter((b) => !(b in bedTotals));

      // New checked beds
      const merged = Array.from(new Set([...manualOnly, ...AutoBeds]));

      // Update only if it really changed
      if (
        JSON.stringify(merged.sort()) !==
        JSON.stringify(this.checkedBeds.sort())
      ) {
        this.checkedBeds = merged;
      }
    },
    handleUpdateCheckedBeds(newBeds, oldBeds) {
      // If an update cycle is already in progress, exit to prevent a loop.
      if (this.updateInProgress) return;

      // Find which beds were added and which were removed...
      const added = newBeds.filter((bed) => !oldBeds.includes(bed));
      const removed = oldBeds.filter((bed) => !newBeds.includes(bed));

      if (added.length > 0 || removed.length > 0) {
        this.updatePickedRowsFromCheckedBeds(added, removed);
      }
    },
    updatePickedRowsFromCheckedBeds(added = [], removed = []) {
      if (!this.picklistColumns.includes('bed')) return;

      const newPicked = new Map(this.pickedRows);

      // If beds were unchecked, remove those rows from pickedRows
      if (removed.length > 0) {
        this.plantsInLocation.forEach((row, idx) => {
          if (removed.includes(row.bed) && row.bed !== 'N/A') {
            newPicked.delete(idx);
          }
        });
      }

      // If beds were checked, add all rows for those beds to pickedRows
      if (added.length > 0) {
        this.plantsInLocation.forEach((row, idx) => {
          if (added.includes(row.bed) && row.bed !== 'N/A') {
            newPicked.set(idx, { row: row, picked: 1 });
          }
        });
      }

      // Only update pickedRows if there is an actual change
      if (!this.mapsAreEqual(newPicked, this.pickedRows)) {
        this.pickedRows = new Map(newPicked);
      }
    },
    async getPlantsInLocation() {
      console.log('getting plants in location');
      if (this.location) {
        try {
          const results = await farmosUtil.getPlantAssets(
            this.location,
            [],
            this.isInTrays,
            this.isInGround
          );
          // Map results to rows for PicklistBase
          this.plantsInLocation = results.flatMap((plant) =>
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
          const allBedsNA = this.plantsInLocation.every(
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

          if (this.pickedRows.size > 0) {
            this.pickedRows = new Map();
          }
        } catch (error) {
          console.error('Error fetching plant assets:', error);
          if (this.plantsInLocation.length > 0) {
            this.plantsInLocation = [];
          }
          if (this.pickedRows.size > 0) {
            this.pickedRows = new Map();
          }

          /**
           * There was an error fetching plant assets.
           *
           * @event error
           * @property {string} message - A description of the error that occurred.
           * @property {Error} error - The actual error object for debugging.
           */
          this.$emit('error', {
            message: 'Unable to fetch plant assets.',
            error,
          });
        }
      } else {
        if (this.plantsInLocation.length > 0) {
          this.plantsInLocation = [];
        }
        if (this.pickedRows.size > 0) {
          this.pickedRows = new Map();
        }
      }
    },
    mapsAreEqual(mapA, mapB) {
      if (mapA.size !== mapB.size) {
        return false;
      }
      for (const [key, valueA] of mapA) {
        if (!mapB.has(key)) {
          return false;
        }
        const valueB = mapB.get(key);

        // Converted to JSON strings for a simple deep comparison.
        if (JSON.stringify(valueA) !== JSON.stringify(valueB)) {
          return false;
        }
      }
      return true;
    },
    async getBedsInLocation() {
      if (this.location) {
        try {
          this.bedsInLocation = await farmosUtil.getBedsInLocation(
            this.location
          );
        } catch (error) {
          console.error('Error fetching beds for location:', error);
          if (this.bedsInLocation.length > 0) {
            this.bedsInLocation = [];
          }
        }
      } else {
        if (this.bedsInLocation.length > 0) {
          this.bedsInLocation = [];
        }
      }

      if (this.checkedBeds.length > 0) {
        this.checkedBeds = [];
      }
    },
  },
  watch: {
    location: {
      handler() {
        this.getPlantsInLocation();
        this.getBedsInLocation();
      },
      immediate: true,
    },
    isInTrays() {
      this.getPlantsInLocation();
    },
    isInGround() {
      this.getPlantsInLocation();
      this.getBedsInLocation();
    },
    checkedBeds(newBeds, oldBeds) {
      this.handleUpdateCheckedBeds(newBeds, oldBeds);

      /**
       * The selected beds have changed.
       * @event update:checkedBeds
       * @property {Array<string>} newBeds an array containing the names of the selected beds.
       */
      this.$emit('update:checkedBeds', newBeds);
    },
    pickedRows() {
      /**
       * The picked crops have changed.
       *
       * @event update:picked
       * @property {Map (number, Object)} picked - A Map where the keys are the indices of the picked rows in the `rows` prop of picklistBase, and the values are objects representing the picked rows and their data.
       *
       */
      this.$emit('update:picked', this.pickedRows);
    },
    locationHasPlants(newValue) {
      /**
       * Emitted when the presence of active plant assets at the location changes.
       *
       * @event hasPlants
       * @property {Boolean} newValue - `true` if there are active plant assets at the location, `false` otherwise.
       */
      this.$emit('hasPlants', newValue);
    },
    isValid() {
      /**
       * The validity of the bedPicker or PicklistBase has changed.
       * @property {boolean} event whether the selections are valid or not.
       */
      this.$emit('valid', this.isValid);
    },
    affectedAreaPercentage(newArea) {
      /**
       * The estimate of the percentage of the location affected by the soil disturbance has changed.
       * @param newArea the estimate of the area affected.
       */
      this.$emit('update:area', newArea);
    },
    plantsInLocation() {
      // When there are no active plant assets, auto-select all beds
      if (
        this.plantsInLocation.length === 0 &&
        this.bedsInLocation.length > 0
      ) {
        const allBedNames = this.bedsInLocation.map(
          (bed) => bed.attributes.name
        );
        if (JSON.stringify(this.checkedBeds) !== JSON.stringify(allBedNames)) {
          this.checkedBeds = allBedNames;
        }
      }
    },
  },
  created() {
    //this.getPlantsInLocation().then(() => {
    /**
     * The component is ready for use.
     */
    this.$emit('ready');
    //this.$emit('update:area', 0);
    this.$emit('valid', this.isValid);
    //});
  },
};
</script>

<style scoped>
#active-plant-asset-bed-picker {
  display: flex;
  align-items: center;
  background-color: rgb(255, 255, 255);
  padding: 0.75rem 1rem;
}
.active-plant-asset-picklist-container {
  width: 100%;
  border: 1px solid rgb(222, 226, 230);
}
</style>
