<template>
  <div>
    <div
      id="selector-overlay"
      data-cy="selector-overlay"
      v-if="isPopupVisible"
      class="overlay"
      aria-hidden="true"
    ></div>
    <div
      id="selector-popup"
      data-cy="selector-popup"
      v-if="isPopupVisible"
      class="popup"
    >
      <span
        id="selector-closePopup"
        data-cy="selector-closePopup"
        class="close-btn"
        v-on:click="hidePopup('')"
        >&times;</span
      >
      <iframe
        id="selector-popupIframe"
        data-cy="selector-popupIframe"
        width="100%"
        height="100%"
        frameborder="0"
        v-bind:class="{ hidden: !isPopupLoaded }"
        v-bind:src="popupSrc"
        v-on:load="handleIFrameLoad"
      ></iframe>
    </div>
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

      <BInputGroup class="has-validation">
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
            v-for="(option, i) in this.optionList"
            v-bind:key="option"
            v-bind:value="option"
            v-bind:data-cy="'selector-option-' + (i + 1)"
          >
            {{ option }}
          </BFormSelectOption>
        </BFormSelect>
        <BInputGroupAppend>
          <BButton
            v-if="popupUrl != null"
            id="selector-add-button"
            data-cy="selector-add-button"
            variant="outline-success"
            v-on:click="showPopup"
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
 * A plus button will appear if this component was provided a link to a page to add
 * an option to the dropdown, specifically, a farmOS page to add assets or terms.
 * Once clicked, the plus button will open a popup to the provided Url.
 *
 * See any of the `*Selector` components for examples of how this component
 * can be used.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/selector_base">The SelectorBase Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/selector_base/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <SelectorBase
 *   id="crop-selector"
 *   data-cy="crop-selector"
 *   label="Crop"
 *   invalidFeedbackText="A crop is required"
 *   v-bind:options="cropList"
 *   v-bind:required="required"
 *   v-bind:selected="selected"
 *   v-bind:showValidityStyling="showValidityStyling"
 *   v-on:update:selected="handleUpdateSelected($event)"
 *   v-on:valid="handleValid($event)"
 *   v-on:add-clicked="handleAddClicked"
 *   v-bind:popupUrl = "popupUrl"
 *   />
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
 * selector-overlay          | The overlay that darkens the page behind the popup.
 * selector-popup            | The parent `<div>` containing the `<iframe>` and close button.
 * selector-closePopup       | The button to close the popup.
 * selector-popupIframe      | The `<iframe>` element used to navigate to the page.
 */
export default {
  name: 'SelectorBase',
  components: {},
  emits: ['ready', 'update:selected', 'valid', 'add-clicked'],
  props: {
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
      optionList: this.options,
      selectedOption: this.selected,
      isPopupVisible: false,
      popupSrc: '',
      isPopupLoaded: false,
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
    removeElements(page) {
      try {
        page.getElementById('toolbar-administration').remove();
        page
          .getElementsByClassName('gin-secondary-toolbar layout-container')[0]
          .remove();
        page.getElementsByTagName('header')[0].style.top = 0;
        page.getElementsByClassName('gin--vertical-toolbar')[0].className = '';
        page
          .getElementById('block-farm-powered')
          .getElementsByTagName('a')[0]
          .removeAttribute('href');
      } catch (e) {
        // couldn't remove elements
      }
    },
    disableBackgroundElements(disable) {
      // get the body of the page and remove/restore it from the tab index
      // and hide/show it for screen readers
      const element = document.getElementsByTagName('body')[0];
      if (element) {
        this.setAttributes(element, disable);
      }
    },
    setAttributes(element, disable) {
      const stack = [element];

      while (stack.length > 0) {
        const current = stack.pop();

        if (disable) {
          current.setAttribute('tabindex', '-1');
          current.setAttribute('aria-hidden', 'true');
        } else {
          current.removeAttribute('tabindex');
          current.removeAttribute('aria-hidden');
        }

        for (const child of current.children) {
          stack.push(child);
        }
      }
    },
    checkValidUrl(iframe) {
      try {
        const iframeUrl = iframe.contentWindow.location.href;
        // prohibits navigating away from the add form
        if (!iframeUrl.includes(this.popupUrl)) {
          this.hidePopup(null);
        }
      } catch (e) {
        this.hidePopup(null);
      }
    },
    getNewAsset(document) {
      let result = null;
      try {
        // try to get the confirmation message containing the name of the newly created item
        // used to select the newly created item
        result = document
          .getElementsByClassName('messages-list')[1]
          .getElementsByClassName('messages__wrapper')[0]
          .getElementsByClassName(
            'messages-list__item messages messages--status'
          )[0]
          .getElementsByClassName('messages__content')[0]
          .getElementsByClassName('placeholder')[0].innerText;
        return result;
      } catch (e) {
        // couldn't get result
        return result;
      }
    },
    showPopup() {
      this.disableBackgroundElements(true);
      this.popupSrc = this.popupUrl;
      this.isPopupVisible = true;
    },
    hidePopup(newOption) {
      this.disableBackgroundElements(false);
      this.isPopupVisible = false;
      this.popupSrc = '';
      /**
       * The add button was clicked. This event is emitted with newOption as the payload
       * signifying that the add button was clicked and newOption is the newly created item.
       * (newOption = '' when no new item is created)
       * @property {String} option the name of the newly created option.
       */
      this.$emit('add-clicked', newOption);
    },
    handleIFrameLoad() {
      const iframe = document.getElementById('selector-popupIframe');

      // check that the current Url is valid
      this.checkValidUrl(iframe);

      // show page after removing elements
      this.removeElements(iframe.contentWindow.document);
      this.isPopupLoaded = true;

      // when the iframe redirects, hide it
      iframe.contentWindow.onunload = () => {
        this.isPopupLoaded = false;
      };

      // attempts to get & fill-in the newly created asset
      let result = this.getNewAsset(iframe.contentWindow.document);
      if (result) {
        this.hidePopup(result.trim());
      }
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
    options: {
      handler() {
        this.optionList = this.options;

        if (!this.optionList.includes(this.selected)) {
          this.selectedOption = '';
        }
      },
      deep: true,
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
/* Style for the popup */
.popup {
  position: fixed;
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  overflow: auto;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
/* Style for the overlay */
.overlay {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}
/* Style for the close button */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  border-radius: 20px;
  cursor: pointer;
}
</style>
