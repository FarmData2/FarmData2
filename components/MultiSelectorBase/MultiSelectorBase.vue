<template>
  <div>
    <SelectorBase
      v-for="(item, i) in ['', ...selectedItems]"
      v-bind:key="i"
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
 * `selector-i` | The ith `SelectorBase` component (labeled `i:` for i=[1...n]).
 */
export default {
  name: 'MultiSelectorBase',
  components: { SelectorBase },
  emits: ['update:selected', 'add-clicked', 'valid', 'error', 'ready'],
  props: {
    invalidFeedbackText: {
      type: String,
      default: 'Selection must be made',
    },
    required: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Array,
      default: () => [],
    },
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    popupUrl: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      selectedItems: this.selected,
      valid: [null],
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
       * payload arrived from the selector base component. The purpose
       * of this is to relay the information to the parent component
       * which handles add-clicked event
       * @property {String} event the payload from SelectorBase
       */
      this.$emit('add-clicked', event);
    },
    handleUpdateSelected(event, i) {
      if (event === '' || event === null) {
        this.selectedItems.splice(i, 1);
        this.valid.splice(i, 1);
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
