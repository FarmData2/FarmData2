<template>
  <div>
    <SelectorBase
      id="crop-selector"
      data-cy="crop-selector"
      label="Crop"
      invalidFeedbackText="A crop is required"
      v-bind:options="cropList"
      v-bind:required="required"
      v-bind:selected="selected"
      v-bind:showValidityStyling="showValidityStyling"
      v-on:update:selected="handleUpdateSelected($event)"
      v-on:valid="handleValid($event)"
      v-on:add-clicked="handleAddClicked"
      v-bind:popupUrl="popupUrl"
    />
  </div>
</template>

<script>
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

/**
 * The CropSelector component is a UI element that allows the user to select a crop.
 *
 * It fetches the list for crops (farmOS `taxonomy_term--plant_type` records) from the farmOS server.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/crop_selector">The CropSelector Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/crop_selector/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <CropSelector
 *   id="crop-selector"
 *   data-cy="crop-selector"
 *   v-bind:required="required"
 *   v-bind:showValidityStyling="validity.showStyling"
 *   v-model:selected="form.selected"
 *   v-on:valid="
 *     (valid) => {
 *       validity.selected = valid;
 *     }
 *   "
 *   v-on:ready="createdCount++"
 *   v-on:error="(msg) => showErrorToast('Network Error', msg)"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * crop-selector         | The `SelectorBase` component containing the dropdown.
 */
export default {
  name: 'CropSelector',
  components: { SelectorBase },
  emits: ['error', 'ready', 'update:selected', 'valid'],
  props: {
    /**
     * Whether a crop selection is required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * The name of the selected crop.
     * This prop is watched and changes are relayed to the component's internal state.
     */
    selected: {
      type: String,
      default: null,
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
      cropList: [],
      canCreateCrop: false,
      popupUrl: null,
    };
  },
  methods: {
    handleUpdateSelected(event) {
      /**
       * The selected crop has changed.
       * @property {string} event the name of the new selected crop.
       */
      this.$emit('update:selected', event);
    },
    handleValid(event) {
      /**
       * The validity of the selected crop has changed.
       * @property {boolean} event whether the selected crop is valid or not.
       */
      this.$emit('valid', event);
    },
    async handleAddClicked(newCrop) {
      // when the selector emits the add-clicked event
      // clear the cached crops and repopulate the options
      // to get the newly created crop, then select it

      // If a new asset is provided, update the selected
      if (newCrop) {
        // Clear the cached
        farmosUtil.clearCachedCrops();

        // Populate the map and wait for it to complete
        await this.populateCropList();

        this.handleUpdateSelected(newCrop);
      }
    },

    async populateCropList() {
      try {
        let cropMap = await farmosUtil.getCropNameToTermMap();

        // Update asset list
        this.cropList = Array.from(cropMap.keys());
      } catch (error) {
        console.error('Error populating crop map:', error);
      }
    },
  },
  watch: {},
  created() {
    let canCreate = farmosUtil.checkPermission('create-plant-asset');
    let cropMap = farmosUtil.getCropNameToTermMap();

    Promise.all([canCreate, cropMap])
      .then(([canCreate, cropMap]) => {
        this.cropList = Array.from(cropMap.keys());
        this.canCreateCrop = canCreate;

        if (this.canCreateCrop) {
          this.popupUrl = '/admin/structure/taxonomy/manage/plant_type/add';
        }

        /**
         * The select has been populated with the list of crops and the component is ready to be used.
         */
        this.$emit('ready');
      })
      .catch((error) => {
        console.error('CropSelector: Error fetching crops.');
        console.error(error);
        /**
         * An error occurred when communicating with the farmOS server.
         * @property {string} msg an error message.
         */
        this.$emit('error', 'Unable to fetch crops.');
      });
  },
};
</script>

<style scoped>
#crop-group {
  min-width: 215px;
}
</style>
