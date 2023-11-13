<template>
  <SelectorBase
    id="location-selector"
    data-cy="location-selector"
    label="Location"
    invalidFeedbackText="A location is required"
    v-bind:addOptionUrl="addLocationUrl"
    v-bind:options="locationList"
    v-bind:required="required"
    v-bind:selected="selected"
    v-bind:showValidityStyling="showValidityStyling"
    v-on:update:selected="handleUpdateSelected($event)"
    v-on:valid="handleValid($event)"
  />
</template>

<script>
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

/**
 * The LocationSelector component provides a UI element that allows the user to select a location.
 *
 * ## Usage Example
 *
 * ```html
 * <LocationSelector
 *   id="seeding-location"
 *   data-cy="seeding-location"
 *   required
 *   includeGreenhouses
 *   v-model:selected="form.location"
 *   v-bind:showValidityStyling="validity.show"
 *   v-on:valid="validity.location = $event"
 *   v-on:ready="createdCount++"
 *   v-on:error="
 *     (msg) =>
 *       uiUtil.showToast('Network Error', msg, 'top-center', 'danger', 5)
 *   "
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * `location-selector`   | The `SelectorBase` component containing the dropdown.
 */
export default {
  name: 'LocationSelector',
  components: { SelectorBase },
  emits: ['ready', 'update:selected', 'valid'],
  props: {
    /**
     * Whether to include fields in the list of locations.
     */
    includeFields: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to include greenhouses in the list of locations.
     */
    includeGreenhouses: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether a location selection is required or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * The name of the selected location.
     * This prop is watched and changes are relayed to the component's internal state.
     */
    selected: {
      type: String,
      default: null,
    },
    /**
     * Whether validity styling should appear on the location dropdown.
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      locationList: [],
    };
  },
  computed: {
    addLocationUrl() {
      // return the appropriate url for land, structure or just asset if both
      if (this.includeFields && this.includeGreenhouses) {
        return '/asset/add';
      } else if (this.includeFields) {
        return '/asset/add/land';
      } else {
        return '/asset/add/structure';
      }
    },
  },
  methods: {
    handleUpdateSelected(event) {
      /**
       * The selected location has changed.
       * @property {string} event the name of the new selected location.
       */
      this.$emit('update:selected', event);
    },
    handleValid(event) {
      /**
       * The validity of the selected location has changed.
       * @property {boolean} event whether the selected location is valid or not.
       */
      this.$emit('valid', event);
    },
  },
  watch: {},
  created() {
    farmosUtil
      .getFarmOSInstance()
      .then((farm) => {
        if (this.includeFields) {
          return farmosUtil
            .getFieldOrBedNameToAssetMap(farm)
            .then((fieldMap) => {
              let fields = Array.from(fieldMap.keys());
              return { farm, fields };
            })
            .catch((error) => {
              console.error('LocationSelector: Error fetching fields.');
              console.error(error);
              /**
               * An error occurred when communicating with the farmOS server.
               * @property {string} msg an error message.
               */
              this.$emit('error', 'Unable to fetch fields.');
            });
        } else {
          let fields = [];
          return { farm, fields };
        }
      })
      .then(({ farm, fields }) => {
        if (this.includeGreenhouses) {
          return farmosUtil
            .getGreenhouseNameToAssetMap(farm)
            .then((greenhouseMap) => {
              let greenhouses = Array.from(greenhouseMap.keys());
              let allLocations = [...fields, ...greenhouses];
              return allLocations;
            })
            .catch((error) => {
              console.error('LocationSelector: Error fetching greenhouses.');
              console.error(error);
              /**
               * An error occurred when communicating with the farmOS server.
               * @property {string} msg an error message.
               */
              this.$emit('error', 'Unable to fetch greenhouses.');
            });
        } else {
          let allLocations = fields;
          return allLocations;
        }
      })
      .then((allLocations) => {
        this.locationList = allLocations.sort();

        /**
         * The select has been populated with the list of locations and the component is ready to be used.
         */
        this.$emit('ready');
      })
      .catch((error) => {
        console.error('LocationSelector: Error connecting to farm.');
        console.error(error);
        this.$emit('error', 'Unable to connect to farmOS server.');
      });
  },
};
</script>
