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
        <!-- Transplanting Picklist -->
        <TransplantingPicklist
          id="transplanting-picklist"
          data-cy="transplanting-picklist"
          required="true"
          v-model:crop="form.cropName"
          v-bind:showValidityStyling="validity.show"
          v-on:update:picked="
            (picked) => {
              form.picked = picked;
            }
          "
          v-on:valid="
            (valid) => {
              validity.picked = valid;
            }
          "
          v-on:ready="createdCount++"
        />

        <hr />

        <!-- Transplanting Date -->
        <DateSelector
          id="transplanting-date"
          data-cy="transplanting-date"
          required
          v-model:date="form.transplantingDate"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="
            (valid) => {
              validity.transplantingDate = valid;
            }
          "
          v-on:ready="createdCount++"
        />

        <!-- Location Selection -->
        <LocationSelector
          id="transplanting-location"
          data-cy="transplanting-location"
          required
          includeFields
          includeGreenhousesWithBeds
          v-model:selected="form.location"
          v-bind:pickedBeds="form.beds"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="
            (valid) => {
              validity.location = valid;
            }
          "
          v-on:update:beds="
            (checkedBeds, totalBeds) => {
              handleBedsUpdate(checkedBeds, totalBeds);
            }
          "
          v-on:error="
            (msg) => {
              showErrorToast('Network Error', msg);
            }
          "
          v-on:ready="createdCount++"
        />

        <hr />

        <!-- Bed Feet transplanted -->
        <NumericInput
          id="transplanting-bed-feet"
          data-cy="transplanting-bed-feet"
          required
          label="Bed Feet"
          invalidFeedbackText="Bed Feet must be positive."
          v-model:value="form.bedFeet"
          v-bind:showValidityStyling="validity.show"
          v-bind:decimalPlaces="0"
          v-bind:incDecValues="[1, 10, 100]"
          v-bind:minValue="1"
          v-on:valid="
            (valid) => {
              validity.bedFeet = valid;
            }
          "
          v-on:ready="createdCount++"
        />

        <!-- Bed Width -->
        <NumericInput
          id="transplanting-bed-width"
          data-cy="transplanting-bed-width"
          required
          label="Bed Width (in)"
          invalidFeedbackText="Bed width must be positive."
          v-model:value="form.bedWidth"
          v-bind:showValidityStyling="validity.show"
          v-bind:decimalPlaces="0"
          v-bind:incDecValues="[1, 10]"
          v-bind:minValue="1"
          v-on:valid="
            (valid) => {
              validity.bedWidth = valid;
            }
          "
          v-on:ready="createdCount++"
        />

        <!-- Rows/Bed -->
        <SelectorBase
          id="transplanting-rows-per-bed"
          data-cy="transplanting-rows-per-bed"
          label="Rows/Bed"
          invalidFeedbackText="A number of rows is required"
          v-model:selected="form.rowsPerBed"
          v-bind:options="rowValues"
          v-bind:required="true"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="
            (valid) => {
              validity.rowsPerBed = valid;
            }
          "
          v-on:ready="createdCount++"
        />

        <hr />

        <!-- Equipment & Soil Disturbance-->
        <BAccordion
          flush
          id="transplanting-soil-disturbance-accordion"
          data-cy="transplanting-soil-disturbance-accordion"
        >
          <BAccordionItem
            id="transplanting-soil-disturbance-accordion-item"
            data-cy="transplanting-soil-disturbance-accordion-item"
          >
            <template #title>
              <span
                id="transplanting-soil-disturbance-accordion-title"
                data-cy="transplanting-soil-disturbance-accordion-title"
                class="w-100 text-center"
              >
                Equipment & Soil Disturbance
              </span>
            </template>

            <!-- Soil Disturbance -->
            <SoilDisturbance
              id="transplanting-soil-disturbance"
              data-cy="transplanting-soil-disturbance"
              v-bind:showValidityStyling="validity.show"
              v-bind:equipment="form.equipment"
              v-bind:depth="form.depth"
              v-bind:speed="form.speed"
              v-bind:includeArea="false"
              v-on:valid="
                (valid) => {
                  validity.soilDisturbance = valid;
                }
              "
              v-on:update:equipment="
                (equipment) => {
                  form.equipment = equipment;
                }
              "
              v-on:update:depth="
                (depth) => {
                  form.depth = depth;
                }
              "
              v-on:update:speed="
                (speed) => {
                  form.speed = speed;
                }
              "
              v-on:error="
                (msg) => {
                  showErrorToast('Network Error', msg);
                }
              "
              v-on:ready="createdCount++"
            />
          </BAccordionItem>
        </BAccordion>

        <hr />

        <!-- Comment Box -->
        <CommentBox
          id="transplanting-comment"
          data-cy="transplanting-comment"
          v-model:comment="form.comment"
          v-on:valid="
            (valid) => {
              validity.comment = valid;
            }
          "
          v-on:ready="createdCount++"
        />

        <!-- Submit and Reset Buttons -->
        <SubmitResetButtons
          id="transplanting-submit-reset"
          data-cy="transplanting-submit-reset"
          v-bind:enableSubmit="submitEnabled"
          v-bind:enableReset="resetEnabled"
          v-on:submit="submit()"
          v-on:reset="reset()"
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
</template>

<script>
import * as uiUtil from '@libs/uiUtil/uiUtil.js';
import { lib } from './lib.js';
import dayjs from 'dayjs';
import TransplantingPicklist from '@comps/TransplantingPicklist/TransplantingPicklist.vue';
import DateSelector from '@comps/DateSelector/DateSelector.vue';
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import NumericInput from '@comps/NumericInput/NumericInput.vue';
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';
import SoilDisturbance from '@comps/SoilDisturbance/SoilDisturbance.vue';
import CommentBox from '@comps/CommentBox/CommentBox.vue';
import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';

export default {
  components: {
    TransplantingPicklist,
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
        cropName: null,
        picked: new Map(),
        transplantingDate: dayjs().format('YYYY-MM-DD'),
        location: '',
        beds: [],
        bedFeet: 100,
        bedWidth: 60,
        rowsPerBed: '1',
        equipment: [],
        depth: 0,
        speed: 0,
        comment: '',
      },
      validity: {
        show: false,
        picked: false,
        transplantingDate: false,
        location: false,
        bedFeet: false,
        bedWidth: false,
        rowsPerBed: false,
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
          'Submitting transplanting...',
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
                'Transplanting created.',
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
            if (!this.errorShowing) {
              uiUtil.hideToast();
              this.errorShowing = true;
              uiUtil
                .showToast(
                  'Error creating transplanting.',
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
        this.form.transplantingDate = dayjs().format('YYYY-MM-DD');
        this.form.location = null;
        this.form.bedWidth = 60;
        this.form.rowsPerBed = '1';
        this.form.equipment = [];
        this.form.depth = 0;
        this.form.speed = 0;
      }

      this.form.beds = [];
      this.form.cropName = null;
      this.form.bedFeet = 100;
      this.form.comment = null;
      this.enableSubmit = true;
    },
  },
  watch: {},
  created() {
    this.createdCount++;
    if (window.Cypress) {
      /*
       * Make the lib containing the submitForm function accessible to the
       * e2e tests so that the submission test can spy on the submitForm
       * function to verify that it is receiving the correct information.
       */
      document.defaultView.lib = lib;
    }
  },
};
</script>

<style>
@import url('@css/fd2-mobile.css');

#transplanting-picklist {
  margin-top: 2px;
}

#transplanting-date,
#transplanting-location,
#transplanting-bed-feet,
#transplanting-bed-width,
#transplanting-equipment-selector {
  margin-bottom: 8px;
}

#transplanting-comment {
  margin-bottom: 15px;
}
</style>
