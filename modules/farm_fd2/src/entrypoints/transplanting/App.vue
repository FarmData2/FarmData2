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
          v-model:selected="cropFilter"
          v-bind:options="cropList"
          v-bind:invalidFeedbackText="'Please select a crop.'"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.cropFilter = $event"
          v-on:ready="createdCount++"
        />

        <!-- Tray Seeding Picklist -->
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

export default {
  components: {
    SelectorBase,
  },
  data() {
    return {
      cropFilter: null,
      cropList: [],
      seedlingList: [],
      form: {},
      validity: {
        show: false,
      },
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
  },
  created() {
    // Fetch list of seedlings that can be transplanted.
    farmosUtil.getTraySeededCropNames().then((cropNames) => {
      this.cropList = ['ALL', ...cropNames];
      this.createdCount++;
    })
    .catch((error) => {
      console.error('SeedlingSelector: Error fetching seedlings.');
    });
  },
};
</script>
