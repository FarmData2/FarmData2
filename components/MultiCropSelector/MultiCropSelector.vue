<template>
  <BFormGroup
    id="multi-crop-selector"
    data-cy="multi-crop-selector"
    label-cols="auto"
    label-align="end"
  >
    <template v-slot:label>
      <span
        id="multi-crop-selector-label"
        data-cy="multi-crop-selector-label"
        >Crop(s)</span
      >
    </template>

    <div
      id="crop-selector-container"
      data-cy="crop-selector-container"
    >
      <SelectorBase
        v-for="(selectedCrops, i) in ['', ...selectedCrops]"
        v-bind:key="i"
        v-bind:label="String(i + 1)"
        v-bind:id="'crop-selector-' + (i + 1)"
        v-bind:data-cy="'crop-selector-' + (i + 1)"
        invalidFeedbackText="Crop must be selected"
        v-bind:options="cropsList"
        v-bind:required="isRequired(i)"
        v-bind:selected="selected[i]"
        v-bind:showValidityStyling="showValidityStyling"
        v-on:update:selected="handleUpdateSelected($event, i)"
        v-on:valid="handleValid($event, i)"
        v-on:add-clicked="handleAddClicked($event, i)"
        v-bind:popupUrl="includePopupUrl(i)"
      />
    </div>
  </BFormGroup>
</template>

<script>
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

/**
 * A component for selecting multiple crops. It initially displays a single
 * dropdown for selecting a crop.  When a crop
 * is selected another dropdown appears to allow the user to select
 * another crop.
 *
 * ## Usage Example
 *
 * ```html
 * <MultiCropSelector
 *   id="seeding-crop"
 *   data-cy="seeding-crop"
 *   v-model:selected="form.crop"
 *   v-bind:showValidityStyling="validity.show"
 *   v-on:valid="(valid) => (validity.selected = valid)"
 *   v-on:ready="createdCount++"
 *   v-on:error="(msg) => showErrorToast('Network Error', msg)"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name         | Description
 * -----------------------| -----------
 * `crop-selector-i` | The ith `SelectorBase` component (labeled `i:` for i=[1...n]).
 */
export default {
  name: 'MultiCropSelector',
  components: { SelectorBase },
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
      valid: [null],
      cropsList: [],
      canCreateCrop: false,
      popupUrl: null,
    };
  },
  computed: {
    isValid() {
      /*
       * The whole list will be valid if the first
       * SelectorBase has a valid value.
       */
      return this.valid[0];
    },
  },
  methods: {
    includePopupUrl(i) {
      // determine if ith selector should have add button
      if (i == this.selectedCrops.length) {
        return this.popupUrl;
      }
      return null;
    },
    async handleAddClicked(newCrop, i) {
      // when the selector emits the add-clicked event
      // clear the cached crops and repopulate the options
      // to get the newly created crop, then select it

      // If a new asset is provided, update the selected
      if (newCrop) {
        // Clear the cached
        farmosUtil.clearCachedCrops();
        // Populate the map and wait for it to complete
        await this.populateCropList();
        this.handleUpdateSelected(newCrop, i);
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

    isRequired(i) {
      return this.required && (i == 0 || i < this.selectedCrops.length - 1);
    },
    handleUpdateSelected(event, i) {
      if (event === '') {
        // The ith crop was removed.
        this.selectedCrops.splice(i, 1);
        this.valid.splice(i, 1);
      } else {
        this.selectedCrops[i] = event;
      }

      /**
       * The selected crop has changed.
       * @property {Array<String>} event the names of the newly selected crop.
       */
      this.$emit('update:selected', this.selectedCrops);
    },
    handleValid(event, i) {
      this.valid[i] = event;
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
       * The validity of the selected crop changed.
       * @property {boolean} event whether the selected crop is valid or not.
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
