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
 * A ActivePlantAssetPicklist allows the user to pick crops from a location.
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
 *   v-on:update:picked="(picked) => (form.picked = picked)"
 *   v-on:valid="(valid) => (validity.selected = valid)"
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
  emits: ['ready', 'valid', 'update:picked', 'error'],
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
      default: false,
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
      affectedPlants: [],
      picklistColumns: ['crop', 'bed', 'timestamp'],
      picklistLabels: {
        crop: 'Crop',
        bed: 'Bed',
        timestamp: 'Planted Date',
      },
    };
  },

  methods: {
    handleUpdatePicked(event) {
      /**
       * Emitted when the picked crops have changed.
       *
       * @event update:picked
       * @property {Map<number, Object>} event - A Map where the keys are the indices of the picked rows in the `rows` prop of picklistBase, and the values are objects representing the picked rows and their data.
       *
       */
      this.$emit('update:picked', event);
    },
    resetPicked() {
      this.$emit('update:picked', new Map());
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
        } catch (error) {
          console.error('Error fetching plant assets:', error);
          this.affectedPlants = [];
          this.$emit('error', 'Unable to fetch plant assets.');
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
        this.resetPicked();
      },
      immediate: true,
    },
    isInTrays: {
      handler() {
        this.checkPlantsAtLocation();
        this.resetPicked();
      },
      immediate: true,
    },
    isInGround: {
      handler() {
        this.checkPlantsAtLocation();
        this.resetPicked();
      },
      immediate: true,
    },
  },

  created() {
    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
