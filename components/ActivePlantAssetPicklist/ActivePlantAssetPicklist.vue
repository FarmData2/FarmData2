<template>
  <PicklistBase
    id="active-plant-asset-picklist"
    data-cy="active-plant-asset-picklist"
    class="w-100"
    v-bind:required="required"
    invalidFeedbackText="At least one row must be selected."
    v-bind:showValidityStyling="showValidityStyling"
    v-bind:columns="picklistColumns"
    v-bind:labels="picklistLabels"
    v-bind:rows="affectedPlants"
    v-bind:showInfoIcons="false"
    v-bind:picked="picked"
    v-on:update:picked="handleUpdatePicked($event)"
    v-on:valid="handleValid($event)"
  />
</template>

<script>
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';
import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';

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
 *   v-on:update:picked="(picked) => (form.picked = picked)"
 *   v-on:update:area="form.area = $event"
 *   v-on:valid="validity.selected = $event"
 *   v-on:error="handleError"
 *   v-on:ready="createdCount++"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name                       | Description
 * -------------------------------------| -----------
 * `active-plant-asset-picklist`        | The `PicklistBase` element showing the crops that can be picked.
 */
export default {
  name: 'ActivePlantAssetPicklist',
  components: { PicklistBase },
  emits: [
    'ready',
    'valid',
    'hasPlants',
    'update:picked',
    'update:area',
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
     * Whether at least one crop must be picked or not.
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
  },

  data() {
    return {
      pickedRow: new Map(),
      affectedPlants: [],
      picklistColumns: ['crop', 'bed', 'timestamp'],
      picklistLabels: {
        crop: 'Crop',
        bed: 'Bed',
        timestamp: 'Planted Date',
      },
    };
  },
  computed: {
    plantsAtLocation() {
      return this.affectedPlants.length > 0;
    },
  },

  methods: {
    handleUpdatePicked(event) {
      if (event.size > 0 || this.pickedRow.size > 0) {
        this.pickedRow = event;

        // Calculate the area based on picked crop
        const area = this.calculatePickedArea(event);

        /**
         * Emitted when the picked crops have changed.
         *
         * @event update:picked
         * @property {Map (number, Object)} picked - A Map where the keys are the indices of the picked rows in the `rows` prop of picklistBase, and the values are objects representing the picked rows and their data.
         *
         */
        this.$emit('update:picked', this.pickedRow);

        /**
         * Emitted when the calculated area percentage changes based on selected crops.
         *
         * **Calculation**:
         *
         *  - **Locations with beds:** The area is calculated based on the proportion of selected crops in each bed,
         *   using the summation formula:
         *   `[ ( SUM (picked crops in bed_i / total crops in bed_i) )  / total unique beds ] * 100`.
         *
         * - **Locations with active plant assets but no beds:** The area is evenly distributed across all available plant assets.
         *  If half of the plants are picked, the area is 50%. If all are picked, the area is 100%.
         *
         * - **Locations with no active plant assets:** The area defaults to 100% since there are no crops to pick.
         *
         * @event update:area
         * @property {number} area - The selected area percentage, ranging from 0 to 100.
         *
         */
        this.$emit('update:area', area);
      }
    },

    calculatePickedArea(picked) {
      // If no plants are picked, return 0%
      if (picked.size === 0) {
        return 0;
      }

      // If no beds are in the dataset, default to 100%
      if (!this.picklistColumns.includes('bed')) {
        return Math.round((picked.size / this.affectedPlants.length) * 100);
      }

      // Map "Bed -> Total # of plants in that bed"
      const bedTotals = this.affectedPlants.reduce((acc, row) => {
        if (row.bed !== 'N/A') {
          acc[row.bed] = (acc[row.bed] || 0) + 1;
        }
        return acc;
      }, {});

      // Map "Bed -> # of picked plants in that bed"
      const bedPicks = [...picked.values()].reduce((acc, row) => {
        if (row.row.bed !== 'N/A') {
          acc[row.row.bed] = (acc[row.row.bed] || 0) + 1;
        }
        return acc;
      }, {});

      // Get total number of unique beds
      const totalUniqueBeds = Object.keys(bedTotals).length;
      if (totalUniqueBeds === 0) {
        return 0; // Avoid division by zero
      }

      // Area = [ ( SUM (picked crops in bed_i / total crops in bed_i) ) / total unique beds ] * 100
      let weightedSum = 0;

      for (const [bed, totalForBed] of Object.entries(bedTotals)) {
        const pickedForBed = bedPicks[bed] || 0;
        weightedSum += pickedForBed / totalForBed;
      }

      const areaPercentage = Math.round((weightedSum / totalUniqueBeds) * 100);

      return areaPercentage;
    },

    handleValid(event) {
      /**
       * Indicates if this component's value is valid or not.
       * @property {Boolean} event `true` if the component's value is valid; `false` if it is invalid.
       */
      this.$emit('valid', event);
    },

    async checkPlantsAtLocation() {
      if (this.location) {
        try {
          const results = await farmosUtil.getPlantAssets(
            this.location,
            [],
            this.isInTrays,
            this.isInGround
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

          if (this.pickedRow.size > 0) {
            this.pickedRow = new Map();
            this.$emit('update:picked', this.pickedRow);
          }

          // Emit area reset logic when switching between locations with beds vs no beds
          if (this.affectedPlants.length === 0) {
            this.$emit('update:area', 100); // No active plants, default to 100%
          } else {
            this.$emit('update:area', 0); // Active plants present, reset to 0
          }
        } catch (error) {
          console.error('Error fetching plant assets:', error);
          this.affectedPlants = [];

          /**
           * Emitted when there is an error fetching plant assets.
           *
           * @event error
           * @property {string} message - A description of the error that occurred.
           * @property {Error} error - The actual error object for debugging.
           */
          this.$emit('error', {
            message: 'Unable to fetch plant assets.',
            error,
          });

          // if no plants available due to error, then default area to 100%
          this.$emit('update:area', 100);
        }
      } else {
        this.affectedPlants = [];
      }
    },
  },

  watch: {
    location: {
      handler() {
        this.checkPlantsAtLocation();
      },
      immediate: true,
    },
    isInTrays: {
      handler() {
        this.checkPlantsAtLocation();
      },
    },
    isInGround: {
      handler() {
        this.checkPlantsAtLocation();
      },
    },
    plantsAtLocation: {
      handler(newValue) {
        /**
         * Emitted when the presence of active plant assets at the location changes.
         *
         * @event hasPlants
         * @property {Boolean} newValue - `true` if there are active plant assets at the location, `false` otherwise.
         */
        this.$emit('hasPlants', newValue);
      },
    },
  },

  created() {
    /**
     * The component is ready for use.
     */
    this.$emit('ready');
    this.$emit('update:area', 0);
  },
};
</script>
