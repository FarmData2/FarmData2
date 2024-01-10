<template>
  <div>
    <SelectorBase
      id="equipment-selector"
      data-cy="equipment-selector"
      label="Equipment"
      invalidFeedbackText="Equipment must be selected"
      v-bind:addOptionUrl="addEquipmentUrl"
      v-bind:options="equipmentList"
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
//import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

/**
 * A new component.
 *
 * ## Usage Example
 *
 * ```html
 * Add example of how to add this component to a template.
 * See the other components in the `components` directory for examples.
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * `attr-value`          | identify element with the `data-cy="attr-value"`
 */
export default {
  name: 'EquipmentSelector',
  components: { SelectorBase },
  emits: ['error', 'ready', 'update:selected', 'valid'],
  props: {
    /**
     * Whether a value for the input element is required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },

    /* TODO: NEED TO KNOW HOW TO SELECT MULTIPLE ELEMENTS. Is it an array? */
    /**
     * The name of the selected equipment.
     * This prop is watched and changes are relayed to the component's internal state.
     */
    selected: {
      type: Array,
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
      equipmentList: ['A', 'B', 'C'],
      canCreateEquipment: false,
    };
  },
  computed: {
    addEquipmentUrl() {
      if (this.canCreateEquipment) {
        return '/asset/add/equipment';
      } else {
        return null;
      }
    },
  },
  methods: {
    handleUpdateSelected(event) {
      /* TODO: Does this emit an array????? */

      /**
       * The selected equipment has changed.
       * @property {Array<String>} event the names of the newly selected equipment.
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
  watch: {
    isValid() {
      /**
       * The validity of the component has changed.  Also emitted when the component is created.
       * @property {Boolean} valid `true` if the component's value is valid; `false` if it is invalid.
       */
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    //Emit the initial valid state of the component's value.
    this.$emit('valid', this.isValid);

    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
