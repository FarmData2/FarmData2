<template>
  <div>
    <NumericInput
      id="soil-disturbance-depth"
      data-cy="soil-disturbance-depth"
      label="Depth (in)"
      invalidFeedbackText="Soil disturbance depth must be non-negative."
      v-model:value="form.depth"
      v-bind:showValidityStyling="validity.show"
      v-bind:decimalPlaces="1"
      v-bind:incDecValues="[1, 6]"
      v-bind:minValue="0"
      v-on:valid="validity.depth = $event"
      v-on:ready="createdCount++"
    />

    <NumericInput
      id="soil-disturbance-speed"
      data-cy="soil-disturbance-speed"
      label="Speed (mph)"
      invalidFeedbackText="Soil disturbance speed must be non-negative."
      v-model:value="form.speed"
      v-bind:showValidityStyling="validity.show"
      v-bind:decimalPlaces="1"
      v-bind:incDecValues="[1, 5]"
      v-bind:minValue="0"
      v-on:valid="validity.speed = $event"
      v-on:ready="createdCount++"
    />
  </div>
</template>

<script>
import NumericInput from '@comps/NumericInput/NumericInput.vue';

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
  name: 'SoilDisturbance',
  components: { NumericInput },
  emits: ['ready', 'valid'],
  props: {
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
  },
  data() {
    return {
      form: {
        depth: 0,
        speed: 0,
      },
      validity: {
        show: false,
        depth: false,
        speed: false,
      },
    };
  },
  computed: {
    isValid() {
      /*
       * Edit this computed property to return true if the component's value is valid,
       * or false if it is invalid.  This should account for whether the value is
       * required or not if necessary.
       */
      return false;
    },
    // Controls component styling (i.e. when green check or red X and invalid feedback) should be displayed.
    validityStyling() {
      /*
       * Edit this computed property to indicted the type of styling that should be applied
       * to the component based upon `required`, `isValid`, `showInvalidStyling`, and any
       * other criteria that is necessary.
       *
       * Bind this computed property to the `state` prop of the components to be styled.
       */
      return false;
    },
  },
  methods: {},
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

<style scoped>
#soil-disturbance-depth {
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
