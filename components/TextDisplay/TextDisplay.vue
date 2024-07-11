<template>
  <div>
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
        plaintext
        v-model="processedText"
      />
    </BFormGroup>
  </div>
</template>

<script>
/**
 * A TextDisplay component provides a UI element for displaying a labeled text string.
 *
 * The text is displayed in a disabled `<BFormInput>` element.
 *
 * If the `text` prop is `null` or is the string `'NaN'`, the text will be displayed as an empty string.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/text_display">The TextDisplay Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/text_display/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <TextDisplay
 *   id="text-display"
 *   data-cy="text-display"
 *   label="TextDisplay"
 *   v-model:text="this.text"
 *   v-on:ready="createdCount++"
 * />
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
     *
     * This prop is reactive and the displayed contents will update when it is changed.
     */
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    processedText() {
      if (this.text == null || this.text == 'NaN') {
        return '';
      } else {
        return this.text;
      }
    },
  },
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
