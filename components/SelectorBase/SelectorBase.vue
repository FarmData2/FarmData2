<template>
  <div>
    <BFormGroup
      id="selector-group"
      data-cy="selector-group"
      label-for="selector-input"
      label-cols="auto"
      label-align="end"
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
          v-bind:state="validityStyling"
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
            v-for="(option, i) in options"
            v-bind:key="option"
            v-bind:value="option"
            v-bind:data-cy="'selector-option-' + (i + 1)"
          >
            {{ option }}
          </BFormSelectOption>
        </BFormSelect>
        <BInputGroupAppend>
          <BButton
            v-if="addOptionUrl != null"
            id="selector-add-button"
            data-cy="selector-add-button"
            variant="outline-success"
            v-bind:href="addOptionUrl"
            >+</BButton
          >
          <BButton
            v-if="!required && selectedOption != '' && selectedOption != null"
            id="selector-delete-button"
            data-cy="selector-delete-button"
            variant="outline-warning"
            v-on:click="handleDelete()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
              />
              <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
              />
            </svg>
          </BButton>
        </BInputGroupAppend>
        <BFormInvalidFeedback
          id="selector-invalid-feedback"
          data-cy="selector-invalid-feedback"
          v-bind:state="validityStyling"
        >
          {{ invalidFeedbackText }}
        </BFormInvalidFeedback>
      </BInputGroup>
    </BFormGroup>
  </div>
</template>

<script>
/**
 * The SelectorBase component is a base component used to build other components
 * that provide a dropdown menu for the user to choose from a list of options.
 *
 * It encapsulates the UI/UX for dropdown menu components, helping to ensure that
 * they are consistent across all dropdowns.  Sub-components that use this base
 * component will define and pass through props, set the list of items and optionally
 * a URL for adding new options.
 *
 * A trash can button will appear if this component is not required and is not empty.
 * This allows the user to clear a selection that was made for a non-required value.
 * If the component is required, the trash can button will not appear, as the user
 * must select a value and can change it if desired.
 *
 * See any of the `*Selector` components for examples of how this component
 * can be used.
 *
 * ## Usage Example
 *
 * ```html
 * <SelectorBase
 *   id="location-selector"
 *   data-cy="location-selector"
 *   label="Location"
 *   invalidFeedbackText="A location is required"
 *   v-bind:addOptionUrl="addLocationUrl"
 *   v-bind:options="locationList"
 *   v-bind:required="required"
 *   v-bind:selected="selected"
 *   v-bind:showValidityStyling="showValidityStyling"
 *   v-on:update:selected="handleUpdateSelected($event)"
 *   v-on:valid="handleValid($event)"
 * />
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
 * selector-delete-button    | The `BButton` component with the trash icon that clears the selected option.
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
     *
     * The options shown will update if the prop is set to a new array.
     *
     * However, the options shown will not change if only the contents of the array are changed.
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
      selectedOption: this.selected,
    };
  },
  computed: {
    isEmpty() {
      return this.selectedOption == null || this.selectedOption == '';
    },
    isValid() {
      if (this.required) {
        return !this.isEmpty;
      } else {
        return true;
      }
    },
    // Controls component styling (i.e. when green check or red X and invalid feedback) should be displayed.
    validityStyling() {
      if (this.showValidityStyling) {
        if (!this.required && this.isEmpty) {
          return null;
        } else {
          return this.isValid;
        }
      } else {
        return null;
      }
    },
  },
  methods: {
    handleDelete() {
      this.selectedOption = '';
    },
  },
  watch: {
    isValid() {
      /**
       * The validity of the component has changed.  Also emitted when the component is created.
       * @property {Boolean} valid `true` if an option is selected; `false` if not.
       */
      this.$emit('valid', this.isValid);
    },
    selected() {
      this.selectedOption = this.selected;
    },
    selectedOption() {
      /**
       * The selected option has changed. When the selection is changed by clicking
       * the trash icon to clear it, this event is emitted with '' as the payload.
       * @property {String} option the name of the newly selected option.
       */
      this.$emit('update:selected', this.selectedOption);
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

<style scoped>
.btn {
  padding-left: 5px;
  padding-right: 5px;
}

#selector-add-button {
  width: 28px;
}
</style>
