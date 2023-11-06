<template>
  <BFormGroup>
    <p>Component content goes here.</p>
  </BFormGroup>
</template>

<script>
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
  name: '%COMPONENT_NAME%',
  components: {},
  emits: [],
  props: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  watch: {},
  created() {
    /**
     * This component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
