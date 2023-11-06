<template>
  <BFormGroup
    id="new-comp-group"
    data-cy="new-comp-group"
    label-for="new-comp-select"
    label-cols="auto"
    label-align="end"
    content-cols="auto"
  >
    <template v-slot:label>
      <span data-cy="new-comp-label">Pick one:</span>
      <sup
        data-cy="required-star"
        v-if="required"
        class="text-danger"
        >*</sup
      >
    </template>

    <BFormSelect
      id="new-comp-select"
      data-cy="new-comp-select"
      v-model="itemPicked"
      aria-describedby="new-comp-help"
      v-bind:required="required"
    />

    <BFormText
      id="new-comp-help"
      data-cy="new-comp-help"
      >{{ helpText }}</BFormText
    >
  </BFormGroup>
</template>

<script>
import { BFormSelect } from 'bootstrap-vue-next';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

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
 * `new-comp-group`      | The `BFormGroup` component containing this component.
 * `new-comp-label`      | The `span` component containing the "Crop" label.
 * `required-star`       | The `*` that appears in the label if the input is required.
 * `new-comp-button'     | The `BButton` component included in the sample template.
 * `new-comp-help`       | The `BFormText` component that displays the help text below the `BButton` component.
 */
export default {
  name: 'NewComponent',
  components: { BFormSelect },
  emits: [],
  props: {
    /**
     * Whether values are required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Help text that appears below the select element.
     */
    helpText: {
      type: String,
      default: 'Select item.',
    },
    /**
     * The name of the selected item.
     * This prop is watched by the component.
     */
    selected: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      itemList: ['Apple', 'Banana', 'Orange'],
      itemPicked: this.selected,
    };
  },
  computed: {},
  methods: {},
  watch: {
    crop() {
      /**
       * The selected item has changed.
       * @property {string} itemPicked the name of the newly selected item.
       */
      this.$emit('update:selected', this.itemPicked);
    },
    selected() {
      this.itemPicked = this.selected;
    },
  },
  created() {
    /**
     * This component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
