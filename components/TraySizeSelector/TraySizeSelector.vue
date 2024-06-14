<template>
  <div>
    <SelectorBase
      id="tray-size-selector"
      data-cy="tray-size-selector"
      label="Tray Size"
      invalidFeedbackText="A tray size is required"
      v-bind:options="traySizeList"
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
 * The TraySizeSelector component is a UI element that allows the user to select a tray size (i.e. number of cells) for a tray seeding.
 *
 * It fetches the list of tray sizes (farmOS `taxonomy_term--tray_size` records) from the farmOS server.
 *
 * ## Usage Example
 *
 * ```html
 * <TraySizeSelector
 *   id="seeding-tray-size"
 *   data-cy="seeding-tray-size"
 *   required
 *   v-model:selected="form.traySize"
 *   v-bind:showValidityStyling="validity.show"
 *   v-on:valid="validity.traySize = $event"
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
 * tray-size-selector    | The `SelectorBase` component containing the dropdown for the tray sizes.
 */
export default {
  name: 'TraySizeSelector',
  components: { SelectorBase },
  emits: ['error', 'ready', 'update:selected', 'valid'],
  props: {
    /**
     * Whether a tray size selection is required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * The name of the selected tray size.
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
      traySizeList: [],
      canCreateTraySize: false,
      popupUrl: null,
    };
  },
  computed: {},
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
       * The validity of the selected tray size has changed.
       * @property {boolean} event whether the selected tray size is valid or not.
       */
      this.$emit('valid', event);
    },
    async handleAddClicked(newTraySize) {
      // when the selector emits the add-clicked event
      // clear the cached locations and repopulate the options
      // to get the newly created location, then select it
      // If a new asset is provided, update the selected
      if (newTraySize) {
        // Clear the cached
        farmosUtil.clearCachedTraySizes();

        // Populate the map and wait for it to complete
        await this.populateTraySizeList();
        this.handleUpdateSelected(newTraySize);
      }
    },
    async populateTraySizeList() {
      try {
        let trayMap = await farmosUtil.getTraySizeToTermMap();

        // Update asset list
        this.traySizeList = Array.from(trayMap.keys());
      } catch (error) {
        console.error('Error populating tray map:', error);
      }
    },
  },
  watch: {},
  created() {
    let canCreate = farmosUtil.checkPermission('create-terms-in-tray_size');
    let trayMap = farmosUtil.getTraySizeToTermMap();

    Promise.all([canCreate, trayMap])
      .then(([canCreate, trayMap]) => {
        this.traySizeList = Array.from(trayMap.keys());
        this.canCreateTraySize = canCreate;

        if (this.canCreateTraySize) {
          this.popupUrl = '/admin/structure/taxonomy/manage/tray_size/add';
        }

        /**
         * The select has been populated with the list of tray sizes and the component is ready to be used.
         */
        this.$emit('ready');
      })
      .catch((error) => {
        console.error('TraySizeSelector: Error fetching tray sizes.');
        console.error(error);
        /**
         * An error occurred when communicating with the farmOS server.
         * @property {string} msg an error message.
         */
        this.$emit('error', 'Unable to fetch tray sizes.');
      });
  },
};
</script>
