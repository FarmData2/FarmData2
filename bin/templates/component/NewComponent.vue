<template>
  <BFormGroup
    id="component-group"
    data-cy="component-group"
  >
    <!-- Add BootstrapVueNext components here to build this component. -->
    <p data-cy="placeholder">Component content goes here.</p>
  </BFormGroup>
</template>

<script>
// Import any libraries or FarmData2 components being used in this component here.

/**
 * The %COMPONENT_NAME% is ... give a one line description of the component here.
 * 
 * Longer description of the component can go here...
 *
 * ## Live Example
 * 
 * <a href="http://farmos/fd2_examples/%COMPONENT_ID%">The %COMPONENT_NAME% Example</a>
 * 
 * ## Usage Example
 *
 * ```html
 * Include an example of how to add this component to a template.
 * This can often be pulled from the example page for the component.
 * See the other components in the `components` directory for samples.
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * `attr-value`          | describe the purpose of all elements with `data-cy` attributes.
 */
export default {
  name: '%COMPONENT_NAME%',
  components: {
    // List any FarmData2 components being used in this component here.
  },
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
    return {};
  },
  computed: {
    isValid() {
      /*
       * Edit this computed property to return true if the component's value is valid,
       * or false if it is invalid.  A value is valid if it can be submitted to farmOS.  
       * This property should account for whether the value is required or not as necessary.
       * 
       * See other components in the `components/` directory for examples.
       */
      return false;
    },
    // Controls component styling (i.e. when green check or red X and invalid feedback) should be displayed.
    validityStyling() {
      /*
       * Edit this computed property to indicate the type of styling that should be applied 
       * to the component based upon `required`, `isValid`, `showValidityStyling`, and any
       * other criteria that is necessary.
       * 
       * Bind this computed property to the `state` prop of the BootstrapVueNext components 
       * that are used in the template.
       * 
       * See other components in the `components/` directory for examples.
       */
      return false;
    },
  },
  methods: {},
  watch: {
    isValid() {
      /**
       * The validity of the component has changed. Also emitted when the component is created.
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
