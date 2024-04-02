<template>
  <div
    id="transplanting"
    data-cy="transplanting"
  >
    <BToaster
      id="transplanting-toaster"
      data-cy="transplanting-toaster"
    />
    <BCard
      id="transplanting-card"
      data-cy="transplanting-card"
      bg-variant="light"
      header-tag="header"
    >
      <template #header>
        <h2
          id="transplanting-header"
          data-cy="transplanting-header"
          class="text-center"
        >
          Transplanting
        </h2>
      </template>

      <BForm
        id="transplanting-form"
        data-cy="transplanting-form"
      >
        <!-- Crop Filter -->
        <SelectorBase
          id="transplanting-crop-filter"
          data-cy="transplanting-crop-filter"
          label="Crop"
          required
          v-model:selected="cropFilter"
          v-bind:options="cropList"
          v-bind:invalidFeedbackText="'A crop must be selected.'"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.cropFilter = $event"
          v-on:update:selected="cropFilterChanged($event)"
          v-on:ready="createdCount++"
        />

        <!-- Tray Seeding Picklist -->
        <PicklistBase
          id="transplanting-picklist"
          data-cy="transplanting-picklist"
          v-bind:columns="columns"
          v-bind:labels="labels"
          v-bind:rows="sortedRows"
          showAllButton
          showInfoIcons
          v-bind:picked="form.picked"
          v-on:valid="(valid) => (validity.picked = valid)"
          v-on:update:picked="form.picked = $event"
          v-on:ready="createdCount++"
        />
      </BForm>
    </BCard>

    <div
      id="page-loaded"
      data-cy="page-loaded"
      v-show="false"
    >
      {{ pageDoneLoading }}
    </div>
  </div>
  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
import dayjs from 'dayjs';
import * as lib from './lib';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';
import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';

export default {
  components: {
    SelectorBase,
    PicklistBase,
  },
  data() {
    return {
      cropFilter: null,
      cropList: [],
      columns: ['date', 'trays_location', 'tray_ratio'],
      labels: {
        date: 'Date',
        user: 'User',
        trays_location: 'Location',
        asset_location: 'Transplanted Location',
        tray_ratio: 'Trays',
        tray_size: 'Tray Size',
        seeds_per_cell: 'Seeds per Cell',
        total_seeds: 'Total Seeds',
        log_notes: 'Seeding Notes',
        asset_notes: 'Plant Notes',
      },
      seedlingList: [],
      form: {
        picked: [],
      },
      validity: {
        show: false,
        picked: false,
      },
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
    sortedRows() {
      return this.seedlingList.sort((a, b) => {
        return dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1;
      })
    }
  },
  methods: {
    cropFilterChanged(cropName) {
      if (cropName) {
        farmosUtil
          .getSeedlings(cropName)
          .then((seedlings) => {
            this.seedlingList = seedlings;
          })
          .catch((error) => {
            // TODO: Use toast here...
            console.error('Transplanting: Error fetching seedlings.');
          });
      } else {
        this.seedlingList = [];
      }
    },
  },
  created() {
    // Fetch list of seedlings that can be transplanted.
    farmosUtil
      .getTraySeededCropNames()
      .then((cropNames) => {
        this.cropList = cropNames;
        this.createdCount++;
      })
      .catch((error) => {
        // TODO: Use toast here...
        console.error('Transplanting: Error fetching seedlings crop names.');
      });
  },
};
</script>

<style>
@import url('@css/fd2-mobile.css');

#transplanting-crop-filter {
  padding-top: 3px;
  padding-bottom: 8px;
}
</style>
