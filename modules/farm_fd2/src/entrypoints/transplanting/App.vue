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
          v-model:crop="cropFilter"
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
              v-bind:area="form.area"
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
              v-on:update:area="
                (area) => {
                  form.area = area;
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
          v-bind:enableSubmit="enableSubmit"
          v-bind:enableReset="enableReset"
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
  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
import * as uiUtil from '@libs/uiUtil/uiUtil.js';
//import * as lib from './lib';
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
      cropFilter: null,
      enableSubmit: true,
      enableReset: true,
      rowValues: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      form: {
        picked: [],
        transplantingDate: dayjs().format('YYYY-MM-DD'),
        location: '',
        beds: [],
        bedFeet: 100,
        bedWidth: 60,
        rowsPerBed: '1',
        equipment: [],
        depth: 0,
        speed: 0,
        area: 100,
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
      createdCount: 0,
    };
  },
  computed: {
    canSubmit() {
      const required =
        this.validity.picked &&
        this.validity.transplantingDate &&
        this.validity.location &&
        this.validity.bedFeet &&
        this.validity.bedWidth &&
        this.validity.rowsPerBed &&
        this.validity.soilDisturbance;

      return required;
    },
    pageDoneLoading() {
      return this.createdCount == 10;
    },
  },
  methods: {
    handleBedsUpdate(checkedBeds, totalBeds) {
      this.form.beds = checkedBeds;

      if (checkedBeds.length == 0) {
        this.form.area = 100;
      } else {
        this.form.area = (checkedBeds.length / totalBeds) * 100;
      }
    },
    submit() {
      this.validity.show = true;

      if (this.canSubmit) {
        this.disableSubmit = true;
        this.disableReset = true;

        uiUtil.showToast(
          'Submitting transplanting...',
          '',
          'top-center',
          'success'
        );

        // lib
        //   .submitForm(this.form)
        //   .then(() => {
        //     uiUtil.hideToast();
        //     this.reset(true); // keep sticky parts.
        //     uiUtil.showToast(
        //       'Direct seeding created.',
        //       '',
        //       'top-center',
        //       'success',
        //       2
        //     );
        //   })
        //   .catch(() => {
        //     uiUtil.hideToast();
        //     this.showErrorToast(
        //       'Error creating direct seeding.',
        //       'Check your network connection and try again.'
        //     );
        //     this.enableSubmit = true;
        //   });
      } else {
        this.enableSubmit = false;
      }
    },
    reset(sticky=false) {
      this.validity.show = false;

      if (!sticky) {
        this.form.transplantingDate = dayjs().format('YYYY-MM-DD');
        this.form.location = null;
        this.form.beds = [];
        this.form.bedFeet = 100;
        this.form.bedWidth = 60;
        this.form.rowsPerBed = '1';
        this.form.equipment = [];
        this.form.depth = 0;
        this.form.speed = 0;
        this.form.area = 100;
      }

      this.cropFilter = null;
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
        if (this.canSubmit) {
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
