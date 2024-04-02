<template>
  <div
    id="transplanting-picklist-group"
    data-cy="transplanting-picklist-group"
  >
    <!-- Crop Filter -->
    <SelectorBase
      id="transplanting-picklist-crop-filter"
      data-cy="transplanting-picklist-crop-filter"
      label="Crop"
      v-bind:required="required"
      v-bind:invalidFeedbackText="'A crop must be selected.'"
      v-bind:showValidityStyling="showValidityStyling"
      v-model:selected="form.cropFilter"
      v-bind:options="cropList"
      v-on:valid="validity.cropFilter = $event"
      v-on:update:selected="cropFilterChanged($event)"
      v-on:ready="createdCount++"
    />

    <!-- Trays Picklist -->
    <PicklistBase
      id="transplanting-picklist"
      data-cy="transplanting-picklist"
      v-bind:required="required"
      invalidFeedbackText="Select at least one tray to transplant."
      v-bind:showValidityStyling="picklistValidityStyling"
      showAllButton
      showInfoIcons
      v-bind:columns="columns"
      v-bind:labels="labels"
      v-bind:rows="sortedRows()"
      v-on:ready="createdCount++"
    />
  </div>
</template>

<script>
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';
import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';
import dayjs from 'dayjs';

/**
 * A Transplanting Picklist allows the user to select a crop from a list
 * of all crops that currently have tray seedings (i.e. can be transplanted).
 *
 * ## Usage Example
 *
 * ```html
 * Add example of how to add this component to a template.
 * See the other components in the `components` directory for examples.
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name           | Description
 * -------------------------| -----------
 * `transplanting-picklist` | The `BFormGroup` element containing all of the sub-components.
 */
export default {
  components: {
    SelectorBase,
    PicklistBase,
  },
  emits: ['error', 'ready', 'valid'],
  props: {
    /**
     * Whether a value for the input element is required or not.
     */
    required: {
      type: Boolean,
      default: true,
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
      cropFilter: null,
      cropList: [],
      seedlingList: [],
      columns: ['date', 'trays_location', 'tray_ratio'],
      labels: {
        date: 'Date',
        user: 'User',
        trays_location: 'Location',
        asset_location: 'Transplanted Location',
        tray_ratio: 'Trays',
        tray_size: 'Tray Size',
        seeds_per_cell: 'Seeds/Cell',
        total_seeds: 'Total Seeds',
        log_notes: 'Seeding Notes',
        asset_notes: 'Plant Notes',
      },
      form: {
        cropFilter: null,
        pickedRows: null,
      },
      validity: {
        cropFilter: false,
        picked: false,
      },
    };
  },
  computed: {
    isValid() {
      return this.validity.cropFilter && this.validity.picked;
    },
    picklistValidityStyling() {
      if (this.validity.cropFilter) {
        return this.showValidityStyling;
      }
      else {
        return false;
      } 
    }
  },
  methods: {
    sortedRows() {
      return this.seedlingList.sort((a, b) => {
        return dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1;
      });
    },
    cropFilterChanged(cropName) {
      if (cropName) {
        console.log('cropName: ' + cropName);

        farmosUtil
          .getSeedlings(cropName)
          .then((seedlings) => {
            this.seedlingList = seedlings;
          })
          .catch((error) => {
            console.error(
              'TransplantingPicklist: Error fetching seedlings for ' +
                cropName +
                '.'
            );
            console.error(error);

            /**
             * An error occurred when communicating with the farmOS server.
             * @property {string} msg an error message.
             */
            this.$emit('error', 'Unable to fetch tray seedings.');
          });
      } else {
        this.seedlingList = [];
      }
    },
  },
  watch: {
    isValid() {
      /**
       * The validity of the component has changed.  Also emitted when the component is created.
       * @property {Boolean} valid `true` if the component's value is valid; `false` if it is invalid.
       */
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    // Fetch list of seedlings that can be transplanted.
    farmosUtil
      .getTraySeededCropNames()
      .then((cropNames) => {
        this.cropList = cropNames;
        this.createdCount++;

        //Emit the initial valid state of the component's value.
        this.$emit('valid', this.isValid);

        /**
         * The component is ready for use.
         */
        this.$emit('ready');
      })
      .catch((error) => {
        console.error(
          'TransplantingPicklist: Error fetching seedlings crop names.'
        );
        console.error(error);

        this.$emit('error', 'Unable to fetch crop names.');
      });
  },
};
</script>