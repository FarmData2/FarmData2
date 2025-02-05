<template>
  <div>
    <SelectorBase
      id="location-selector"
      data-cy="location-selector"
      label="Location"
      invalidFeedbackText="A location is required"
      v-bind:options="locations"
      v-bind:required="required"
      v-bind:selected="selected"
      v-bind:showValidityStyling="showValidityStyling"
      v-on:update:selected="handleUpdateSelected($event)"
      v-on:valid="handleLocationValid($event)"
      v-on:add-clicked="handleAddClicked"
      v-bind:popupUrl="popupUrl"
    />

    <BAccordion
      flush
      id="location-beds-accordion"
      data-cy="location-beds-accordion"
      v-if="showBedSelection"
    >
      <BAccordionItem
        id="location-beds-accordion-item"
        data-cy="location-beds-accordion-item"
        visible
      >
        <template #title>
          <span
            id="location-beds-accordion-title"
            data-cy="location-beds-accordion-title"
            class="w-100 text-center"
          >
            Select Beds
          </span>
        </template>

        <BedPicker
          id="location-bed-picker"
          data-cy="location-bed-picker"
          v-bind:location="selectedLocation"
          v-model:picked="checkedBeds"
          v-bind:required="requireBedSelection"
          v-bind:showValidityStyling="showValidityStyling"
          v-on:valid="handleBedsValid($event)"
        />
      </BAccordionItem>
    </BAccordion>
  </div>
</template>

<script>
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';
import BedPicker from '@comps/BedPicker/BedPicker.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';
import { BAccordion } from 'bootstrap-vue-next';

/**
 * The LocationSelector component provides a UI element that allows the user to select a location.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/location_selector">The LocationSelector Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/location_selector/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <LocationSelector
 *   id="location-selector"
 *   data-cy="location-selector"
 *   label="Location"
 *   invalid-feedback-text="Selection cannot be empty."
 *   v-bind:required="required"
 *   v-bind:showValidityStyling="validity.showStyling"
 *   v-bind:includeFields="includeFields"
 *   v-bind:includeGreenhouses="includeGreenhouses"
 *   v-bind:includeGreenhousesWithBeds="includeGreenhousesWithBeds"
 *   v-bind:allowBedSelection="allowBedSelection"
 *   v-bind:requireBedSelection="requireBedSelection"
 *   v-model:selected="this.form.selected"
 *   v-model:pickedBeds="this.form.pickedBeds"
 *   v-on:update:beds="(beds) => (this.form.pickedBeds = beds)"
 *   v-on:valid="(valid) => (validity.selected = valid)"
 *   v-on:ready="createdCount++"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name                  | Description
 * --------------------------------| -----------
 * `location-selector`             | The `SelectorBase` component containing the locations dropdown.
 * `location-beds-accordion` }     | The `BAccordion` component containing the `BedPicker`.
 * `location-beds-accordion-item`  | The `BAccordionItem` component containing the `BedPicker`.
 * `location-beds-accordion-title` | The title displayed in the `BAccordionItem` containing the `BedPicker`.
 * `location-bed-picker`           | The `BedPicker` component containing the beds.
 */
export default {
  name: 'LocationSelector',
  components: { SelectorBase, BedPicker, BAccordion },
  emits: ['error', 'ready', 'update:selected', 'update:beds', 'valid'],
  props: {
    /**
     * Whether to include all fields in the list of locations.
     */
    includeFields: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to include all greenhouses in the list of locations.
     * If set to `true`, all greenhouses will be added to the location options,
     * regardless of whether they contain beds or not.
     */
    includeGreenhouses: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to include only greenhouses that contain beds in the list of locations.
     * Note: If `includeGreenhouses` is also set to `true`, all greenhouses will be
     * included, overriding this setting.
     *
     * For example:
     * - If `includeGreenhouses` is `true` and `includeGreenhousesWithBeds` is `false`,
     *   all greenhouses, (both with and without beds), will be included.
     * - If both `includeGreenhouses` and `includeGreenhousesWithBeds` are `true`,
     *   all greenhouses (both with and without beds) will be included.
     * - If `includeGreenhouses` is `false` and `includeGreenhousesWithBeds` is `true`,
     *   only greenhouses with beds will be included.
     */
    includeGreenhousesWithBeds: {
      type: Boolean,
      default: false,
    },
    /**
     * Allow selection of beds within a location if they exist.
     */
    allowBedSelection: {
      type: Boolean,
      default: true,
    },
    /**
     * Whether at least one bed must be selected if the location
     * contains beds and `allowBedSelection` is true.  If `allowBedSelection`
     * is false, this property is ignored.
     */
    requireBedSelection: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to select all beds within a location by default.
     */
    selectAllBedsByDefault: {
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
     * An array of the names of beds that are currently picked.
     * This prop is watched and changes are relayed to the component's internal state.
     */
    pickedBeds: {
      type: Array,
      default: () => [],
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
      /*
       * Need to maintain this because the loop for updates to the selected
       * prop do not work when doing component tests.  The update:selected event
       * is emitted, but because there is no actual page using the component there
       * is no listener to update the prop. Thus the recomputation of beds would
       * not occur. So, beds() was written to depend upon this attribute and thus
       * when it changes beds() will be recomputed.
       */
      selectedLocation: this.selected,

      /*
       * Have to use a v-model and watch the selectedBeds prop here
       * because the BCheckboxGroup change event does not tell us which
       * box is unchecked when one is unchecked.  This way the checkedBeds
       * attribute always contains the names of all checked beds.
       */
      checkedBeds: this.pickedBeds,

      /**
       * Set these to null so that they will be changed when the sub-components
       * emit their valid events on creation.  That will ensure that this component
       * then also emits its valid event.
       */
      locationValid: null,
      bedsValid: null,

      fieldMap: new Map(),
      greenhouseMap: new Map(),
      bedObjs: [],
      canCreateLand: false,
      canCreateStructure: false,
    };
  },
  computed: {
    popupUrl() {
      if (
        (this.includeGreenhouses || this.includeGreenhousesWithBeds) &&
        !this.includeFields &&
        this.canCreateStructure
      ) {
        return '/asset/add/structure';
      } else if (this.includeFields && this.canCreateLand) {
        return '/asset/add/land';
      } else {
        return null;
      }
    },
    canCreateLocation() {
      return (
        (this.includeFields && this.canCreateLand) ||
        ((this.includeGreenhouses || this.includeGreenhousesWithBeds) &&
          this.canCreateStructure)
      );
    },
    locations() {
      let fieldNames = [];
      if (this.includeFields) {
        fieldNames = Array.from(this.fieldMap.values()).map(
          (field) => field.attributes.name
        );
      }

      let greenhouseNames = [];
      if (this.includeGreenhouses) {
        greenhouseNames = Array.from(this.greenhouseMap.values()).map(
          (greenhouse) => greenhouse.attributes.name
        );
      } else if (this.includeGreenhousesWithBeds) {
        greenhouseNames = Array.from(this.greenhouseMap.values())
          .filter((greenhouse) => {
            // Include only greenhouses that are a parent for a bed.
            return this.bedObjs.some((bed) => {
              return bed.relationships.parent[0].id == greenhouse.id;
            });
          })
          .map((greenhouse) => greenhouse.attributes.name);
      }

      let locationNames = [...fieldNames, ...greenhouseNames];
      locationNames.sort();

      return locationNames;
    },
    beds() {
      if (!this.allowBedSelection) {
        return [];
      } else {
        // Get a list of the beds associated with the selected location
        let bedNames = this.bedObjs
          .filter((bed) => {
            let parentID = bed.relationships.parent[0].id;

            if (this.includeFields) {
              let parentField = this.fieldMap.get(parentID);
              if (parentField) {
                return this.selectedLocation == parentField.attributes.name;
              }
            }

            if (this.includeGreenhouses || this.includeGreenhousesWithBeds) {
              let parentGreenhouse = this.greenhouseMap.get(parentID);
              if (parentGreenhouse) {
                return (
                  this.selectedLocation == parentGreenhouse.attributes.name
                );
              }
            }

            return false;
          })
          .map((bed) => bed.attributes.name);

        bedNames.sort();
        return bedNames;
      }
    },
    isValid() {
      let bv = true;
      if (this.allowBedSelection) {
        if (this.requireBedSelection) {
          // A bed is required so the BedPicker must report a valid pick.
          bv = !(this.bedsValid === null || !this.bedsValid);
        }
      }

      return this.locationValid && bv;
    },
    showBedSelection() {
      return this.allowBedSelection && this.beds.length > 0;
    },
  },
  methods: {
    handleUpdateSelected(event) {
      this.selectedLocation = event;

      if (this.selectAllBedsByDefault) {
        this.checkedBeds = this.beds;
      } else {
        this.checkedBeds = [];
      }

      /**
       * The selected location has changed.
       * @property {string} event the name of the new selected location.
       */
      this.$emit('update:selected', event);
    },
    handleLocationValid(event) {
      this.locationValid = event;
    },
    handleBedsValid(event) {
      this.bedsValid = event;
    },
    async handleAddClicked(newLocation) {
      // when the selector emits the add-clicked event
      // clear the cached locations and repopulate the options
      // to get the newly created location, then select it

      // If a new asset is provided, update the selected
      if (newLocation) {
        // Clear the cached
        if (
          this.includeFields &&
          (this.includeGreenhouses || this.includeGreenhousesWithBeds) &&
          this.canCreateLand &&
          this.canCreateStructure
        ) {
          farmosUtil.clearCachedFields();
          farmosUtil.clearCachedGreenhouses();
          farmosUtil.clearCachedBeds();
        } else if (this.includeFields && this.canCreateLand) {
          farmosUtil.clearCachedFields();
          farmosUtil.clearCachedBeds();
        } else if (
          (this.includeGreenhouses || this.includeGreenhousesWithBeds) &&
          this.canCreateStructure
        ) {
          farmosUtil.clearCachedGreenhouses();
        }

        // Populate the map and wait for it to complete
        await this.populateLocationList();

        this.handleUpdateSelected(newLocation);
      }
    },
    async populateLocationList() {
      try {
        let fieldMap = null;
        if (this.includeFields) {
          fieldMap = await farmosUtil.getFieldIdToAssetMap();
        }

        let greenhouseMap = null;
        if (this.includeGreenhouses || this.includeGreenhousesWithBeds) {
          greenhouseMap = await farmosUtil.getGreenhouseIdToAssetMap();
        }

        let beds = null;
        if (this.allowBedSelection) {
          beds = await farmosUtil.getBeds();
        }

        // Update asset list
        this.fieldMap = fieldMap;
        this.greenhouseMap = greenhouseMap;
        this.bedObjs = beds;
      } catch (error) {
        console.error('Error populating location maps:', error);
      }
    },
  },
  watch: {
    checkedBeds: {
      handler() {
        /**
         * The selected beds have changed.
         * @property {Array<string>} checkedBeds an array containing the names of the selected beds.
         * @property {number} totalBeds the total number of beds in the selected location.
         */
        this.$emit('update:beds', this.checkedBeds, this.beds.length);
      },
      deep: true,
    },
    pickedBeds() {
      this.checkedBeds = this.pickedBeds;
    },
    isValid() {
      /**
       * The validity of the selected location or beds has changed.
       * @property {boolean} event whether the selections are valid or not.
       */
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    let canCreateLand = false;
    let fieldMap = null;
    if (this.includeFields) {
      canCreateLand = farmosUtil.checkPermission('create-land-asset');
      fieldMap = farmosUtil.getFieldIdToAssetMap();
    }

    let canCreateStructure = false;
    let greenhouseMap = null;
    if (this.includeGreenhouses || this.includeGreenhousesWithBeds) {
      canCreateStructure = farmosUtil.checkPermission('create-structure-asset');
      greenhouseMap = farmosUtil.getGreenhouseIdToAssetMap();
    }

    let beds = null;
    if (this.allowBedSelection) {
      beds = farmosUtil.getBeds();
    }

    Promise.all([
      fieldMap,
      greenhouseMap,
      beds,
      canCreateLand,
      canCreateStructure,
    ])
      .then(([fieldMap, greenhouseMap, beds, createLand, createStructure]) => {
        this.fieldMap = fieldMap;
        this.greenhouseMap = greenhouseMap;
        this.bedObjs = beds;
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

<style scoped>
#location-beds-accordion {
  padding-top: 3px;
}
</style>
