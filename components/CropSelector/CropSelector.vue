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
        aria-describedby="crop-help"
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
    </BInputGroup>
    <BFormText
      id="crop-help"
      data-cy="crop-help"
      >{{ helpText }}</BFormText
    >
  </BFormGroup>
</template>

<script>
import { BButton } from 'bootstrap-vue-next';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

/**
 * A component that allows the user to select a crop.
 *
 * ## Usage Example
 *
 * ```html
 * <CropSelector
 *   required
 *   helpText="Select seeded crop."
 *   v-model:selected="form.crop"
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
 * `crop-help`           | The `BFormText` component that displays the help text below the `BFormSelect` component.
 */
export default {
  name: 'CropSelector',
  components: { BButton },
  emits: ['ready', 'error', 'update:selected'],
  props: {
    /**
     * Whether a crop selection is required or not.
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
      default: 'Select crop.',
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
  computed: {},
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
