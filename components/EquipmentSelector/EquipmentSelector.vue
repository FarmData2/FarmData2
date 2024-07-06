<template>
  <div>
    <SelectorBase
      v-for="(selectedEquipment, i) in ['', ...selectedEquipment]"
      v-bind:key="i"
      v-bind:id="'equipment-selector-' + (i + 1)"
      v-bind:data-cy="'equipment-selector-' + (i + 1)"
      invalidFeedbackText="Equipment must be selected"
      v-bind:label="String(i + 1)"
      v-bind:options="equipmentList"
      v-bind:required="isRequired(i)"
      v-bind:selected="selected[i]"
      v-bind:showValidityStyling="showValidityStyling"
      v-on:update:selected="handleUpdateSelected($event, i)"
      v-on:valid="handleValid($event, i)"
      v-on:add-clicked="handleAddClicked($event, i)"
      v-bind:popupUrl="includePopupUrl(i)"
    />
  </div>
</template>

<script>
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

/**
 * A component for selecting equipment that was used for an activity
 * (e.g. a direct seeding). The user can select multiple pieces of
 * equipment as necessary.  It initially displays a single
 * dropdown for selecting a piece of equipment.  When a piece of equipment
 * is selected another dropdown appears to allow the user to select
 * another piece of equipment.
 *
 * ## Usage Example
 *
 * ```html
 * <EquipmentSelector
 *   id="seeding-equipment"
 *   data-cy="seeding-equipment"
 *   v-model:selected="form.equipment"
 *   v-bind:showValidityStyling="validity.show"
 *   v-on:valid="validity.equipment = $event"
 *   v-on:ready="createdCount++"
 *   v-on:error="(msg) => showErrorToast('Network Error', msg)"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name         | Description
 * -----------------------| -----------
 * `equipment-selector-i` | The ith `SelectorBase` component (labeled `i:` for i=[1...n]).
 */
export default {
  name: 'EquipmentSelector',
  components: { SelectorBase },
  emits: ['error', 'ready', 'update:selected', 'valid'],
  props: {
    /**
     * Whether an equipment selection is required or not. If an
     * equipment selection is required then at least one piece of
     * equipment must be selected.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * An array of Strings indicating the names of the equipment that is selected on each line.
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
      selectedEquipment: this.selected,
      valid: [null],
      equipmentList: [],
      canCreateEquipment: false,
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
      if (i == this.selectedEquipment.length) {
        return this.popupUrl;
      }
      return null;
    },
    async handleAddClicked(newEquipment, i) {
      // when the selector emits the add-clicked event
      // clear the cached equipment and repopulate the options
      // to get the newly created equipment, then select it

      // If a new asset is provided, update the selected
      if (newEquipment) {
        // Clear the cached
        farmosUtil.clearCachedEquipment();

        // Populate the map and wait for it to complete
        await this.populateEquipmentList();

        this.handleUpdateSelected(newEquipment, i);
      }
    },
    async populateEquipmentList() {
      try {
        let equipmentMap = await farmosUtil.getEquipmentNameToAssetMap();

        // Update asset list
        this.equipmentList = Array.from(equipmentMap.keys());
      } catch (error) {
        console.error('Error populating equipment map:', error);
      }
    },
    isRequired(i) {
      return this.required && i == 0 && this.selectedEquipment.length < 2;
    },
    handleUpdateSelected(event, i) {
      if (event === '') {
        // The ith piece of equipment was removed.
        this.selectedEquipment.splice(i, 1);
        this.valid.splice(i, 1);
      } else {
        this.selectedEquipment[i] = event;
      }

      if (this.selectedEquipment.length == 0) {
        this.valid[0] = !this.required;
      }

      /**
       * The selected equipment has changed.
       * @property {Array<String>} event the names of the newly selected equipment.
       */
      this.$emit('update:selected', this.selectedEquipment);
    },
    handleValid(event, i) {
      this.valid[i] = event;
    },
  },
  watch: {
    selected: {
      handler() {
        this.selectedEquipment = this.selected;
      },
      deep: true,
    },
    isValid() {
      /**
       * The validity of the selected equipment changed.
       * @property {boolean} event whether the selected equipment is valid or not.
       */
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    const canCreate = farmosUtil.checkPermission('create-equipment-asset');
    const equipmentMap = farmosUtil.getEquipmentNameToAssetMap();

    Promise.all([canCreate, equipmentMap])
      .then(([canCreate, equipmentMap]) => {
        this.canCreateEquipment = canCreate;
        this.equipmentList = Array.from(equipmentMap.keys());

        if (this.canCreateEquipment) {
          this.popupUrl = '/asset/add/equipment';
        }
        //Emit the initial valid state of the component's value.
        //this.$emit('valid', this.isValid);

        /**
         * The component is ready for use.
         */
        this.$emit('ready');
      })
      .catch((err) => {
        console.error('EquipmentSelector: Error fetching equipment.');
        console.error(err);
        /**
         * An error occurred loading the equipment.
         */
        this.$emit('error', 'Unable to fetch equipment.');
      });
  },
};
</script>
