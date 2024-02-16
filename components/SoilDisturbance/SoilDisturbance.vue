<template>
  <BFormGroup
    id="soil-disturbance-group"
    data-cy="soil-disturbance-group"
  >
    <!-- Equipment -->
    <EquipmentSelector
      id="soil-disturbance-equipment-selector"
      data-cy="soil-disturbance-equipment-selector"
      v-bind:showValidityStyling="showValidityStyling"
      v-model:selected="form.equipment"
      v-bind:required="required"
      v-on:update:selected="handleEquipmentUpdate()"
      v-on:valid="validity.equipment = $event"
      v-on:error="handleError(msg)"
      v-on:ready="equipmentSelectorReady()"
    />

    <!-- Soil Disturbance Depth -->
    <NumericInput
      id="soil-disturbance-depth"
      data-cy="soil-disturbance-depth"
      v-if="form.equipment.length > 0"
      required
      label="Depth (in)"
      invalidFeedbackText="Depth must be a non-negative number."
      v-model:value="form.depth"
      v-bind:showValidityStyling="showValidityStyling"
      v-bind:decimalPlaces="1"
      v-bind:incDecValues="[1, 6]"
      v-bind:minValue="0"
      v-on:update:value="handleDepthUpdate()"
      v-on:valid="validity.depth = $event"
    />

    <!-- Soil Disturbance Speed -->
    <NumericInput
      id="soil-disturbance-speed"
      data-cy="soil-disturbance-speed"
      v-if="form.equipment.length > 0"
      required
      label="Speed (mph)"
      invalidFeedbackText="Speed must be a non-negative number."
      v-model:value="form.speed"
      v-bind:showValidityStyling="showValidityStyling"
      v-bind:decimalPlaces="1"
      v-bind:incDecValues="[1, 5]"
      v-bind:minValue="0"
      v-on:update:value="handleSpeedUpdate()"
      v-on:valid="validity.speed = $event"
    />

    <!-- Soil Disturbance % of Area -->
    <NumericInput
      id="soil-disturbance-area"
      data-cy="soil-disturbance-area"
      v-if="form.equipment.length > 0"
      required
      label="Area (%)"
      invalidFeedbackText="Area must be a positive number."
      v-model:value="form.area"
      v-bind:showValidityStyling="showValidityStyling"
      v-bind:decimalPlaces="0"
      v-bind:incDecValues="[5, 10, 25]"
      v-bind:minValue="1"
      v-bind:maxValue="100"
      v-on:update:value="handleAreaUpdate()"
      v-on:valid="validity.area = $event"
    />

    <!-- Soil Disturbance Number of Passes -->
    <NumericInput
      id="soil-disturbance-passes"
      data-cy="soil-disturbance-passes"
      v-if="form.equipment.length > 0 && includePasses"
      required
      label="Passes"
      invalidFeedbackText="Passes must be a positive number."
      v-model:value="form.passes"
      v-bind:showValidityStyling="showValidityStyling"
      v-bind:decimalPlaces="0"
      v-bind:incDecValues="[1]"
      v-bind:minValue="1"
      v-on:update:value="handlePassesUpdate()"
      v-on:valid="validity.passes = $event"
    />
  </BFormGroup>
</template>

<script>
import EquipmentSelector from '@comps/EquipmentSelector/EquipmentSelector.vue';
import NumericInput from '@comps/NumericInput/NumericInput.vue';

/**
 * The SoilDisturbance component collects data on soil disturbances, including
 * the equipment used, depth of the disruption, the speed of the disruption and
 * the percentage of the area affected.
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
 * Attribute Name                        | Description
 * --------------------------------------| -----------
 * `soil-disturbance-group`              | The `BFormGroup` element containing all of the sub-components.
 * `soil-disturbance-equipment-selector` | The `EquipmentSelector` component.
 * `soil-disturbance-depth`              | The `NumericInput` component for the depth of the disruption.
 * `soil-disturbance-speed`              | The `NumericInput` component for the speed of the disruption.
 * `soil-disturbance-area`               | The `NumericInput` component for the percentage of the area
 * `soil-disturbance-passes`             | The `NumericInput` component for the number of passes over the area.
 */
export default {
  name: 'SoilDisturbance',
  components: { EquipmentSelector, NumericInput },
  emits: [
    'error',
    'ready',
    'update:area',
    'update:depth',
    'update:equipment',
    'update:passes',
    'update:speed',
    'valid',
  ],
  props: {
    /**
     * The percentage of the selected location that was affected by the soil disturbance.
     */
    area: {
      type: Number,
      default: 100,
    },
    /**
     * The depth of the soil disturbance.
     */
    depth: {
      type: Number,
      default: 0,
    },
    /**
     * An array of Strings indicating the names of the equipment that is selected on each line.
     */
    equipment: {
      type: Array,
      default: () => [],
    },
    /**
     * Whether to include an input area for the number of passes over the area.
     */
    includePasses: {
      type: Boolean,
      default: false,
    },
    /**
     * The number of passes that were made over the area affected by the soil disturbance.
     */
    passes: {
      type: Number,
      default: 1,
    },
    /**
     * Whether a value for the input element is required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether validity styling should appear on input elements.
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
    /**
     * The speed at which the soil disturbance occurred.
     */
    speed: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        equipment: this.equipment,
        depth: this.depth,
        speed: this.speed,
        area: this.area,
        passes: this.passes,
      },
      validity: {
        ready: false,

        /*
         * Initialize these to null to ensure that the valid event is emitted
         * on creation whether isValid is true or false.
         */
        equipment: null,
        depth: null,
        speed: null,
        area: null,
        passes: null,
      },
      createdCount: 0,
    };
  },
  computed: {
    isValid() {
      if (this.form.equipment.length === 0) {
        return this.validity.equipment;
      } else if (!this.includePasses) {
        return (
          this.validity.equipment &&
          this.validity.depth &&
          this.validity.speed &&
          this.validity.area
        );
      } else {
        return (
          this.validity.equipment &&
          this.validity.depth &&
          this.validity.speed &&
          this.validity.area &&
          this.validity.passes
        );
      }
    },
  },
  methods: {
    handleEquipmentUpdate() {
      /**
       * The list of selected equipment has changed.
       *
       * @property {Array<string>} equipment An array of the names of the selected equipment.
       */
      this.$emit('update:equipment', this.form.equipment);
    },
    handleDepthUpdate() {
      /**
       * The depth of the soil disruption has changed.
       *
       * @property {number} depth The new depth of the soil disruption.
       */
      this.$emit('update:depth', this.form.depth);
    },
    handleSpeedUpdate() {
      /**
       * The speed of the soil disruption has changed.
       *
       * @property {number} speed The new speed of the soil disruption.
       */
      this.$emit('update:speed', this.form.speed);
    },
    handleAreaUpdate() {
      /**
       * The area of the soil disruption has changed.
       *
       * @property {number} area The new area of the soil disruption.
       */
      this.$emit('update:area', this.form.area);
    },
    handlePassesUpdate() {
      /**
       * The number of passes has changed.
       *
       * @property {number} passes The new number of passes.
       */
      this.$emit('update:passes', this.form.passes);
    },
    handleError(msg) {
      /**
       * An error occurred loading the equipment.
       */
      this.$emit('error', msg);
    },
    equipmentSelectorReady() {
      /**
       * The component is ready for use.
       */
      this.$emit('ready');
    },
  },
  watch: {
    isValid() {
      if (this.isValid != null) {
        /**
         * The validity of the component has changed.
         * @property {Boolean} valid `true` if the component's value is valid; `false` if it is invalid.
         */
        this.$emit('valid', this.isValid);
      }
    },
    equipment() {
      this.form.equipment = this.equipment;
    },
    depth() {
      this.form.depth = this.depth;
    },
    speed() {
      this.form.speed = this.speed;
    },
    area() {
      this.form.area = this.area;
    },
    passes() {
      this.form.passes = this.passes;
    },
  },
  created() {},
};
</script>

<style scoped>
#soil-disturbance-depth,
#soil-disturbance-speed,
#soil-disturbance-area,
#soil-disturbance-passes {
  margin-top: 8px;
}
</style>
