<template>
  <div>
    <SelectorBase
      v-bind:id="'equipment-selector-' + (i + 1)"
      v-bind:data-cy="'equipment-selector-' + (i + 1)"
      v-for="(line, i) in [...selected, '']"
      invalidFeedbackText="Equipment must be selected"
      v-bind:label="String(i + 1)"
      v-bind:key="i"
      v-bind:addOptionUrl="addEquipmentUrl(i)"
      v-bind:options="equipmentList"
      v-bind:required="isRequired(i)"
      v-bind:selected="selected[i]"
      v-bind:showValidityStyling="showValidityStyling"
      v-on:update:selected="handleUpdateSelected($event, i)"
      v-on:valid="handleValid($event, i)"
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
 *  v-on:error="(msg) => showErrorToast('Network Error', msg)"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name         | Description
 * -----------------------| -----------
 * `equipment-selector-i` | The ith `SelectorBase` component (labeled `i:`).
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
      valid: [],
      equipmentList: [],
      canCreateEquipment: true,
    };
  },
  computed: {},
  methods: {
    addEquipmentUrl(i) {
      if (i == this.selectedEquipment.length && this.canCreateEquipment) {
        return '/asset/add/equipment';
      } else {
        return null;
      }
    },
    isRequired(i) {
      return this.required && (i == 0 || i < this.selectedEquipment.length - 1);
    },
    handleUpdateSelected(event, i) {
      /*
       * Skip events that are a result of the page setting the
       * selected prop to [] which generates a selected event for
       * the blank ('') first option in SelectorBase.
       */
      if (event != '') {
        this.selectedEquipment[i] = event;

        /**
         * The selected equipment has changed.
         * @property {Array<String>} event the names of the newly selected equipment.
         */
        this.$emit('update:selected', this.selectedEquipment);
      }
    },
    handleValid(event, i) {
      this.valid[i] = event;

      let allValid = false;
      // check if all but the last equipment line is valid
      if (this.selectedEquipment.length == 1) {
        allValid = this.valid[0];
      } else {
        allValid = this.valid
          .slice(0, this.selectedEquipment.length - 1)
          .every((valid) => valid === true);
      }

      /**
       * The validity of the selected equipment changed.
       * @property {boolean} event whether the selected equipment is valid or not.
       */
      this.$emit('valid', allValid);
    },
  },
  watch: {
    selected() {
      this.selectedEquipment = this.selected;
    },
  },
  created() {
    const canCreate = farmosUtil.checkPermission('create-equipment-asset');
    const equipmentMap = farmosUtil.getEquipmentNameToAssetMap();

    Promise.all([canCreate, equipmentMap])
      .then(([canCreate, equipmentMap]) => {
        this.canCreateEquipment = canCreate;
        this.equipmentList = Array.from(equipmentMap.keys());
      })
      .catch((err) => {
        console.error('EquipmentSelector: Error fetching equipment.');
        console.error(err);
        this.$emit('error', 'Unable to fetch locations.');
      });

    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
