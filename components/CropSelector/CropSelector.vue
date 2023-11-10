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
        v-bind:state="showInvalidStyling"
        v-bind:required="required"
      >
        <template v-slot:first>
          <BFormSelectOption
            v-bind:value="null"
            data-cy="option-0"
            disabled
          />
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
      <BFormInvalidFeedback
        id="crop-invalid-feedback"
        data-cy="crop-invalid-feedback"
        v-bind:state="showInvalidStyling"
      >
        A crop selection is required.
      </BFormInvalidFeedback>
    </BInputGroup>
  </BFormGroup>
</template>

<script>
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';
import * as uiUtil from '@libs/uiUtil/uiUtil.js';

/**
 * A component that allows the user to select a crop.
 *
 * ## Usage Example
 *
 * ```html
 * TODO: Update this example.
 * />

 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name          | Description
 * ------------------------| -----------
 * `crop-group`            | The `BFormGroup` component containing this component.
 * `crop-label`            | The `span` component containing the "Crop" label.
 * `required-star`         | The `*` that appears in the label if the input is required.
 * `crop-select`           | The `BFormSelect` component used to select a crop.
 * `option-0`              | The disabled "Choose crop..." option in the `BFormSelect` component.
 * `option-n`              | The nth option in the `BFormSelect` component [1...n].
 * `add-crop-button`       | The `BButton` component that redirects to the page for adding a new crop.
 * `crop-invalid-feedback` | The `BFormInvalidFeedback` component that displays help when input is invalid.
 */
export default {
  name: 'CropSelector',
  components: {},
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
     * Whether validity styling should appear on input elements with invalid values.
     * This prop is watched by the component.
     */
    showInvalid: {
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
    };
  },
  computed: {
    isValid() {
      // Returns true if the component's values are valid and false otherwise.
      // This is to be determined independent of the `showInvalid` prop.
      return this.required && this.crop != null;
    },
    // Controls when the invalid styling (i.e. red X) should be displayed.
    showInvalidStyling() {
      return uiUtil.showInvalidStyling(this.isValid, this.showInvalid);
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
    isValid() {
      /**
       * The validity of the component has changed.  Also emitted when the component is created.
       * @property {*} valid `true` if the component's value is valid; `false` if it is invalid.
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
            // Emit the initial valid state of the component's value.
            this.$emit('valid', this.isValid);

            /**
             * The select has been populated with the list of crops and the component is ready to be used.
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
        this.$emit('error', 'Unable to connect to farmOS server.');
      });
  },
};
</script>
