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
      v-bind:rows="seedlingList"
      v-bind:units="units"
      v-bind:quantityAttribute="quantityAttribute"
      v-model:picked="form.pickedRows"
      v-on:update:picked="(picked) => handlePickedUpdate(picked)"
      v-on:valid="
        (valid) => {
          validity.picked = valid;
        }
      "
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
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/picklist_base">The PicklistBase Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/picklist_base/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <TransplantingPicklist
 *   id="transplanting-picklist"
 *   data-cy="transplanting-picklist"
 *   v-bind:required="required"
 *   v-bind:showValidityStyling="validity.show"
 *   v-on:update:picked="
 *     (picked) => {
 *       form.picked = picked;
 *     }
 *   "
 *   v-on:valid="
 *     (valid) => {
 *       validity.picked = valid;
 *     }
 *   "
 *   v-on:ready="createdCount++"
 * />
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
  emits: ['error', 'ready', 'update:picked', 'valid'],
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
      cropList: [],
      seedlingList: [],
      columns: ['date', 'trays_location'],
      units: 'Trays',
      quantityAttribute: 'available_trays',
      labels: {
        date: 'Date',
        user: 'User',
        trays_location: 'Location',
        asset_location: 'Transplanted Locations',
        tray_size: 'Tray Size',
        seeds_per_cell: 'Seeds/Cell',
        total_seeds: 'Total Seeds',
        notes: 'Notes',
      },
      form: {
        cropFilter: '',
        pickedRows: [],
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
      } else {
        return false;
      }
    },
  },
  methods: {
    sortSeedlings() {
      this.seedlingList.sort((a, b) => {
        return dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1;
      });
    },
    cropFilterChanged(cropName) {
      if (cropName) {
        farmosUtil
          .getSeedlings(cropName)
          .then((seedlings) => {
            this.seedlingList = seedlings;
            this.sortSeedlings();
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
    handlePickedUpdate(picked) {
      const emittedRows = [];
      for (let i = 0; i < picked.length; i++) {
        if (picked[i] != 0) {
          const row = {
            trays: picked[i],
            data: { ...this.seedlingList[i] },
          };
          emittedRows.push(row);
        }
      }

      /**
       * There has been a change to the picked rows.
       * @property {Array} rows one object for each picked row. `{trays: number of trays picked, data: data about the tray seeding`). The format of the data is as given by [`farmosUtil.getSeedlings()`](http://localhost:8082/docs/library/farmosUtil.md#module_farmosUtil.getSeedlings).
       */
      this.$emit('update:picked', emittedRows);
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
        this.cropList = cropNames.sort();
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
