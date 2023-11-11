<template>
  <BFormGroup
    id="selector-group"
    data-cy="selector-group"
    label-for="crop-select"
    label-cols="auto"
    label-align="end"
    content-cols="9"
    content-cols-sm="auto"
  >
    <template v-slot:label>
      <span data-cy="selector-label">{{ label }}:</span>
      <sup
        data-cy="selector-required"
        class="text-danger"
        v-if="required"
        >*</sup
      >
    </template>

    <BInputGroup>
      <BFormSelect
        id="selector-input"
        data-cy="selector-input"
        v-model="selectedOption"
        v-bind:state="validationStyling"
        v-bind:required="required"
      >
        <template v-slot:first>
          <BFormSelectOption
            disabled
            data-cy="selector-option-0"
            key="null"
            value=""
          />
        </template>
        <BFormSelectOption
          v-for="(option, i) in optionList"
          v-bind:key="option"
          v-bind:value="option"
          v-bind:data-cy="'selector-option-' + (i + 1)"
        >
          {{ option }}
        </BFormSelectOption>
      </BFormSelect>
      <BInputGroupAppend v-if="addOptionUrl != null">
        <BButton
          data-cy="selector-add-button"
          variant="info"
          v-bind:href="addOptionUrl"
          >+</BButton
        >
      </BInputGroupAppend>
      <BFormInvalidFeedback
        id="selector-invalid-feedback"
        data-cy="selector-invalid-feedback"
        v-bind:state="validationStyling"
      >
        {{ invalidFeedbackText }}
      </BFormInvalidFeedback>
    </BInputGroup>
  </BFormGroup>
</template>

<script>
import * as uiUtil from '@libs/uiUtil/uiUtil.js';

/**
 * The SelectorBase component is a base component used to build other components
 * that provide a dropdown menu for the user to choose from a list of options.
 *
 * It encapsulates the UI/UX for dropdown menu components, helping to ensure that
 * they are consistent across all dropdowns.  Sub-components that use this base
 * component will define and pass through props, set the list of items and optionally
 * a URL for adding new options.
 *
 * See any of the `*Selector` components for examples of how this component
 * can be used.
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
 * Attribute Name            | Description
 * --------------------------| -----------
 * selector-group            | The `BFormGroup` component containing this component.
 * selector-label            | The `span` component containing the dropdown label.
 * selector-required         | The `*` that appears in the label if the input is required.
 * selector-input            | The `BFormSelect` component used to select an option.
 * selector-option-0         | The disabled blank option that appears first in the `BFormSelect` component.
 * selector-option-n         | The nth option in the `BFormSelect` component [1...n].
 * selector-add-button       | The `BButton` component that redirects to the page for adding a new option.
 * selector-invalid-feedback | The `BFormInvalidFeedback` component that displays help when input is invalid.
 */
export default {
  name: 'SelectorBase',
  components: {},
  emits: ['ready', 'update:selected', 'valid'],
  props: {
    /**
     * The URL of the form for adding a new option.
     *
     * If this prop is `null`, no "+" button will appear on the select.
     * If this prop is set then, a "+" button is displayed and will redirect to the provided URL when clicked.
     */
    addOptionUrl: {
      type: String,
      default: null,
    },
    /**
     * The text to display if the input is invalid.
     */
    invalidFeedbackText: {
      type: String,
      required: true,
    },
    /**
     * The label for the dropdown.
     */
    label: {
      type: String,
      required: true,
    },
    /**
     * The list of options for the dropdown.
     */
    options: {
      type: Array,
      required: true,
    },
    /**
     * Whether a value for the input element is required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * The name of the selected item.
     *
     * This prop is watched and changes are relayed to the component's internal state.
     */
    selected: {
      type: String,
      default: '',
    },
    /**
     * Whether validity styling should appear on the dropdown.
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      optionList: this.options,
      selectedOption: this.selected,
    };
  },
  computed: {
    isValid() {
      /*
       * A dropdown is valid when:
       *   - It is not required.
       *   - Any option other than the null item is selected.
       */
      if (!this.required) {
        return true;
      } else {
        return this.selectedOption != '';
      }
    },
    // Controls component styling (i.e. when green check or red X and invalid feedback) should be displayed.
    validationStyling() {
      return uiUtil.validityStyling(this.isValid, this.showValidityStyling);
    },
  },
  methods: {},
  watch: {
    selectedOption() {
      /**
       * The selected option has changed.
       * @property {String} option the name of the newly selected option.
       */
      this.$emit('update:selected', this.selectedOption);
    },
    selected() {
      this.selectedOption = this.selected;
    },
    isValid() {
      /**
       * The validity of the component has changed.  Also emitted when the component is created.
       * @property {Boolean} valid `true` if an option is selected; `false` if not.
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
