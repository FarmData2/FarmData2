<template>
  <!-- This extra div element is included to help with consistency in the 
       tests.  Without it the BFormGroup can sometimes be optimized away 
       making tests that use it in cy.get statements fail. 
  -->
  <div>
    <BFormGroup
      id="component-group"
      data-cy="component-group"
    >
      <!-- Add BootstrapVueNext components here to build this component. 
          Other components in the `components/` directory provide useful examples.

          Every element that might be used in a test should have an `id` and a 
          `data-cy` attribute.  The value of these attributes should be the same.
      -->
      <p 
        id="placeholder" 
        data-cy="placeholder">
          Replace this `p` element with your component content.
      </p>
    </BFormGroup>
  </div>
</template>

<script>
/*
 * Import any libraries or FarmData2 components being used in this component here.
 * BootstrapVueNext components are imported automatically and do not need to be imported here.
 */

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
 * `component-group`     | The `BFormGroup` component containing this component.
 * `attr-value`          | Describe the purpose of all elements with `data-cy` attributes.
 */
export default {
  name: '%COMPONENT_NAME%',
  components: {
    /*
     * List any FarmData2 components being used in this component here.
     * It is not necessary to list BootstrapVueNext components.
     */
  },
  /*
   * Every component must emit a `ready` event and `valid` events. The `ready` event
   * indicates when the component is fully initialized and ready for use. The `valid` 
   * event indicates when the validity of component's value changes (see the `isValid`
   * computed property below).
   */
  emits: ['ready', 'valid'],
  props: {
    /*
     * Every component must have props for `required` and `showValidityStyling`. The
     * `required` prop indicates whether the values of the component are required or not. 
     * The `showValidityStyling` prop indicates whether validity styling should be shown for 
     * the component (see the `validityStyling` computed property below).
     */

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
    /*
     * Add other props here as necessary.  Each prop must have a 
     * doc comment (see above for examples) wit a one line description
     * of what the prop does. The doc comment is used when the 
     * documentation for the component is generated.
     */
  },
  data() {
    return {};
  },
  computed: {
    isValid() {
      /*
       * This computed property must return true if the component's value is valid,
       * and false if it is invalid.  A value is generally considered valid if it 
       * can be submitted to farmOS. This property should account for whether the 
       * value is required or not. For example, an empty value is not valid if the 
       * component is required, but it is valid if the component is not required.
       * 
       * Other components in the `components/` directory provide useful examples of
       * how to implement this property.
       */
      return false;
    },
    validityStyling() {
      /*
       * This computed property indicates the type of validity styling 
       * (none, red X, green checkmark) that should be applied to the component 
       * based on the `showValidityStyling` prop and whether the component's value 
       * is valid or not.
       * 
       * This computation is typically based upon `required`, `isValid`, `showValidityStyling`, 
       * and other criteria that is necessary. The value mus be `true` to display the
       * green checkmark, `false` to display the red X, and `null` to not display any 
       * validity styling. 
       * 
       * This computed property is typically bound (v-bind) to the `state` prop 
       * of the BootstrapVueNext components that are used in the template.
       * 
       * Other components in the `components/` directory provide useful examples of
       * how to implement this property.
       */
      return false;
    },
  },
  methods: {},
  watch: {
    isValid() {
      /*
       * Each emitted event must have a doc comment before it describing the event and
       * a @property tag describing the payload. If an event is emitted at multiple locations
       * it is only necessary to include this comment on the first emit statement.
       */

      /**
       * The validity of the component has changed. Also emitted when the component is created.
       * @property {Boolean} valid `true` if the component's value is valid; `false` if it is invalid.
       */
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    /*
     * Add any initialization code here. This is typically calls to functions in the
     * `farmosUtil` library to retrieve data needed by the component from farmOS. For
     * example, a list of crops, locations or active plant assets.
     * 
     * Other components in the `components/` directory provide useful examples of
     * how to implement these calls.
     */

    /*
     * After the component is initialized, emit the initial valid state of 
     * the component. Note: No doc comment is needed here because it was
     * documented above in the `watch` on the `isValid` computed property.
     */
    this.$emit('valid', this.isValid);

    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
