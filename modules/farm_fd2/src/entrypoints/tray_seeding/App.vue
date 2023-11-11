<script setup>
import dayjs from 'dayjs';
import CropSelector from '@comps/CropSelector/CropSelector.vue';
import DateSelector from '@comps/DateSelector/DateSelector.vue';
import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';

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
        v-model:date="form.seedingDate"
        v-bind:showInvalidStyling="validity.show"
        v-on:valid="validity.seedingDate = $event"
        v-on:ready="createdCount++"
      />

      <!-- Crop Selection -->
      <CropSelector
        required
        v-model:selected="form.crop"
        v-bind:showInvalidStyling="validity.show"
        v-on:valid="validity.crop = $event"
        v-on:ready="createdCount++"
        v-on:error="
          (msg) =>
            uiUtil.showToast('Network Error', msg, 'top-center', 'danger', 5)
        "
      />

      <!-- Submit and Reset Buttons -->
      <SubmitResetButtons
        v-model:enableSubmit="enableSubmit"
        v-model:enableReset="enableReset"
        v-on:ready="createdCount++"
        v-on:submit="submit()"
        v-on:reset="reset()"
      />
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
      validity: {
        show: false,
        seedingDate: false,
        crop: false,
      },
      enableSubmit: true,
      enableReset: true,
      createdCount: 0,
    };
  },
  methods: {
    submit() {
      this.validity.show = true;
      console.log(this.form);
    },
    reset() {
      this.validity.show = false;
      this.form.seedingDate = dayjs().format('YYYY-MM-DD');
      this.form.crop = null;
    },
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 4;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>

<style>
@import url('@css/fd2-mobile.css');

#date-group,
#crop-group {
  margin-bottom: 8px;
}
</style>
