<template>
  <div>
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
  </div>
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
      canCreateLand: false,
      canCreateStructure: false,
    };
  },
  computed: {
    addLocationUrl() {
      // return the appropriate url for land, structure or just asset if both
      if (
        this.includeFields &&
        this.includeGreenhouses &&
        this.canCreateLand &&
        this.canCreateStructure
      ) {
        return '/asset/add';
      } else if (this.includeFields && this.canCreateLand) {
        return '/asset/add/land';
      } else if (this.includeGreenhouses && this.canCreateStructure) {
        return '/asset/add/structure';
      } else {
        return null;
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
    let land = [];
    let canCreateLand = false;
    if (this.includeFields) {
      canCreateLand = farmosUtil.checkPermission('create-land-asset');

      land = farmosUtil.getFieldOrBedNameToAssetMap().then((fieldMap) => {
        let fields = Array.from(fieldMap.keys());
        return fields;
      });
    }

    let structures = [];
    let canCreateStructure = false;
    if (this.includeGreenhouses) {
      canCreateStructure = farmosUtil.checkPermission('create-structure-asset');

      structures = farmosUtil
        .getGreenhouseNameToAssetMap()
        .then((greenhouseMap) => {
          let gh = Array.from(greenhouseMap.keys());
          return gh;
        });
    }

    Promise.all([land, structures, canCreateLand, canCreateStructure])
      .then(([land, structures, createLand, createStructure]) => {
        const allLocationsList = [...land, ...structures];
        this.locationList = allLocationsList.sort();

        this.canCreateLand = createLand;
        this.canCreateStructure = createStructure;

        /**
         * The select has been populated with the list of locations and the component is ready to be used.
         */
        this.$emit('ready');
      })
      .catch((error) => {
        console.error('LocationSelector: Error fetching locations.');
        console.error(error);
        this.$emit('error', 'Unable to fetch locations.');
      });
  },
};
</script>
