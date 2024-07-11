<template>
  <div>
    <MultiSelectorBase
      id="multi-equipment-selector"
      data-cy="multi-equipment-selector"
      invalidFeedbackText="One equipment must be selected"
      v-bind:required="required"
      v-bind:showValidityStyling="showValidityStyling"
      v-bind:options="equipmentList"
      v-bind:selected="selected"
      v-on:update:selected="handleUpdateSelected()"
      v-on:add-clicked="handleAddClicked($event)"
      v-on:valid="handleValid($event)"
      v-bind:popupUrl="popupUrl"
    />
  </div>
</template>

<script>
import MultiSelectorBase from '@comps/MultiSelectorBase/MultiSelectorBase.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

/**
 * A component for selecting equipment that was used for an activity
 * (e.g. a direct seeding). The user can select multiple pieces of
 * equipment as necessary.  It initially displays a single
 * dropdown for selecting a piece of equipment.  When a piece of equipment
 * is selected another dropdown appears to allow the user to select
 * another piece of equipment.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/equipment_selector">The EquipmentSelector Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/equipment_selector/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <EquipmentSelector
 *   id="equipment-selector"
 *   data-cy="equipment-selector"
 *   invalid-feedback-text="Selection cannot be empty."
 *   v-bind:required="required"
 *   v-bind:showValidityStyling="validity.showStyling"
 *   v-bind:selected="form.selected"
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
 * Attribute Name             | Description
 * ---------------------------| -----------
 * `equipment-multi-selector` | The  `MultiSelectorBase` component.
 */
export default {
  name: 'EquipmentSelector',
  components: { MultiSelectorBase },
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
      valid: null,
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
      return this.valid;
    },
  },
  methods: {
    async handleAddClicked(newEquipment) {
      // when the selector emits the add-clicked event
      // clear the cached equipment and repopulate the options
      // to get the newly created equipment, then select it

      // If a new asset is provided, update the selected
      if (newEquipment) {
        // Clear the cached
        farmosUtil.clearCachedEquipment();

        // Populate the map and wait for it to complete
        await this.populateEquipmentList();

        this.selectedEquipment.push(newEquipment);
        this.handleUpdateSelected();
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
    handleUpdateSelected() {
      /**
       * The selected equipment has changed.
       * @property {Array<String>} event the names of the newly selected equipment.
       */
      this.$emit('update:selected', this.selectedEquipment);
    },
    handleValid(event) {
      this.valid = event;
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
