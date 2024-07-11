<template>
  <div
    id="soil-disturbance"
    data-cy="soil-disturbance"
  >
    <BToaster
      id="soil-disturbance-toaster"
      data-cy="soil-disturbance-toaster"
    />
    <BCard
      id="soil-disturbance-card"
      data-cy="soil-disturbance-card"
      bg-variant="light"
      header-tag="header"
    >
      <template #header>
        <h2
          id="soil-disturbance-header"
          data-cy="soil-disturbance-header"
          class="text-center"
        >
          Soil Disturbance
        </h2>
      </template>

      <BForm
        id="soil-disturbance-form"
        data-cy="soil-disturbance-form"
      >
        <!-- Date -->
        <DateSelector
          id="soil-disturbance-date"
          data-cy="soil-disturbance-date"
          required
          v-model:date="form.date"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="
            (valid) => {
              validity.date = valid;
            }
          "
          v-on:ready="createdCount++"
        />

        <!-- Location Selection -->
        <LocationSelector
          id="soil-disturbance-location"
          data-cy="soil-disturbance-location"
          required
          includeFields
          includeGreenhousesWithBeds
          v-model:selected="form.location"
          v-bind:pickedBeds="form.beds"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.location = $event"
          v-on:update:beds="
            (checkedBeds, totalBeds) => handleBedsUpdate(checkedBeds, totalBeds)
          "
          v-on:update:selected="(location) => handleLocationUpdate(location)"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
          v-on:ready="createdCount++"
        />

        <!-- Termination Event -->
        <BFormGroup
          id="termination-event-group"
          data-cy="termination-event-group"
          label-for="termination-event-checkbox"
          label-cols="auto"
          label-align="end"
          v-if="plantsAtLocation"
        >
          <template v-slot:label>
            <span
              id="termination-event-label"
              data-cy="termination-event-label"
              class="p-0"
              >Termination Event:</span
            >
          </template>

          <BFormCheckbox
            id="termination-event-checkbox"
            data-cy="termination-event-checkbox"
            v-model="form.termination"
            size="lg"
          />
        </BFormGroup>
        <hr />

        <!-- Equipment -->
        <div
          id="soil-disturbance-equipment-main"
          data-cy="soil-disturbance-equipment-main"
        >
          <div
            id="soil-disturbance-equipment-title"
            data-cy="soil-disturbance-equipment-title"
          >
            <span> Equipment </span>
          </div>

          <!-- Soil Disturbance -->
          <SoilDisturbance
            id="soil-disturbance-equipment-form"
            data-cy="soil-disturbance-equipment-form"
            required
            v-bind:showValidityStyling="validity.show"
            v-bind:equipment="form.equipment"
            v-bind:depth="form.depth"
            v-bind:speed="form.speed"
            v-bind:area="form.area"
            v-bind:passes="form.passes"
            v-bind:includePasses="true"
            v-on:valid="validity.soilDisturbance = $event"
            v-on:update:equipment="form.equipment = $event"
            v-on:update:depth="form.depth = $event"
            v-on:update:speed="form.speed = $event"
            v-on:update:area="form.area = $event"
            v-on:update:passes="form.passes = $event"
            v-on:error="(msg) => showErrorToast('Network Error', msg)"
            v-on:ready="createdCount++"
          />
        </div>
        <hr />
        <!-- Comment Box -->
        <CommentBox
          id="soil-disturbance-comment"
          data-cy="soil-disturbance-comment"
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
          id="soil-disturbance-submit-reset"
          data-cy="soil-disturbance-submit-reset"
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
import DateSelector from '@comps/DateSelector/DateSelector.vue';
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import SoilDisturbance from '@comps/SoilDisturbance/SoilDisturbance.vue';
import CommentBox from '@comps/CommentBox/CommentBox.vue';
import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';
import * as uiUtil from '@libs/uiUtil/uiUtil.js';
import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

export default {
  components: {
    DateSelector,
    CommentBox,
    SoilDisturbance,
    SubmitResetButtons,
    LocationSelector,
  },
  data() {
    return {
      form: {
        date: dayjs().format('YYYY-MM-DD'),
        location: null,
        beds: [],
        termination: false,
        affectedPlants: [],
        equipment: [],
        depth: 0,
        speed: 0,
        passes: 1,
        area: 100,
        comment: '',
      },
      validity: {
        show: false,
        date: false,
        location: false,
        soilDisturbance: false,
        comment: false,
      },
      submitting: false,
      errorShowing: false,
      createdCount: 0,
    };
  },
  computed: {
    plantsAtLocation() {
      return this.form.affectedPlants.length > 0;
    },
    pageDoneLoading() {
      return this.createdCount === 6;
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
    async checkPlantsAtLocation() {
      if (this.form.location) {
        try {
          let results = await farmosUtil.getPlantAssets(
            this.form.location,
            this.form.beds,
            false,
            true
          );
          this.form.affectedPlants = results;
        } catch (error) {
          console.error('Error fetching plant assets:', error);
          this.form.affectedPlants = [];
        }
      } else {
        this.form.affectedPlants = [];
      }
    },
    handleLocationUpdate(location) {
      this.form.location = location;
      this.checkPlantsAtLocation();
    },
    handleBedsUpdate(checkedBeds, totalBeds) {
      this.form.beds = checkedBeds;
      if (totalBeds > 0 && checkedBeds.length > 0) {
        this.form.area = (checkedBeds.length / totalBeds) * 100;
      } else {
        this.form.area = 100;
      }
      this.checkPlantsAtLocation();
    },
    submit() {
      this.submitting = true;
      this.validity.show = true;

      if (this.validToSubmit) {
        uiUtil.showToast(
          'Submitting Soil Disturbance...',
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
                'Soil Disturbance created.',
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
                  'Error creating Soil Disturbance records.',
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
        this.form.date = dayjs().format('YYYY-MM-DD');
        this.form.termination = false;
        this.form.equipment = [];
        this.form.depth = 0;
        this.form.speed = 0;
        this.form.passes = 1;
        this.form.comment = null;
      }

      this.form.location = null;
      this.form.beds = [];
      this.form.area = 100;
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
/* 
 * Import a set of standard CSS styles for FarmData2 
 * entry points that optimize the page for mobile devices.
 */
@import url('@css/fd2-mobile.css');
#soil-disturbance-date {
  margin-top: 2px;
  margin-bottom: 8px;
}

#soil-disturbance-location,
#soil-disturbance-equipment-selector {
  margin-bottom: 8px;
}

#soil-disturbance-equipment {
  margin-top: 3px;
}

#soil-disturbance-equipment-form-depth,
#soil-disturbance-equipment-form-speed,
#soil-disturbance-equipment-form-area,
#soil-disturbance-equipment-form-passes {
  margin-top: 8px;
}

#termination-event-group {
  display: flex;
  align-items: center;
}

#termination-event-group label {
  padding-bottom: 0px;
  padding-top: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}

#termination-event-group div.form-check.form-control-lg {
  padding-bottom: 0px;
  padding-top: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}

#soil-disturbance-comment {
  margin-bottom: 15px;
}
#soil-disturbance-equipment-title {
  text-align: center;
  background-color: #ffff;
  padding-left: 5px !important;
  padding-right: 5px !important;
  border-style: solid !important;
  border-width: var(--bs-border-width) !important;
  border-color: var(--bs-border-color-translucent) !important;
  box-shadow: none !important;
  padding-bottom: 2px;
  padding-top: 2px;
  font-size: 1.15rem;
  font-weight: 350;
}
</style>
