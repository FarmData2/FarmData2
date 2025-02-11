<template>
  <div
    id="active-plant-asset-picklist"
    data-cy="active-plant-asset-picklist"
  >
    <!-- Location Selection -->
    <LocationSelector
      id="active-plant-asset-picklist-location"
      data-cy="active-plant-asset-picklist-location"
      label="Location"
      invalid-feedback-text="Selection cannot be empty."
      v-bind:required="required"
      v-bind:includeFields="includeFields"
      v-bind:includeGreenhouses="includeGreenhouses"
      v-bind:includeGreenhousesWithBeds="includeGreenhousesWithBeds"
      v-bind:selected="selected"
      v-bind:pickedBeds="pickedBeds"
      v-bind:allowBedSelection="allowBedSelection"
      v-bind:requireBedSelection="requireBedSelection"
      v-bind:selectAllBedsByDefault="selectAllBedsByDefault"
      v-bind:showValidityStyling="showValidityStyling"
      v-on:valid="handleLocationValid($event)"
      v-on:update:beds="
        (checkedBeds, totalBeds) => handleBedsUpdate(checkedBeds, totalBeds)
      "
      v-on:update:selected="handleLocationUpdate($event)"
    />

    <!--
      Example block commented out:

      <div
        id="termination-event-group"
        data-cy="termination-event-group"
        class="d-flex flex-column align-items-center"
        v-if="plantsAtLocation"
      >
        ...
      </div>
    -->
  </div>
</template>

<script>
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';

/**
 * A new component.
 *
 * ## Usage Example
 * ```html
 * Add example of how to add this component to a template.
 * See the other components in the `components` directory for examples.
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * `attr-value`          | identify element with the `data-cy="attr-value"`
 */
export default {
  name: 'ActivePlantAssetPicklist',
  components: { LocationSelector },
  emits: ['ready', 'valid', 'update:selected', 'update:beds'],
  props: {
    /**
     * Allow selection of beds within a location if they exist.
     */
    allowBedSelection: {
      type: Boolean,
      default: true,
    },
    /**
     * Require that a bed be selected within a location if they exist.
     */
    requireBedSelection: {
      type: Boolean,
      default: true,
    },
    /**
     * Whether to include all fields in the list of locations.
     */
    includeFields: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to include all greenhouses in the list of locations,
     * regardless of whether they contain beds or not.
     */
    includeGreenhouses: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to include only greenhouses that contain beds in the list of locations.
     */
    includeGreenhousesWithBeds: {
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
     * Whether a value for the input element is required or not.
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
    /**
     * The current selected location
     */
    selected: {
      type: String,
      default: null,
    },
    /**
     * The current picked beds from the location
     */
    pickedBeds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedLocation: this.selected,
      locationValid: false,
    };
  },
  computed: {
    /**
     * Computed property that determines if this component is valid.
     * Adjust logic as needed.
     */
    isValid() {
      // If not required, consider it automatically valid
      if (!this.required) {
        return true;
      }
      // If required but no location selected, invalid
      if (!this.selectedLocation) {
        return false;
      }
      // If bed selection is required, check that there's at least one bed
      if (this.requireBedSelection && this.allowBedSelection) {
        if (!this.pickedBeds || this.pickedBeds.length === 0) {
          return false;
        }
      }
      return true;
    },

    /**
     * If you'd like to bind to the `state` prop in child components
     * to apply validity styling, return a boolean or `null` for no styling:
     */
    validityStyling() {
      return this.isValid;
    },
  },
  methods: {
    /**
     * Called when the user selects or changes the location in the child component
     */
    handleLocationUpdate(newLocation) {
      this.selectedLocation = newLocation;
      this.$emit('update:selected', newLocation);
    },

    /**
     * Called when the child component emits 'valid'
     * - e.g. location is valid or invalid
     */
    handleLocationValid(validStatus) {
      this.locationValid = validStatus;
      // Also emit 'valid' from the parent, if needed
      this.$emit('valid', this.isValid);
    },

    /**
     * Called when the child component emits 'update:beds'
     */
    handleBedsUpdate(checkedBeds, totalBeds) {
      // Example logging
      console.log('handleBedsUpdate was called with:', checkedBeds, totalBeds);
      // Re-emit to the parent so it can be captured with v-on:update:beds
      this.$emit('update:beds', checkedBeds, totalBeds);
    },
  },
  watch: {
    /**
     * Re-emit validity whenever isValid changes
     */
    isValid(newVal) {
      this.$emit('valid', newVal);
    },
  },
  created() {
    // Emit the initial valid state
    this.$emit('valid', this.isValid);
    // Emit ready once the component is created
    this.$emit('ready');
  },
};
</script>
