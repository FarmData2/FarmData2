<template>
  <div
    id="transplanting-picklist-div"
    data-cy="transplanting-picklist-div"
  >
    <!-- Crop Filter -->
    <SelectorBase
      id="transplanting-picklist-crop-filter"
      data-cy="transplanting-picklist-crop-filter"
      label="Crop"
      v-bind:required="required"
      v-bind:invalidFeedbackText="'A crop must be selected.'"
      v-bind:showValidityStyling="showValidityStyling"
      v-bind:selected="form.cropFilter"
      v-bind:options="cropList"
      v-on:valid="
        (valid) => {
          validity.cropFilter = valid;
        }
      "
      v-on:update:selected="
        (crop) => {
          cropFilterChanged(crop);
        }
      "
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
      v-on:update:picked="
        (picked) => {
          handlePickedUpdate(picked);
        }
      "
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
 * Attribute Name                       | Description
 * -------------------------------------| -----------
 * `transplanting-picklist`             | The `PicklistBase` element showing the crops that can be picked for transplanting.
 * `transplanting-picklist-div`         | The `div` element containing all of the sub-components.
 * `transplanting-picklist-crop-filter` | the `SelectorBase` component used to pick a crop.
 */
export default {
  components: {
    SelectorBase,
    PicklistBase,
  },
  emits: ['error', 'ready', 'update:crop', 'update:picked', 'valid'],
  props: {
    /**
     * The name of the selected crop.
     */
    crop: {
      type: String,
      default: null,
    },
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
        cropFilter: this.crop,
        pickedRows: new Map(),
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
      this.form.pickedRows.clear();
      this.form.cropFilter = cropName;
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

      /**
       * The selected crop has changed.
       * @property {string} cropName the name of the newly selected crop.
       */
      this.$emit('update:crop', cropName);
    },
    handlePickedUpdate(picked) {
      const emittedMap = new Map();
      for (const [index, { picked: trays }] of picked.entries()) {
        const row = {
          trays,
          data: { ...this.seedlingList[index] },
        };
        emittedMap.set(index, row);
      }

      /**
       * There has been a change to the picked map.
       * @property {Map} rows one object for each picked row. `{trays: number of trays picked, data: data about the tray seeding`). The format of the data is as given by [`farmosUtil.getSeedlings()`](http://localhost:8082/docs/library/farmosUtil.md#module_farmosUtil.getSeedlings).
       */
      this.$emit('update:picked', emittedMap);
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
    crop() {
      // Prevent double updates.
      if (
        this.form.cropFilter != this.crop &&
        !(this.form.cropFilter === '' && this.crop == null)
      ) {
        this.cropFilterChanged(this.crop);

        /*
         * If crop has been set to '' the form cleared it.  This will
         * usually happen when a transplanting has been successful. In that
         * case, it is possible that the crop is no longer available for
         * transplanting, so we need to check by re-fetching the list.
         *
         * Note: this will also happen on a "Reset" of the form if a crop was selected.
         * Technically, a new fetch isn't necessary here, but there is no good way
         * to prevent that and its pretty low overhead so just letting it go for now.
         */
        if (this.crop === '' || this.crop == null) {
          farmosUtil
            .getTraySeededCropNames()
            .then((cropNames) => {
              this.cropList = cropNames.sort();
            })
            .catch((error) => {
              console.error(
                'TransplantingPicklist: Error fetching seedlings crop names.'
              );
              console.error(error);

              this.$emit('error', 'Unable to fetch crop names.');
            });
        }
      }
    },
  },
  created() {
    // Fetch list of seedlings that can be transplanted.
    farmosUtil
      .getTraySeededCropNames()
      .then((cropNames) => {
        this.cropList = cropNames.sort();

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
