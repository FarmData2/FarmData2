<template>
  <BFormGroup
    id="text-group"
    data-cy="text-group"
    v-bind:label="label"
    label-for="text-text"
    label-cols="auto"
  >
    <template v-slot:label>
      <span data-cy="text-label">{{ label }}:</span>
    </template>
    <BFormInput
      id="text-text"
      data-cy="text-text"
      disabled
      v-model="displayText"
    />
  </BFormGroup>
</template>

<script>
/**
 * A TextDisplay component provides a UI element for displaying a labeled text string.
 *
 * The text is displayed in a disabled `<BFormInput>` element.
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
 * `text-group`          | the `BFormGroup` component containing the text display.
 * `text-label`          | the `span` component containing the label for the displayed text.
 * `text-text`           | the disabled `BFormInput` component used to display the text.
 */
export default {
  name: 'TextDisplay',
  components: {},
  emits: ['ready'],
  props: {
    /**
     * The label for the text that is displayed.
     */
    label: {
      type: String,
      required: true,
    },
    /**
     * The text that is to be displayed.
     */
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      displayText: this.text,
    };
  },
  computed: {},
  methods: {},
  watch: {},
  created() {
    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
