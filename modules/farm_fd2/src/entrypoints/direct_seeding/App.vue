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
          Direct Seeding
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
          id="seeding-bed-feet"
          data-cy="seeding-bed-feet"
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
          id="seeding-bed-width"
          data-cy="seeding-bed-width"
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
          id="seeding-rows"
          data-cy="seeding-rows"
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

        <!-- Equipment Selector-->
        <BAccordion
          flush
          id="equipment-accordion"
          data-cy="equipment-accordion"
        >
          <BAccordionItem title="Equipment">
            <EquipmentSelector
              id="seeding-equipment"
              data-cy="seeding-equipment"
              v-model:selected="form.equipment"
              v-bind:showValidityStyling="validity.show"
              v-on:valid="validity.equipment = $event"
              v-on:ready="createdCount++"
              v-on:error="(msg) => showErrorToast('Network Error', msg)"
            />
          </BAccordionItem>
        </BAccordion>
        <hr />

        <p>More stuff here</p>

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
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';
import EquipmentSelector from '@comps/EquipmentSelector/EquipmentSelector.vue';
import CommentBox from '@comps/CommentBox/CommentBox.vue';
import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';
import * as uiUtil from '@libs/uiUtil/uiUtil.js';
//import * as lib from './lib.js';

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

      if (Object.values(this.validity).every((item) => item === true)) {
        this.disableSubmit = true;
        this.disableReset = true;

        uiUtil.showToast(
          'Submitting direct seeding...',
          '',
          'top-center',
          'success'
        );

        console.dir(this.form);

        this.reset(true);
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
      }

      this.form.cropName = null;
      this.form.comment = null;
      this.enableSubmit = true;
    },
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 10;
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
#seeding-bed-feet,
#seeding-bed-width,
#seeding-equipment-selector {
  margin-bottom: 8px;
}

#seeding-equipment {
  margin-top: 3px;
}

#seeding-comment {
  margin-bottom: 15px;
}
</style>
