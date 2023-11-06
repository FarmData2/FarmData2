<script setup>
import dayjs from 'dayjs';
import CropSelector from '@comps/CropSelector/CropSelector.vue';
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

    <BForm
      @submit="submit"
      @reset="reset"
    >
      <!-- Seeding Date -->
      <BFormGroup
        id="ts-date-group"
        label-for="ts-date"
        label-cols="auto"
        label-align="end"
        content-cols="auto"
      >
        <template v-slot:label>Date:<sup class="text-danger">*</sup> </template>
        <BFormInput
          id="ts-date"
          data-cy="ts-date"
          type="date"
          v-model="form.seedingDate"
          aria-describedby="date-help"
          required
        />
        <BFormText id="date-help">Date seeding occurred.</BFormText>
      </BFormGroup>

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
            type="Create"
            class="form-control"
            variant="primary"
            >Submit</BButton
          >
        </BCol>
        <BCol cols="4">
          <BButton
            type="Reset"
            class="form-control"
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
      this.seedingDate = dayjs().format('YYYY-MM-DD');
      this.form.crop = null;
    },
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>
