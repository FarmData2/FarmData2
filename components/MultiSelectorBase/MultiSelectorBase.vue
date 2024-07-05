<template>
  <div>
    <SelectorBase
      v-for="(item, i) in ['', ...selectedItems]"
      v-bind:key="i + 'extra' + keyExtra"
      v-bind:id="'selector-' + (i + 1)"
      v-bind:data-cy="'selector-' + (i + 1)"
      v-bind:invalidFeedbackText="invalidFeedbackText"
      v-bind:label="String(i + 1)"
      v-bind:options="options"
      v-bind:required="isRequired(i)"
      v-bind:selected="selected[i]"
      v-bind:showValidityStyling="showValidityStyling"
      v-on:update:selected="handleUpdateSelected($event, i)"
      v-on:add-clicked="handleAddClicked($event)"
      v-on:valid="handleValid($event, i)"
      v-bind:popupUrl="includePopupUrl(i)"
    />
  </div>
</template>

<script>
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';
/**
 * A component for selecting multiple items. It initially displays a single
 * dropdown.  When an item is selected another dropdown appears to allow
 * the user to select another item.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/multi_selector_base">The MultiSelectorBase Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/multi_selector_base/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
  <MultiSelectorBase
    id="multi-selector-base"
    data-cy="multi-selector-base"
    invalid-feedback-text="Selection cannot be empty."
    v-bind:required="required"
    v-bind:showValidityStyling="validity.showStyling"
    v-bind:selected="form.selected"
    v-bind:options="options"
    v-bind:popupUrl="popupUrl"
    v-on:valid="
      (valid) => {
        validity.selected = valid;
      }
    "
    v-on:ready="createdCount++"
    v-on:error="(msg) => showErrorToast('Network Error', msg)"
  />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name              | Description
 * ----------------------------| -----------
 * `selector-i`                | The ith `SelectorBase` component (labeled `i:` for i=[1...n]).
 */
export default {
  name: 'MultiSelectorBase',
  components: { SelectorBase },
  emits: ['update:selected', 'add-clicked', 'valid', 'error', 'ready'],
  props: {
    /**
     * The text to display if the input is invalid.
     */
    invalidFeedbackText: {
      type: String,
      default: 'Selection must be made',
    },
    /**
     * Whether a value for the multi-selector is required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * The name(s) of the selected item(s) as an array.
     *
     * This prop is watched and changes are relayed to the component's internal state.
     */
    selected: {
      type: Array,
      default: () => [],
    },
    /**
     * Whether validity styling should appear on the dropdown.
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
    /**
     * The list of options for the dropdown.
     *
     * The options shown will update if the prop is set to a new array.
     *
     * However, the options shown will not change if only the contents of the array are changed.
     */
    options: {
      type: Array,
      default: () => [],
    },
    /**
     * The URL of the form for adding a new option.
     *
     * If this prop is `null`, no "+" button will appear on the select.
     * If this prop is set then, a "+" button is displayed and will redirect to the provided URL when clicked.
     */
    popupUrl: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      selectedItems: this.selected,
      valid: [null],
      keyExtra: 0, //used for refreshing SelectorBase
    };
  },
  computed: {
    isValid() {
      return this.valid[0];
    },
  },
  methods: {
    includePopupUrl(i) {
      return i === this.selectedItems.length ? this.popupUrl : null;
    },
    isRequired(i) {
      return this.required && i === 0 && this.selectedItems.length < 2;
    },
    handleAddClicked(event) {
      /**
       * The add button was clicked. This event is emitted with whatever
       * payload arrived from the SelectorBase component. The purpose
       * of this is to relay the information to the child component
       * which handles the add-clicked event
       * @property {String} event the payload from SelectorBase
       */
      this.$emit('add-clicked', event);
    },
    handleUpdateSelected(event, i) {
      if (event === '' || event === null) {
        this.selectedItems.splice(i, 1);
        this.valid.splice(i, 1);
        this.keyExtra++;
        /**
         * We set the key attribute of SelectorBase using keyExtra. When the selectedItems list is
         * spliced(during a delete), we change keyExtra, thus changing every SelectorBase key, causing
         * the SelectorBase to refresh causing their selectedOption property to update.
         * Solves the issue of the selectedOption property of SelectorBase not updating.
         *
         * see for more details:
         * https://michaelnthiessen.com/force-re-render/#the-best-way-the-key-changing-technique
         */
      } else {
        this.selectedItems[i] = event;
      }

      if (this.selectedItems.length === 0) {
        this.valid[0] = !this.required;
      }
      /**
       * The selected items have changed.
       * @property {Array<String>} event the names of the newly selected items.
       */
      this.$emit('update:selected', this.selectedItems);
    },
    handleValid(event, i) {
      this.valid[i] = event;
    },
  },
  watch: {
    selected: {
      handler() {
        this.selectedItems = this.selected;
      },
      deep: true,
    },
    isValid() {
      /**
       * The validity of the selected item changed.
       * @property {boolean} event whether the selected item is valid or not.
       */
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    /**
     * The component is ready to be used.
     */
    this.$emit('ready');
  },
};
</script>
