<template>
  <div>
    <PickerBase
      v-show="bedList.length > 0"
      id="bed-picker"
      data-cy="bed-picker"
      invalidFeedbackText="At least one bed is required"
      label="Beds"
      v-bind:options="bedList"
      v-bind:picked="picked"
      v-bind:required="required"
      v-bind:showValidityStyling="showValidityStyling"
      v-on:update:picked="handleUpdatePicked($event)"
      v-on:valid="handleValid($event)"
    />
  </div>
</template>

<script>
import PickerBase from '@comps/PickerBase/PickerBase.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

/**
 * The BedPicker component is a UI element that allows the user to select beds from a within a location.
 * The BedPicker component will only be visible if the location specified
 * by the `location` prop contains at least one bed.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/bed_picker">The BedPicker Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/bed_picker/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <BedPicker
 *   id="location-bed-picker"
 *   data-cy="location-bed-picker"
 *   v-bind:location="location"
 *   v-model:picked="form.beds"
 *   v-bind:required="required"
 *   v-bind:showValidityStyling="validity.showStyling"
 *   v-on:valid="(valid) => { validity.beds = valid; }"
 *   v-on:ready="createdCount++"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * `bed-picker`          | The `PickerBase` component containing the picker.
 */
export default {
  name: 'BedPicker',
  components: { PickerBase },
  emits: ['error', 'ready', 'update:picked', 'valid'],
  props: {
    /**
     * The name of the location for which the `BedPicker` should show beds.
     * The `BedPicker` will fetch any beds associated with this location.
     */
    location: {
      type: String,
      required: true,
    },
    /**
     * The beds that are currently picked.
     */
    picked: {
      type: Array,
      default: () => [],
    },
    /**
     * Whether at least one bed must be picked or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether validity styling should appear on input elements.
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fieldMap: null,
      greenhouseMap: null,
      beds: null,
      bedList: [],
    };
  },
  computed: {},
  methods: {
    handleUpdatePicked(event) {
      /**
       * The picked beds has changed.
       * @property {Array} event an array of the names of the picked beds.
       */
      this.$emit('update:picked', event);
    },
    handleValid(event) {
      /**
       * The validity of the picked beds has changed.
       * @property {boolean} event whether the picked beds are valid or not.
       */
      this.$emit('valid', event);
    },
    updateBedList() {
      let field = this.fieldMap.get(this.location);
      let greenhouse = this.greenhouseMap.get(this.location);
      let locationId = null;
      if (field) {
        locationId = field.id;
      } else if (greenhouse) {
        locationId = greenhouse.id;
      } else {
        console.error("BedPicker: Can't find location: " + this.location);
      }

      if (!locationId) {
        this.bedList = [];
      } else {
        this.bedList = this.beds
          .filter((bed) => {
            if (bed.relationships.parent[0].id === locationId) {
              return bed;
            }
          })
          .map((bed) => {
            return bed.attributes.name;
          });
      }
    },
  },
  watch: {
    location() {
      if (this.fieldMap && this.greenhouseMap && this.beds) {
        this.updateBedList();
      }
    },
  },
  created() {
    let fieldMap = farmosUtil.getFieldNameToAssetMap();
    let greenhouseMap = farmosUtil.getGreenhouseNameToAssetMap();
    let beds = farmosUtil.getBeds();

    Promise.all([fieldMap, greenhouseMap, beds])
      .then(([fieldMap, greenhouseMap, beds]) => {
        this.fieldMap = fieldMap;
        this.greenhouseMap = greenhouseMap;
        this.beds = beds;

        this.updateBedList();

        /**
         * The component is ready for use.
         */
        this.$emit('ready');
      })
      .catch((error) => {
        console.error('BedPicker: Error fetching fields, greenhouses or beds.');
        console.error(error);
        /**
         * An error occurred when fetching greenhouses, fields or beds.
         * @property {string} msg an error message.
         */
        this.$emit('error', 'Unable to fetch greenhouses, fields or beds.');
      });
  },
};
</script>
