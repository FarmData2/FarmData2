<template>
  <div>
    <SelectorBase
      v-for="(item, i) in ['', ...selectedItems]"
      v-bind:key="i"
      v-bind:id="'selector-' + (i + 1)"
      v-bind:data-cy="'selector-' + (i + 1)"
      v-bind:invalidFeedbackText="invalidFeedbackText"
      v-bind:label="String(i + 1)"
      v-bind:options="optionsList"
      v-bind:required="isRequired(i)"
      v-bind:selected="selected[i]"
      v-bind:showValidityStyling="showValidityStyling"
      v-on:update:selected="handleUpdateSelected($event, i)"
      v-on:valid="handleValid($event, i)"
      v-bind:popupUrl="includePopupUrl(i)"
    />
  </div>
</template>

<script>
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';

export default {
  name: 'MultiSelectorBase',
  components: { SelectorBase },
  emits: ['update:selected', 'valid', 'error', 'ready'],
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
    optionsList: {
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
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    this.$emit('ready');
  },
};
</script>
