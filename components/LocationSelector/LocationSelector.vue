<template>
  <div>
    <SelectorBase
      id="location-selector"
      data-cy="location-selector"
      label="Location"
      invalidFeedbackText="A location is required"
      v-bind:addOptionUrl="addLocationUrl"
      v-bind:options="locations"
      v-bind:required="required"
      v-bind:selected="selected"
      v-bind:showValidityStyling="showValidityStyling"
      v-on:update:selected="handleUpdateSelected($event)"
      v-on:valid="handleLocationValid($event)"
    />

    <BAccordion
      flush
      id="location-selector-beds-accordion"
      data-cy="location-selector-beds-accordion"
      v-if="showBedSelection"
    >
      <BAccordionItem
        id="location-selector-beds-accordion-item"
        data-cy="location-selector-beds-accordion-item"
        visible
      >
        <template #title>
          <span
            id="location-selector-beds-accordion-title"
            data-cy="location-selector-beds-accordion-title"
            class="w-100 text-center"
          >
            Select Beds
          </span>
        </template>

        <BedPicker
          id="location-selector-bed-picker"
          data-cy="location-selector-bed-picker"
          v-bind:location="selectedLocation"
          v-bind:picked="checkedBeds"
          v-bind:required="requireBedSelection"
          v-on:update:picked="handleUpdateBeds($event)"
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
 * ## Usage Example
 *
 * ```html
 * TODO: Update this example to include props for BedPicker.
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name                 | Description
 * -------------------------------| -----------
 * `location-selector`            | The `SelectorBase` component containing the locations dropdown.
 * `location-selector-bed-picker` | The `BedPicker` component containing the beds.
 */
export default {
  name: 'LocationSelector',
  components: { SelectorBase, BedPicker, BAccordion },
  emits: ['error', 'ready', 'update:selected', 'update:beds', 'valid'],
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
     * Allow selection of beds within a location if they exist.
     */
    allowBedSelection: {
      type: Boolean,
      default: true,
    },
    /**
     * Whether at least one bed must be selected if the location
     * contains beds and `allowBedSelection` is true.
     */
    requireBedSelection: {
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

            if (this.includeGreenhouses) {
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
    valid() {
      let bv = true;
      if (this.allowBedSelection) {
        // need to account for this.bedsValid possibly being null here.
        if (!this.bedsValid) {
          bv = false;
        }
      }

      return this.locationValid && bv;
    },
    showBedSelection() {
      return this.allowBedSelection && this.beds.length > 0;
    },
  },
  methods: {
    handleUpdateBeds(event) {
      this.checkedBeds = event;

      /**
       * The selected beds have changed.
       * @property {Array<string>} checkedBeds an array containing the names of the selected beds.
       * @property {number} totalBeds the total number of beds in the selected location.
       */
      this.$emit('update:beds', this.checkedBeds, this.beds.length);
    },
    handleUpdateSelected(event) {
      this.selectedLocation = event;

      // Clear any picked beds for the new location.
      if (this.pickedBeds.length > 0) {
        this.handleUpdateBeds([]);
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
  },
  watch: {
    selectedBeds() {
      this.checkedBeds = this.selectedBeds;
    },
    pickedBeds() {
      this.checkedBeds = this.pickedBeds;
    },
    valid() {
      /**
       * The validity of the selected location or beds has changed.
       * @property {boolean} event whether the selections are valid or not.
       */
      this.$emit('valid', this.valid);
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
    if (this.includeGreenhouses) {
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
#location-selector-beds-accordion {
  padding-top: 3px;
}
</style>
