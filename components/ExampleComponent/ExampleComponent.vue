<template>
  <div>
    <BFormGroup
      id="component-group"
      data-cy="component-group"
    >
      <p
        id="placeholder"
        data-cy="placeholder"
      >
        Replace this `p` element with your component content.
      </p>
    </BFormGroup>
  </div>
</template>

<script>
/**
 * The ExampleComponent is ... give a one line description of the component here.
 *
 * Longer description of the component can go here...
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/example_component">The ExampleComponent Example</a>
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
  name: 'ExampleComponent',
  components: {},

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
      return false;
    },
    validityStyling() {
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
    this.$emit('valid', this.isValid);

    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
