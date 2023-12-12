<template>
  <div>
    <BToaster />
    <BCard
      bg-variant="light"
      header-tag="header"
    >
      <template #header>
        <h2
          data-cy="seeding-header"
          class="text-center"
        >
          Tray Seeding
        </h2>
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
          id="seeding-crop-name"
          data-cy="seeding-crop-name"
          required
          v-model:selected="form.cropName"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.cropName = $event"
          v-on:ready="createdCount++"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
        />

        <!-- Location Selection -->
        <LocationSelector
          id="seeding-location-name"
          data-cy="seeding-location-name"
          required
          includeGreenhouses
          v-model:selected="form.locationName"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.locationName = $event"
          v-on:ready="createdCount++"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
        />

        <hr />

        <!-- Number of Trays -->
        <NumericInput
          id="seeding-trays"
          data-cy="seeding-trays"
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
          id="seeding-tray-size"
          data-cy="seeding-tray-size"
          required
          v-model:selected="form.traySize"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.traySize = $event"
          v-on:ready="createdCount++"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
        />

        <!-- Number of Seed / Cell -->
        <NumericInput
          id="seeding-seeds"
          data-cy="seeding-seeds"
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
          id="seeding-total-seeds"
          data-cy="seeding-total-seeds"
          label="Total Seeds"
          v-bind:text="totalSeeds"
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
          v-bind:enableSubmit="enableSubmit"
          v-bind:enableReset="enableReset"
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
import * as lib from './lib.js';

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
      enableSubmit: true,
      enableReset: true,
      errorShown: false,
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
  },
  methods: {
    submit() {
      this.validity.show = true;

      // If all of the form values are valid...
      if (Object.values(this.validity).every((item) => item === true)) {
        this.disableSubmit = true;
        this.disableReset = true;

        uiUtil.showToast(
          'Submitting tray seeding...',
          '',
          'top-center',
          'success'
        );

        lib
          .submitForm(this.form)
          .then(() => {
            uiUtil.hideToast();
            this.reset(true);
            uiUtil.showToast(
              'Tray seeding created.',
              '',
              'top-center',
              'success',
              2
            );
          })
          .catch(() => {
            uiUtil.hideToast();
            this.showErrorToast(
              'Error creating tray seeding.',
              'Check your network connection and try again.'
            );
            this.enableSubmit = true;
          });
      } else {
        // Some value is not valid...
        this.enableSubmit = false;
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
      this.enableSubmit = true;
    },

    showErrorToast(title, message) {
      if (!this.errorShown) {
        this.errorShown = true;
        this.enableSubmit = false;
        this.enableReset = false;

        uiUtil.showToast(title, message, 'top-center', 'danger', 5);
      }
    },
  },
  watch: {
    validity: {
      handler() {
        if (Object.values(this.validity).every((item) => item === true)) {
          this.enableSubmit = true;
        }
      },
      deep: true,
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

#seeding-crop-name,
#seeding-location-name,
#seeding-tray-size,
#seeding-seeds {
  margin-bottom: 8px;
}

#seeding-trays {
  margin-top: 2px;
  margin-bottom: 8px;
}

#seeding-comment {
  margin-bottom: 15px;
}
</style>
