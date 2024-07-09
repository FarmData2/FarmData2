<template>
  <div>
    <div
      id="multi-crop-selector-main"
      data-cy="multi-crop-selector-main"
    >
      <label
        id="multi-crop-selector-label"
        data-cy="multi-crop-selector-label"
        >Crop(s)</label
      >
      <div
        id="multi-crop-selector-container"
        data-cy="multi-crop-selector-container"
      >
        <MultiSelectorBase
          id="multi-crop-selector"
          data-cy="multi-crop-selector"
          invalidFeedbackText="One crop must be selected"
          v-bind:required="required"
          v-bind:showValidityStyling="showValidityStyling"
          v-bind:options="cropsList"
          v-bind:selected="selected"
          v-on:update:selected="handleUpdateSelected()"
          v-on:add-clicked="handleAddClicked($event)"
          v-on:valid="handleValid($event)"
          v-bind:popupUrl="popupUrl"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MultiSelectorBase from '@comps/MultiSelectorBase/MultiSelectorBase.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

/**
 * A component for selecting multiple crops. It initially displays a single
 * dropdown for selecting a crop.  When a crop
 * is selected another dropdown appears to allow the user to select
 * another crop.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/multi_crop_selector">The MultiCropSelector Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/multi_crop_selector/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <MultiCropSelector
 *  id="multi-crop-selector"
 *  data-cy="multi-crop-selector"
 *  invalid-feedback-text="Selection cannot be empty."
 *  v-bind:required="required"
 *  v-bind:showValidityStyling="validity.showStyling"
 *  v-bind:selected="form.selected"
 *  v-on:valid="(valid) => (validity.selected = valid)"
 *  v-on:ready="createdCount++"
 *  v-on:error="(msg) => showErrorToast('Network Error', msg)"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name              | Description
 * ----------------------------| -----------
 * multi-crop-selector-main    | The container div for the MultiCropSelector component.
 * multi-crop-selector-label   | The label element for the crop selector.
 * crop-selector-container     | The container div for the individual crop selectors.
 * multi-crop-selector         | The `MultiSelectorBase` component.
 */
export default {
  name: 'MultiCropSelector',
  components: { MultiSelectorBase },
  emits: ['error', 'ready', 'update:selected', 'valid'],
  props: {
    /**
     * Whether a crop selection is required or not. If a
     * crop selection is required then at least one
     * crop must be selected.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * An array of Strings indicating the names of the crop that is selected on each line.
     *
     * This prop is watched and changes are relayed to the component's internal state.
     */
    selected: {
      type: Array,
      default: () => [],
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
      selectedCrops: this.selected,
      valid: null,
      cropsList: [],
      canCreateCrop: false,
      popupUrl: null,
    };
  },
  computed: {
    isValid() {
      return this.valid;
    },
  },
  methods: {
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
        this.selectedCrops.push(newCrop);
        this.handleUpdateSelected();
      }
    },
    async populateCropList() {
      try {
        let cropMap = await farmosUtil.getCropNameToTermMap();
        // Update asset list
        this.cropsList = Array.from(cropMap.keys());
      } catch (error) {
        console.error('Error populating crop map:', error);
      }
    },
    handleValid(event) {
      this.valid = event;
    },
    handleUpdateSelected() {
      /**
       * The selected crops have changed.
       * @property {Array<String>} event the names of the newly selected crops.
       */
      this.$emit('update:selected', this.selectedCrops);
    },
  },
  watch: {
    selected: {
      handler() {
        this.selectedCrops = this.selected;
      },
      deep: true,
    },
    isValid() {
      /**
       * The validity of the multi crop selector changed.
       * @property {boolean} event whether the selected crops are valid or not.
       */
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    let canCreate = farmosUtil.checkPermission('create-plant-asset');
    let cropMap = farmosUtil.getCropNameToTermMap();

    Promise.all([canCreate, cropMap])
      .then(([canCreate, cropMap]) => {
        this.cropsList = Array.from(cropMap.keys());
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
        console.error('MultiCropSelector: Error fetching crops.');
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
#multi-crop-selector-main {
  display: block;
  width: 100%;
  background-color: #ffff;
  box-shadow: none !important;
  margin-top: 8px !important;
  border-style: solid !important;
  border-width: var(--bs-border-width) !important;
  border-color: var(--bs-border-color-translucent) !important;
}

#multi-crop-selector-label {
  display: block;
  text-align: center;
  color: #212529;
  font-size: 1.15rem;
  font-weight: 350;
  border-bottom: solid !important;
  border-width: var(--bs-border-width) !important;
  border-color: var(--bs-border-color-translucent) !important;
  padding-bottom: 2px;
  padding-top: 2px;
  padding-left: 5px !important;
  padding-right: 5px !important;
}
#crop-selector-container {
  padding-left: 5px !important;
  padding-right: 5px !important;
  padding-top: 8px;
}
</style>
