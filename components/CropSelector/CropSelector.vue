<template>
  <BFormGroup
    id="crop-group"
    data-cy="crop-group"
    label-for="crop-select"
    label-cols="auto"
    label-align="end"
    content-cols="auto"
  >
    <template v-slot:label>
      <span data-cy="crop-label">Crop:</span>
      <sup
        data-cy="required-star"
        v-if="required"
        class="text-danger"
        >*</sup
      >
    </template>

    <BInputGroup>
      <BFormSelect
        id="crop-select"
        data-cy="crop-select"
        v-model="crop"
        v-bind:state="useValidityStyling"
        v-bind:required="required"
      >
        <template v-slot:first>
          <BFormSelectOption
            v-bind:value="null"
            data-cy="option-0"
            disabled
            >Choose crop...</BFormSelectOption
          >
        </template>
        <BFormSelectOption
          v-for="(crop, i) in cropList"
          v-bind:key="crop"
          v-bind:value="crop"
          v-bind:data-cy="'option-' + (i + 1)"
        >
          {{ crop }}
        </BFormSelectOption>
      </BFormSelect>
      <BInputGroupAppend>
        <BButton
          data-cy="add-crop-button"
          variant="info"
          href="http://farmos/admin/structure/taxonomy/manage/plant_type/add"
          >+</BButton
        >
      </BInputGroupAppend>
      <BFormValidFeedback
        id="crop-valid-text"
        data-cy="crop-valid-text"
        v-bind:state="isValid"
        >{{ validText }}</BFormValidFeedback
      >
      <BFormInvalidFeedback
        id="crop-invalid-text"
        data-cy="crop-invalid-text"
        v-bind:state="isValid"
        >{{ invalidText }}
      </BFormInvalidFeedback>
    </BInputGroup>
  </BFormGroup>
</template>

<script>
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

/**
 * A component that allows the user to select a crop.
 *
 * ## Usage Example
 *
 * ```html
 * <CropSelector
 *   required
 *   validText="Select seeded crop."
 *   invalidText="Seeded crop is required."
 *   v-model:selected="form.crop"
 *   v-bind:showValidity="form.validity.show" 
 *   v-on:valid="(valid) => form.validity.crop = valid"
 *   v-on:ready="createdCount++"
 *   v-on:error="
 *     (msg) =>
 *        uiUtil.showToast('Network Error', msg, 'top-center', 'danger', 5)
 *   "
 * />

 * ```
 * - Notes:
 *   - The entrypoint using this component as shown above would need to:
 *      - import `uiUtil`.
 *      - define `form.crop` and `createdCount` in its `data` property.
 *   - See the `modules/README.md` for more information about using components.
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * `crop-group`          | The `BFormGroup` component containing this component.
 * `crop-label`          | The `span` component containing the "Crop" label.
 * `required-star`       | The `*` that appears in the label if the input is required.
 * `crop-select`         | The `BFormSelect` component used to select a crop.
 * `option-0`            | The disabled "Choose crop..." option in the `BFormSelect` component.
 * `option-n`            | The nth option in the `BFormSelect` component [1...n].
 * `add-crop-button`     | The `BButton` component that redirects to the page for adding a new crop.
 * `crop-valid-text`     | The `BFormValidFeedback` component that displays help when input is valid.
 * `crop-invalid-text`   | The `BFormInvalidFeedback` component that displays help when input is invalid.
 */
export default {
  name: 'CropSelector',
  emits: ['error', 'ready', 'update:selected', 'valid'],
  props: {
    /**
     * Whether a crop selection is required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Text that appears below the select element when value is valid.
     */
    validText: {
      type: String,
      default: 'Select crop.',
    },
    /**
     * Text that appears below the select element when value is invalid.
     */
    invalidText: {
      type: String,
      default: 'Crop selection is required.',
    },
    /**
     * Whether to show the validity styling of the component elements.
     * This prop is watched by the component.
     */
    showValidity: {
      type: Boolean,
      default: false,
    },
    /**
     * The name of the selected crop.
     * This prop is watched by the component.
     */
    selected: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      cropList: [],
      crop: this.selected,
      validate: this.showValidity,
    };
  },
  computed: {
    isValid() {
      // Indicates if the current value of the component is valid.
      if (this.required) {
        return this.crop != null;
      } else {
        return true;
      }
    },
    useValidityStyling() {
      // Indicates if the component UI validity should be shown.
      // 'null' if the entrypoint says not to showValidity
      // `true` if the entrypoint says to showValidity and this component is valid.
      // `false` otherwise.
      if (!this.validate) {
        return null;
      } else {
        return this.isValid;
      }
    },
  },
  methods: {},
  watch: {
    crop() {
      /**
       * The selected crop has changed.
       * @property {string} crop the name of the newly selected crop.
       */
      this.$emit('update:selected', this.crop);
    },
    selected() {
      this.crop = this.selected;
    },
    showValidity() {
      this.validate = this.showValidity;
    },
    isValid() {
      /**
       * The validity of the component has changed.
       * @property {boolean} valid whether the component's value is valid or not.
       */
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    farmosUtil
      .getFarmOSInstance()
      .then((farm) => {
        farmosUtil
          .getCropNameToTermMap(farm)
          .then((cropMap) => {
            this.cropList = Array.from(cropMap.keys());
            /**
             * The select has been populated with the list of crops.
             */
            this.$emit('ready');
          })
          .catch((error) => {
            console.error('CropSelector: Error fetching crops.');
            console.error(error);
            /**
             * An error occurred when communicating with the farmOS server.
             * @property {string} msg an error message.
             */
            this.$emit('error', 'Unable to fetch crops.');
          });
      })
      .catch((error) => {
        console.error('CropSelector: Error connecting to farm.');
        console.error(error);
        this.$emit('error', 'Unable to connect to farm.');
      });
  },
};
</script>
