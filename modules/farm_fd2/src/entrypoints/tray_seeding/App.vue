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
        id="seeding-date"
        data-cy="seeding-date"
        required
        v-model:date="form.seedingDate"
        v-bind:showValidityStyling="validity.show"
        v-on:valid="validity.seedingDate = $event"
        v-on:ready="createdCount++"
      />

      <!-- Crop Selection -->
      <CropSelector
        id="seeded-crop"
        data-cy="seeded-crop"
        required
        v-model:selected="form.crop"
        v-bind:showValidityStyling="validity.show"
        v-on:valid="validity.crop = $event"
        v-on:ready="createdCount++"
        v-on:error="
          (msg) =>
            uiUtil.showToast('Network Error', msg, 'top-center', 'danger', 5)
        "
      />

      <!-- Location Selection -->
      <LocationSelector
        id="seeding-location"
        data-cy="seeding-location"
        required
        includeGreenhouses
        v-model:selected="form.location"
        v-bind:showValidityStyling="validity.show"
        v-on:valid="validity.location = $event"
        v-on:ready="createdCount++"
        v-on:error="
          (msg) =>
            uiUtil.showToast('Network Error', msg, 'top-center', 'danger', 5)
        "
      />
      <hr />

      <!-- Number of Trays -->
      <NumericInput
        id="seeding-trays"
        data-cy="seeding-trays"
        required
        label="Trays"
        invalidFeedbackText="Trays must be a positive number."
        v-model:value="form.trays"
        v-bind:showValidityStyling="validity.show"
        v-bind:decimalPlaces="2"
        v-bind:incDecValues="[1, 5, 20]"
        v-bind:minValue="0.01"
        v-on:valid="validity.trays = $event"
        v-on:ready="createdCount++"
      />

      <hr />
      <!-- Comment Box -->
      <CommentBox
        id="seeding-comment"
        data-cy="seeding-comment"
        v-model:comment="form.comment"
        v-on:valid="validity.comment = $event"
        v-on:ready="createdCount++"
      />

      <!-- Submit and Reset Buttons -->
      <SubmitResetButtons
        id="seeding-submit-reset"
        data-cy="seeding-submit-reset"
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
import dayjs from 'dayjs';
import CropSelector from '@comps/CropSelector/CropSelector.vue';
import DateSelector from '@comps/DateSelector/DateSelector.vue';
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import NumericInput from '@comps/NumericInput/NumericInput.vue';
import CommentBox from '@comps/CommentBox/CommentBox.vue';
import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';

export default {
  components: {
    CropSelector,
    DateSelector,
    LocationSelector,
    NumericInput,
    CommentBox,
    SubmitResetButtons,
  },
  data() {
    return {
      form: {
        seedingDate: dayjs().format('YYYY-MM-DD'),
        crop: null,
        location: null,
        trays: 1,
        comment: null,
      },
      validity: {
        show: false,
        seedingDate: false,
        crop: false,
        location: false,
        trays: false,
        comment: false,
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
      this.form.location = null;
      this.form.trays = 1;
      this.form.comment = null;
    },
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 7;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>

<style>
@import url('@css/fd2-mobile.css');

#seeding-date {
  margin-top: 2px;
  margin-bottom: 8px;
}

#seeded-crop,
#seeding-location {
  margin-bottom: 8px;
}

#seeding-comment {
  margin-bottom: 15px;
}
</style>