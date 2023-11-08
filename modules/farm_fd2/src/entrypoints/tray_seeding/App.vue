<script setup>
import dayjs from 'dayjs';
import CropSelector from '@comps/CropSelector/CropSelector.vue';
import DateSelector from '@comps/DateSelector/DateSelector.vue';

import * as uiUtil from '@libs/uiUtil/uiUtil.js';
</script>

<template>
  <BToaster />
  <BCard
    bg-variant="light"
    header-tag="header"
  >
    <template #header>
      <h2 class="text-center">Tray Seeding</h2>
    </template>

    <BForm>
      <!-- Seeding Date -->
      <DateSelector
        required
        helpText="Date seeding occurred."
        v-model:date="form.seedingDate"
        v-on:ready="createdCount++"
      />

      <!-- Crop Selection -->
      <CropSelector
        required
        helpText="Select seeded crop."
        v-model:selected="form.crop"
        v-on:ready="createdCount++"
        v-on:error="
          (msg) =>
            uiUtil.showToast('Network Error', msg, 'top-center', 'danger', 5)
        "
      />

      <!-- Submit and Reset Buttons -->

      <!-- TODO: MAKE SO CAN'T SUBMIT AGAIN UNTIL A CHANGE HAS BEEN MADE -->
      <!-- POSSIBLY JUST CLEAR THE LOCATION OR THE CROP? -->
      <BRow>
        <BCol cols="8">
          <BButton
            v-on:click="submit()"
            type="submit"
            variant="primary"
            >Submit</BButton
          >
        </BCol>
        <BCol cols="4">
          <BButton
            v-on:click="reset()"
            variant="danger"
            >Reset</BButton
          >
        </BCol>
      </BRow>
    </BForm>
  </BCard>

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        seedingDate: dayjs().format('YYYY-MM-DD'),
        crop: null,
      },
      createdCount: 0,
    };
  },
  methods: {
    submit() {
      console.log(this.form);
    },
    reset() {
      this.form.seedingDate = dayjs().format('YYYY-MM-DD');
      this.form.crop = null;
    },
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 3;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>

<style>
header.region.region-sticky {
  display: none;
}
</style>
