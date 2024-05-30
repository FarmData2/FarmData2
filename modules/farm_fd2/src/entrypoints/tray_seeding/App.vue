<template>
  <div
    id="tray-seeding"
    data-cy="tray-seeding"
  >
    <BToaster
      id="tray-seeding-toaster"
      data-cy="tray-seeding-toaster"
    />
    <BCard
      id="tray-seeding-card"
      data-cy="tray-seeding-card"
      bg-variant="light"
      header-tag="header"
    >
      <template #header>
        <h2
          id="tray-seeding-header"
          data-cy="tray-seeding-header"
          class="text-center"
        >
          Tray Seeding
        </h2>
      </template>

      <BForm
        id="tray-seeding-form"
        data-cy="tray-seeding-form"
      >
        <!-- Seeding Date -->
        <DateSelector
          id="tray-seeding-date"
          data-cy="tray-seeding-date"
          required
          v-model:date="form.seedingDate"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.seedingDate = $event"
          v-on:ready="createdCount++"
        />

        <!-- Crop Selection -->
        <CropSelector
          id="tray-seeding-crop"
          data-cy="tray-seeding-crop"
          required
          v-model:selected="form.cropName"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.cropName = $event"
          v-on:ready="createdCount++"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
        />

        <!-- Location Selection -->
        <LocationSelector
          id="tray-seeding-location"
          data-cy="tray-seeding-location"
          required
          includeGreenhouses
          v-model:selected="form.locationName"
          v-bind:allowBedSelection="false"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.locationName = $event"
          v-on:ready="createdCount++"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
        />

        <hr />

        <!-- Number of Trays -->
        <NumericInput
          id="tray-seeding-trays"
          data-cy="tray-seeding-trays"
          required
          label="Trays"
          invalidFeedbackText="Trays must be positive."
          v-model:value="form.trays"
          v-bind:showValidityStyling="validity.show"
          v-bind:decimalPlaces="2"
          v-bind:incDecValues="[1, 5, 10]"
          v-bind:minValue="0.01"
          v-on:valid="validity.trays = $event"
          v-on:ready="createdCount++"
        />

        <!-- Tray Size -->
        <TraySizeSelector
          id="tray-seeding-tray-size"
          data-cy="tray-seeding-tray-size"
          required
          v-model:selected="form.traySize"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.traySize = $event"
          v-on:ready="createdCount++"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
        />

        <!-- Number of Seed / Cell -->
        <NumericInput
          id="tray-seeding-seeds"
          data-cy="tray-seeding-seeds"
          required
          label="Seeds/Cell"
          invalidFeedbackText="Seeds must be positive."
          v-model:value="form.seedsPerCell"
          v-bind:showValidityStyling="validity.show"
          v-bind:decimalPlaces="0"
          v-bind:incDecValues="[1]"
          v-bind:minValue="1"
          v-on:valid="validity.seedsPerCell = $event"
          v-on:ready="createdCount++"
        />

        <!-- Total Seeds -->
        <TextDisplay
          id="tray-seeding-total-seeds"
          data-cy="tray-seeding-total-seeds"
          label="Total Seeds"
          v-bind:text="totalSeeds"
          v-on:ready="createdCount++"
        />

        <hr />
        <!-- Comment Box -->
        <CommentBox
          id="tray-seeding-comment"
          data-cy="tray-seeding-comment"
          v-model:comment="form.comment"
          v-on:valid="validity.comment = $event"
          v-on:ready="createdCount++"
        />

        <!-- Submit and Reset Buttons -->
        <SubmitResetButtons
          id="seeding-submit-reset"
          data-cy="seeding-submit-reset"
          v-bind:enableSubmit="submitEnabled"
          v-bind:enableReset="resetEnabled"
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
  </div>
</template>

<script>
import dayjs from 'dayjs';
import CropSelector from '@comps/CropSelector/CropSelector.vue';
import DateSelector from '@comps/DateSelector/DateSelector.vue';
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import NumericInput from '@comps/NumericInput/NumericInput.vue';
import TraySizeSelector from '@comps/TraySizeSelector/TraySizeSelector.vue';
import TextDisplay from '@comps/TextDisplay/TextDisplay.vue';
import CommentBox from '@comps/CommentBox/CommentBox.vue';
import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';
import * as uiUtil from '@libs/uiUtil/uiUtil.js';
import { lib } from './lib.js';

export default {
  components: {
    CropSelector,
    DateSelector,
    LocationSelector,
    NumericInput,
    TraySizeSelector,
    TextDisplay,
    CommentBox,
    SubmitResetButtons,
  },
  data() {
    return {
      form: {
        seedingDate: dayjs().format('YYYY-MM-DD'),
        cropName: null,
        locationName: null,
        trays: 1,
        traySize: null,
        seedsPerCell: 1,
        comment: null,
      },
      validity: {
        show: false,
        seedingDate: false,
        cropName: false,
        locationName: false,
        trays: false,
        traySize: false,
        seedsPerCell: false,
        comment: false,
      },
      submitting: false,
      errorShowing: false,
      createdCount: 0,
    };
  },
  computed: {
    totalSeeds() {
      return (
        this.form.trays *
        parseInt(this.form.traySize) *
        this.form.seedsPerCell
      ).toLocaleString(undefined);
    },
    pageDoneLoading() {
      return this.createdCount == 10;
    },
    submitEnabled() {
      return !this.validity.show || (this.validToSubmit && !this.submitting);
    },
    resetEnabled() {
      return !this.submitting;
    },
    validToSubmit() {
      return Object.entries(this.validity)
        .filter(([key]) => key !== 'show')
        .every((item) => item[1] === true);
    },
  },
  methods: {
    submit() {
      this.submitting = true;
      this.validity.show = true;

      // If all of the form values are valid...
      if (this.validToSubmit) {
        uiUtil.showToast(
          'Submitting tray seeding...',
          '',
          'top-center',
          'success'
        );

        lib
          .submitForm({ ...this.form })
          .then(() => {
            uiUtil.hideToast();
            uiUtil
              .showToast(
                'Tray seeding created.',
                '',
                'top-center',
                'success',
                2
              )
              .then(() => {
                this.reset(true);
                this.submitting = false;
              });
          })
          .catch(() => {
            if (!this.errorShown) {
              uiUtil.hideToast();
              this.errorShowing = true;
              uiUtil
                .showToast(
                  'Error creating tray seeding.',
                  'Check your network connection and try again.',
                  'top-center',
                  'danger',
                  5
                )
                .then(() => {
                  this.submitting = false;
                  this.errorShowing = false;
                });
            }
          });
      } else {
        this.submitting = false;
      }
    },
    reset(sticky = false) {
      this.validity.show = false;

      if (!sticky) {
        this.form.seedingDate = dayjs().format('YYYY-MM-DD');
        this.form.locationName = null;
      }

      this.form.cropName = null;
      this.form.trays = 1;
      this.form.traySize = null;
      this.form.seedsPerCell = 1;
      this.form.comment = null;
    },
  },
  watch: {},
  created() {
    this.createdCount++;

    if (window.Cypress) {
      document.defaultView.lib = lib;
    }
  },
};
</script>

<style>
@import url('@css/fd2-mobile.css');

#tray-seeding-date {
  margin-top: 2px;
  margin-bottom: 8px;
}

#tray-seeding-crop,
#tray-seeding-location,
#tray-seeding-tray-size,
#tray-seeding-seeds {
  margin-bottom: 8px;
}

#tray-seeding-trays {
  margin-top: 2px;
  margin-bottom: 8px;
}

#tray-seeding-comment {
  margin-bottom: 15px;
}
</style>
