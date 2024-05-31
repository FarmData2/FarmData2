<template>
  <div
    id="direct-seeding"
    data-cy="direct-seeding"
  >
    <BToaster
      id="direct-seeding-toaster"
      data-cy="direct-seeding-toaster"
    />
    <BCard
      id="direct-seeding-card"
      data-cy="direct-seeding-card"
      bg-variant="light"
      header-tag="header"
    >
      <template #header>
        <h2
          id="direct-seeding-header"
          data-cy="direct-seeding-header"
          class="text-center"
        >
          Direct Seeding
        </h2>
      </template>

      <BForm
        id="direct-seeding-form"
        data-cy="direct-seeding-form"
      >
        <!-- Seeding Date -->
        <DateSelector
          id="direct-seeding-date"
          data-cy="direct-seeding-date"
          required
          v-model:date="form.seedingDate"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.seedingDate = $event"
          v-on:ready="createdCount++"
        />

        <!-- Crop Selection -->
        <CropSelector
          id="direct-seeding-crop"
          data-cy="direct-seeding-crop"
          required
          v-model:selected="form.cropName"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.cropName = $event"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
          v-on:ready="createdCount++"
        />

        <!-- Location Selection -->
        <LocationSelector
          id="direct-seeding-location"
          data-cy="direct-seeding-location"
          required
          includeFields
          includeGreenhousesWithBeds
          v-model:selected="form.locationName"
          v-bind:pickedBeds="form.beds"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.location = $event"
          v-on:update:beds="(checkedBeds) => handleBedsUpdate(checkedBeds)"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
          v-on:ready="createdCount++"
        />

        <hr />

        <!-- Bed Feet seeded -->
        <NumericInput
          id="direct-seeding-bed-feet"
          data-cy="direct-seeding-bed-feet"
          required
          label="Bed Feet"
          invalidFeedbackText="Bed Feet must be positive."
          v-model:value="form.bedFeet"
          v-bind:showValidityStyling="validity.show"
          v-bind:decimalPlaces="0"
          v-bind:incDecValues="[1, 10, 100]"
          v-bind:minValue="1"
          v-on:valid="validity.bedFeet = $event"
          v-on:ready="createdCount++"
        />

        <!-- Bed Width -->
        <NumericInput
          id="direct-seeding-bed-width"
          data-cy="direct-seeding-bed-width"
          required
          label="Bed Width (in)"
          invalidFeedbackText="Bed width must be positive."
          v-model:value="form.bedWidth"
          v-bind:showValidityStyling="validity.show"
          v-bind:decimalPlaces="0"
          v-bind:incDecValues="[1, 10]"
          v-bind:minValue="1"
          v-on:valid="validity.bedWidth = $event"
          v-on:ready="createdCount++"
        />

        <!-- Rows/Bed -->
        <SelectorBase
          id="direct-seeding-rows-per-bed"
          data-cy="direct-seeding-rows-per-bed"
          label="Rows/Bed"
          invalidFeedbackText="A number of rows is required"
          v-model:selected="form.rowsPerBed"
          v-bind:options="rowValues"
          v-bind:required="true"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.rowsPerBed = $event"
          v-on:ready="createdCount++"
        />

        <hr />

        <!-- Equipment & Soil Disturbance-->
        <BAccordion
          flush
          id="direct-seeding-soil-disturbance-accordion"
          data-cy="direct-seeding-soil-disturbance-accordion"
        >
          <BAccordionItem
            id="direct-seeding-soil-disturbance-accordion-item"
            data-cy="direct-seeding-soil-disturbance-accordion-item"
          >
            <template #title>
              <span
                id="direct-seeding-soil-disturbance-accordion-title"
                data-cy="direct-seeding-soil-disturbance-accordion-title"
                class="w-100 text-center"
              >
                Equipment & Soil Disturbance
              </span>
            </template>

            <!-- Soil Disturbance -->
            <SoilDisturbance
              id="direct-seeding-soil-disturbance"
              data-cy="direct-seeding-soil-disturbance"
              v-bind:showValidityStyling="validity.show"
              v-bind:equipment="form.equipment"
              v-bind:depth="form.depth"
              v-bind:speed="form.speed"
              v-bind:includeArea="false"
              v-on:valid="validity.soilDisturbance = $event"
              v-on:update:equipment="form.equipment = $event"
              v-on:update:depth="form.depth = $event"
              v-on:update:speed="form.speed = $event"
              v-on:error="(msg) => showErrorToast('Network Error', msg)"
              v-on:ready="createdCount++"
            />
          </BAccordionItem>
        </BAccordion>

        <hr />

        <!-- Comment Box -->
        <CommentBox
          id="direct-seeding-comment"
          data-cy="direct-seeding-comment"
          v-model:comment="form.comment"
          v-on:valid="validity.comment = $event"
          v-on:ready="createdCount++"
        />

        <!-- Submit and Reset Buttons -->
        <SubmitResetButtons
          id="direct-seeding-submit-reset"
          data-cy="direct-seeding-submit-reset"
          v-bind:enableSubmit="submitEnabled"
          v-bind:enableReset="resetEnabled"
          v-on:ready="createdCount++"
          v-on:submit="submit()"
          v-on:reset="reset()"
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
</template>

<script>
import dayjs from 'dayjs';
import CropSelector from '@comps/CropSelector/CropSelector.vue';
import DateSelector from '@comps/DateSelector/DateSelector.vue';
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import NumericInput from '@comps/NumericInput/NumericInput.vue';
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';
import SoilDisturbance from '@comps/SoilDisturbance/SoilDisturbance.vue';
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
    SelectorBase,
    SoilDisturbance,
    CommentBox,
    SubmitResetButtons,
  },
  data() {
    return {
      rowValues: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      form: {
        seedingDate: dayjs().format('YYYY-MM-DD'),
        cropName: null,
        locationName: null,
        beds: [],
        bedFeet: 100,
        rowsPerBed: '1',
        bedWidth: 60,
        equipment: [],
        depth: 0,
        speed: 0,
        comment: null,
      },
      validity: {
        show: false,
        seedingDate: false,
        cropName: false,
        location: false,
        bedFeet: false,
        rowsPerBed: false,
        bedWidth: false,
        soilDisturbance: false,
        comment: false,
      },
      submitting: false,
      errorShowing: false,
      createdCount: 0,
    };
  },
  computed: {
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
    handleBedsUpdate(checkedBeds) {
      this.form.beds = checkedBeds;
    },
    submit() {
      this.submitting = true;
      this.validity.show = true;

      if (this.validToSubmit) {
        uiUtil.showToast(
          'Submitting direct seeding...',
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
                'Direct seeding created.',
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
                  'Error creating direct seeding.',
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
        this.form.rowsPerBed = '1';
        this.form.bedWidth = 60;
        this.form.equipment = [];
        this.form.depth = 0;
        this.form.speed = 0;
      }

      this.form.cropName = null;
      this.form.beds = [];
      this.form.bedFeet = 100;
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

#direct-seeding-date {
  margin-top: 2px;
  margin-bottom: 8px;
}

#direct-seeding-crop,
#direct-seeding-location,
#direct-seeding-bed-feet,
#direct-seeding-bed-width,
#direct-seeding-equipment-selector {
  margin-bottom: 8px;
}

#direct-seeding-equipment {
  margin-top: 3px;
}

#direct-seeding-soil-disturbance-depth,
#direct-seeding-soil-disturbance-speed {
  margin-top: 8px;
}

#direct-seeding-comment {
  margin-bottom: 15px;
}
</style>
