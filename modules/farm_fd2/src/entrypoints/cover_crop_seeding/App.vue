<template>
  <div
    id="cover-crop-seeding"
    data-cy="cover-crop-seeding"
  >
    <BToaster
      id="cover-crop-seeding-toaster"
      data-cy="cover-crop-seeding-toaster"
    />

    <BCard
      id="cover-crop-seeding-card"
      data-cy="cover-crop-seeding-card"
      bg-variant="light"
      header-tag="header"
    >
      <template #header>
        <h2
          id="cover-crop-seeding-header"
          data-cy="cover-crop-seeding-header"
          class="text-center"
        >
          Cover Crop Seeding
        </h2>
      </template>

      <BForm
        id="cover-crop-seeding-form"
        data-cy="cover-crop-seeding-form"
      >
        <DateSelector
          id="cover-crop-seeding-date"
          data-cy="cover-crop-seeding-date"
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

        <LocationSelector
          id="cover-crop-seeding-location"
          data-cy="cover-crop-seeding-location"
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
            (checkedBeds, totalBeds) => handleBedsUpdate(checkedBeds, totalBeds)
          "
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
          v-on:ready="createdCount++"
        />

        <MultiCropSelector
          id="cover-crop-seeding-crops"
          data-cy="cover-crop-seeding-crops"
          required
          v-model:selected="form.crops"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="
            (valid) => {
              validity.crops = valid;
            }
          "
          v-on:ready="createdCount++"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
        />

        <hr />

        <NumericInput
          id="cover-crop-seeding-area-seeded"
          data-cy="cover-crop-seeding-area-seeded"
          required
          label="Area Seeded(%)"
          invalidFeedbackText="Area % must be positive."
          v-model:value="form.areaSeeded"
          v-bind:showValidityStyling="validity.show"
          v-bind:decimalPlaces="0"
          v-bind:incDecValues="[1, 10]"
          v-bind:minValue="1"
          v-on:valid="
            (valid) => {
              validity.areaSeeded = valid;
            }
          "
          v-on:ready="createdCount++"
        />

        <WinterKill
          id="cover-crop-seeding-winter-kill"
          data-cy="cover-crop-seeding-winter-kill"
          required
          v-model:date="form.winterKillDate"
          v-model:picked="form.winterKill"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="
            (valid) => {
              validity.winterKill = valid;
            }
          "
          v-on:ready="createdCount++"
        />

        <hr class="small-top" />

        <BAccordion
          flush
          id="cover-crop-seeding-seed-application-accordion"
          data-cy="cover-crop-seeding-seed-application-accordion"
        >
          <BAccordionItem
            id="cover-crop-seeding-seed-application-accordion-item"
            data-cy="cover-crop-seeding-seed-application-accordion-item"
            v-model="seedApplicationAccordionOpen"
          >
            <template #title>
              <span
                id="cover-crop-seeding-seed-application-accordion-title"
                data-cy="cover-crop-seeding-seed-application-accordion-title"
                class="w-100 text-center"
              >
                Seed Application Equipment
              </span>
            </template>

            <SoilDisturbance
              id="cover-crop-seeding-seed-application-soil-disturbance"
              data-cy="cover-crop-seeding-seed-application-soil-disturbance"
              v-bind:showValidityStyling="validity.show"
              v-bind:equipment="form.seedApplicationEquipment"
              v-bind:depth="form.seedApplicationDepth"
              v-bind:speed="form.seedApplicationSpeed"
              v-bind:includeArea="false"
              v-bind:includePasses="false"
              v-on:valid="
                (valid) => {
                  validity.seedApplication = valid;
                }
              "
              v-on:update:equipment="
                (equipment) => {
                  form.seedApplicationEquipment = equipment;
                }
              "
              v-on:update:depth="
                (depth) => {
                  form.seedApplicationDepth = depth;
                }
              "
              v-on:update:speed="
                (speed) => {
                  form.seedApplicationSpeed = speed;
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

        <BAccordion
          flush
          id="cover-crop-seeding-seed-incorporation-accordion"
          data-cy="cover-crop-seeding-seed-incorporation-accordion"
        >
          <BAccordionItem
            id="cover-crop-seeding-seed-incorporation-accordion-item"
            data-cy="cover-crop-seeding-seed-incorporation-accordion-item"
            v-model="seedIncorporationAccordionOpen"
          >
            <template #title>
              <span
                id="cover-crop-seeding-seed-incorporation-accordion-title"
                data-cy="cover-crop-seeding-seed-incorporation-accordion-title"
                class="w-100 text-center"
              >
                Seed Incorporation Equipment
              </span>
            </template>

            <SoilDisturbance
              id="cover-crop-seeding-seed-incorporation-soil-disturbance"
              data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"
              v-bind:showValidityStyling="validity.show"
              v-bind:equipment="form.seedIncorporationEquipment"
              v-bind:depth="form.seedIncorporationDepth"
              v-bind:speed="form.seedIncorporationSpeed"
              v-bind:includeArea="false"
              v-bind:includePasses="false"
              v-on:valid="
                (valid) => {
                  validity.seedIncorporation = valid;
                }
              "
              v-on:update:equipment="
                (equipment) => {
                  form.seedIncorporationEquipment = equipment;
                }
              "
              v-on:update:depth="
                (depth) => {
                  form.seedIncorporationDepth = depth;
                }
              "
              v-on:update:speed="
                (speed) => {
                  form.seedIncorporationSpeed = speed;
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

        <CommentBox
          id="cover-crop-seeding-comment"
          data-cy="cover-crop-seeding-comment"
          v-model:comment="form.comment"
          v-on:valid="
            (valid) => {
              validity.comment = valid;
            }
          "
          v-on:ready="createdCount++"
        />

        <SubmitResetButtons
          id="cover-crop-seeding-submit-reset"
          data-cy="cover-crop-seeding-submit-reset"
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
import MultiCropSelector from '@comps/MultiCropSelector/MultiCropSelector.vue';
import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import NumericInput from '@comps/NumericInput/NumericInput.vue';
import WinterKill from '@comps/WinterKill/WinterKill.vue';
import SoilDisturbance from '@comps/SoilDisturbance/SoilDisturbance.vue';
import CommentBox from '@comps/CommentBox/CommentBox.vue';
import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';
import * as uiUtil from '@libs/uiUtil/uiUtil.js';
import { lib } from './lib.js';

export default {
  components: {
    DateSelector,
    MultiCropSelector,
    LocationSelector,
    NumericInput,
    WinterKill,
    SoilDisturbance,
    CommentBox,
    SubmitResetButtons,
  },
  data() {
    return {
      form: {
        date: dayjs().format('YYYY-MM-DD'),
        location: null,
        crops: [],
        beds: [],
        areaSeeded: '',
        winterKill: false,
        winterKillDate: null,
        seedApplicationEquipment: [],
        seedApplicationDepth: 0,
        seedApplicationSpeed: 0,
        seedIncorporationEquipment: [],
        seedIncorporationDepth: 0,
        seedIncorporationSpeed: 0,
        comment: null,
      },
      validity: {
        show: false,
        date: false,
        location: false,
        crops: false,
        areaSeeded: false,
        winterKill: false,
        seedApplication: false,
        seedIncorporation: false,
        comment: false,
      },
      submitting: false,
      errorShowing: false,
      createdCount: 0,
      seedApplicationAccordionOpen: false,
      seedIncorporationAccordionOpen: false,
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
    handleBedsUpdate(checkedBeds, totalBeds) {
      this.form.beds = checkedBeds;
      if (totalBeds > 0 && checkedBeds.length > 0) {
        this.form.areaSeeded = (checkedBeds.length / totalBeds) * 100;
      } else {
        this.form.areaSeeded = '';
      }
    },
    submit() {
      this.submitting = true;
      this.validity.show = true;

      if (this.validToSubmit) {
        uiUtil.showToast(
          'Submitting Cover Crop Seeding...',
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
                'Cover Crop Seeding created.',
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
                  'Error creating Cover Crop Seeding records.',
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
        this.form.beds = [];
        this.form.crops = [];
        this.form.areaSeeded = '';
        this.form.winterKill = false;
        this.form.winterKillDate = null;
        this.seedApplicationAccordionOpen = false;
        this.form.seedApplicationEquipment = [];
        this.form.seedApplicationDepth = 0;
        this.form.seedApplicationSpeed = 0;
        this.seedIncorporationAccordionOpen = false;
        this.form.seedIncorporationEquipment = [];
        this.form.seedIncorporationDepth = 0;
        this.form.seedIncorporationSpeed = 0;
        this.form.comment = '';
      }

      this.form.location = null;
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

.small-top {
  margin-top: 2px !important;
}

[id^='multi-crop-selector'] {
  margin-top: 0px !important;
}

#cover-crop-seeding-location,
#cover-crop-seeding-seed-incorporation-accordion {
  margin-top: 8px !important;
}

#cover-crop-seeding-area-seeded {
  margin-top: 8px;
  margin-bottom: 8px;
}

#cover-crop-seeding-date {
  margin-top: 2px;
  margin-bottom: 8px;
}

#cover-crop-seeding-comment {
  margin-bottom: 15px;
}
</style>
