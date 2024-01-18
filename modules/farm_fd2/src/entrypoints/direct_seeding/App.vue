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
          v-on:ready="createdCount++"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
        />

        <!-- Location Selection -->
        <LocationSelector
          id="direct-seeding-location"
          data-cy="direct-seeding-location"
          required
          includeFields
          v-model:selected="form.locationName"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.locationName = $event"
          v-on:ready="createdCount++"
          v-on:error="(msg) => showErrorToast('Network Error', msg)"
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
          id="direct-seeding-equipment-accordion"
          data-cy="direct-seeding-equipment-accordion"
        >
          <BAccordionItem
            id="direct-seeding-equipment-accordion-item"
            data-cy="direct-seeding-equipment-accordion-item"
          >
            <template #title>
              <span
                id="direct-seeding-equipment-accordion-title"
                data-cy="direct-seeding-equipment-accordion-title"
                class="w-100 text-center"
              >
                Equipment & Soil Disturbance
              </span>
            </template>

            <!-- Equipment -->
            <EquipmentSelector
              id="direct-seeding-equipment-selector"
              data-cy="direct-seeding-equipment-selector"
              v-model:selected="form.equipment"
              v-bind:showValidityStyling="validity.show"
              v-on:valid="validity.equipment = $event"
              v-on:ready="createdCount++"
              v-on:error="(msg) => showErrorToast('Network Error', msg)"
            />

            <!-- Soil Disturbance Depth -->
            <NumericInput
              id="direct-seeding-soil-disturbance-depth"
              data-cy="direct-seeding-soil-disturbance-depth"
              v-show="form.equipment.length > 0"
              required
              label="Depth (in)"
              invalidFeedbackText="Depth must be a non-negative number."
              v-model:value="form.depth"
              v-bind:showValidityStyling="validity.show"
              v-bind:decimalPlaces="1"
              v-bind:incDecValues="[1, 6]"
              v-bind:minValue="0"
              v-on:valid="validity.depth = $event"
              v-on:ready="createdCount++"
            />

            <!-- Soil Disturbance Speed -->
            <NumericInput
              id="direct-seeding-soil-disturbance-speed"
              data-cy="direct-seeding-soil-disturbance-speed"
              v-show="form.equipment.length > 0"
              required
              label="Speed (mph)"
              invalidFeedbackText="Speed must be a non-negative number."
              v-model:value="form.speed"
              v-bind:showValidityStyling="validity.show"
              v-bind:decimalPlaces="1"
              v-bind:incDecValues="[1, 5]"
              v-bind:minValue="0"
              v-on:valid="validity.speed = $event"
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
          v-bind:enableSubmit="enableSubmit"
          v-bind:enableReset="enableReset"
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
import EquipmentSelector from '@comps/EquipmentSelector/EquipmentSelector.vue';
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
    SelectorBase,
    EquipmentSelector,
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
        locationName: false,
        bedFeet: false,
        rowsPerBed: false,
        bedWidth: false,
        equipment: false,
        depth: false,
        speed: false,
        comment: false,
      },
      enableSubmit: true,
      enableReset: true,
      errorShown: false,
      createdCount: 0,
    };
  },
  methods: {
    submit() {
      this.validity.show = true;

      if (this.canSubmit) {
        this.disableSubmit = true;
        this.disableReset = true;

        uiUtil.showToast(
          'Submitting direct seeding...',
          '',
          'top-center',
          'success'
        );

        lib
          .submitForm(this.form)
          .then(() => {
            uiUtil.hideToast();
            this.reset(true); // keep sticky parts.
            uiUtil.showToast(
              'Direct seeding created.',
              '',
              'top-center',
              'success',
              2
            );
          })
          .catch(() => {
            uiUtil.hideToast();
            this.showErrorToast(
              'Error creating direct seeding.',
              'Check your network connection and try again.'
            );
            this.enableSubmit = true;
          });
      } else {
        this.enableSubmit = false;
      }
    },
    reset(sticky = false) {
      this.validity.show = false;

      if (!sticky) {
        this.form.seedingDate = dayjs().format('YYYY-MM-DD');
        this.form.locationName = null;
        this.form.bedFeet = 100;
        this.form.rowsPerBed = '1';
        this.form.bedWidth = 60;
        this.form.equipment = [];
        this.form.depth = 0;
        this.form.speed = 0;
      }

      this.form.cropName = null;
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
  computed: {
    canSubmit() {
      const required =
        this.validity.seedingDate &&
        this.validity.cropName &&
        this.validity.locationName &&
        this.validity.bedFeet &&
        this.validity.rowsPerBed &&
        this.validity.bedWidth;

      if (!this.validity.equipment) {
        // No equipment selected so speed and depth will not be used.
        return required;
      } else {
        // If equipment is selected then valid speed and depth are required.
        return required && this.validity.depth && this.validity.speed;
      }
    },
    pageDoneLoading() {
      return this.createdCount == 12;
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
