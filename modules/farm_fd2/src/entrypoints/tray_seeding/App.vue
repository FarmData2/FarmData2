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
      <BRow>
        <BCol cols="auto">
          <BButton
            v-on:click="submit()"
            variant="primary"
            size="lg"
            class="fd2-submit"
            >Submit</BButton
          >
        </BCol>
        <BCol
          cols="auto"
          alignSelf="center"
        >
          <BButton
            v-on:click="reset()"
            variant="warning"
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
@import url('@css/fd2-mobile.css');

.fd2-submit {
  width: 210px !important;
  min-width: 210px;
  max-width: 210px;
}

.fd2-reset {
  width: 50px !important;
  min-width: 50px;
  max-width: 50px;
}
</style>
