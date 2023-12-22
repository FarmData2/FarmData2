<template>
  <div>
    <SelectorBase
      id="crop-selector"
      data-cy="crop-selector"
      label="Crop"
      invalidFeedbackText="A crop is required"
      v-bind:addOptionUrl="addCropUrl"
      v-bind:options="cropList"
      v-bind:required="required"
      v-bind:selected="selected"
      v-bind:showValidityStyling="showValidityStyling"
      v-on:update:selected="handleUpdateSelected($event)"
      v-on:valid="handleValid($event)"
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
 * ## Usage Example
 *
 * ```html
 * <CropSelector
 *   required
 *   v-model:selected="form.crop"
 *   v-bind:showInvalidStyling="validity.show"
 *   v-on:valid="validity.crop = $event"
 *   v-on:ready="createdCount++"
 *   v-on:error="
 *     (msg) =>
 *       uiUtil.showToast('Network Error', msg, 'top-center', 'danger', 5)
 *   "
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
    };
  },
  computed: {
    addCropUrl() {
      if (this.canCreateCrop) {
        return '/admin/structure/taxonomy/manage/plant_type/add';
      } else {
        return null;
      }
    },
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
  },
  watch: {},
  created() {
    let canCreate = farmosUtil.checkPermission('create-plant-asset');
    let cropMap = farmosUtil.getCropNameToTermMap();

    Promise.all([canCreate, cropMap])
      .then(([canCreate, cropMap]) => {
        this.cropList = Array.from(cropMap.keys());
        this.canCreateCrop = canCreate;

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
