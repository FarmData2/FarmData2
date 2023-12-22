<template>
  <div>
    <SelectorBase
      id="tray-size-selector"
      data-cy="tray-size-selector"
      label="Tray Size"
      invalidFeedbackText="A tray size is required"
      v-bind:addOptionUrl="addTraySizeUrl"
      v-bind:options="traySizeList"
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
    };
  },
  computed: {
    addTraySizeUrl() {
      if (this.canCreateTraySize) {
        return '/admin/structure/taxonomy/manage/tray_size/add';
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
       * The validity of the selected tray size has changed.
       * @property {boolean} event whether the selected tray size is valid or not.
       */
      this.$emit('valid', event);
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
