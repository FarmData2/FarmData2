<template>
  <div
    id="%ID_PREFIX%"
    data-cy="%ID_PREFIX%"
  >
    <BToaster
      id="%ID_PREFIX%-toaster"
      data-cy="%ID_PREFIX%-toaster"
    />
    <BCard
      id="%ID_PREFIX%-card"
      data-cy="%ID_PREFIX%-card"
      bg-variant="light"
      header-tag="header"
    >
      <template #header>
        <h2
          id="%ID_PREFIX%-header"
          data-cy="%ID_PREFIX%-header"
          class="text-center"
        >
          %ENTRY_POINT%
        </h2>
      </template>

      <BForm
        id="%ID_PREFIX%-form"
        data-cy="%ID_PREFIX%-form"
      >
        <!-- Date -->
        <DateSelector
          id="%ID_PREFIX%-date"
          data-cy="%ID_PREFIX%-date"
          required
          v-model:date="form.date"
          v-bind:showValidityStyling="validity.show"
          v-on:valid="validity.date = $event"
          v-on:ready="createdCount++"
        />

        <!-- Add additional form elements here. -->

        <hr />
        <!-- Comment Box -->
        <CommentBox
          id="%ID_PREFIX%-comment"
          data-cy="%ID_PREFIX%-comment"
          v-model:comment="form.comment"
          v-on:valid="validity.comment = $event"
          v-on:ready="createdCount++"
        />

        <!-- Submit and Reset Buttons -->
        <SubmitResetButtons
          id="%ID_PREFIX%-submit-reset"
          data-cy="%ID_PREFIX%-submit-reset"
          v-bind:enableSubmit="enableSubmit"
          v-bind:enableReset="enableReset"
          v-on:ready="createdCount++"
          v-on:submit="submit()"
          v-on:reset="reset()"
        />
      </BForm>
    </BCard>

    <!-- Do not change this div. It is used by the e2e tests.-->
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
import DateSelector from '@comps/DateSelector/DateSelector.vue';
import CommentBox from '@comps/CommentBox/CommentBox.vue';
import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';
import * as uiUtil from '@libs/uiUtil/uiUtil.js';
import * as lib from './lib.js';

export default {
  components: {
    DateSelector,
    CommentBox,
    SubmitResetButtons,
  },
  data() {
    return {
      form: {
        date: dayjs().format('YYYY-MM-DD'),
        comment: null,
      },
      validity: {
        show: false,
        date: false,
        comment: false,
      },
      enableSubmit: true,
      enableReset: true,
      errorShown: false,
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      /*
       * To find the value to use here, count one for each component in the template
       * and one for the created() hook. This is ultimately used to allow tests
       * to ensure that the full page has loaded before testing page elements.
       */
      return this.createdCount == 4;
    },
  },
  methods: {
    submit() {
      this.validity.show = true;

      // If all of the form values are valid...
      if (Object.values(this.validity).every((item) => item === true)) {
        // Disable submit and reset while the form is being submitted
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
              'Error creating %ENTRY_POINT%.',
              'Check your network connection and try again.'
            );
            this.enableSubmit = true;
          });
      } else {
        /*
         * Some value is not valid. Disable the Submit button until the values
         * have been edited to be valid. See watch.validity below.
         */
        this.enableSubmit = false;
      }
    },
    reset(sticky = false) {
      this.validity.show = false;

      if (!sticky) {
        /*
         * Only reset these form elements if the reset is not sticky.
         * Typically just when the user has clicked the 'Reset' button.
         */
        this.form.date = dayjs().format('YYYY-MM-DD');
      }

      /*
       * Reset these form elements anytime the form is reset.
       * This will be when the user clicks the 'Reset' button,
       * or when the form has been successfully submitted.
       */
      this.form.comment = null;
      this.enableSubmit = true;
    },
    showErrorToast(title, message) {
      if (!this.errorShown) {
        this.errorShown = true;
        this.enableSubmit = false;
        this.enableReset = false;

        uiUtil.showToast(title, message, 'top-center', 'danger');
      }
    },
  },
  watch: {
    validity: {
      handler() {
        /*
         * If a form element is invalid when the "Submit Button" is clicked.
         * This function watches the validity values of the fields and and
         * re-enables the submit button if all of the values have been
         * edited to be valid.
         */
        if (Object.values(this.validity).every((item) => item === true)) {
          this.enableSubmit = true;
        }
      },
      deep: true,
    },
  },
  created() {
    /*
     * Place any code here that needs to be run when the page has
     * been created in the browser.
     */

    this.createdCount++;
  },
};
</script>

<style>
@import url('@css/fd2-mobile.css');

#%ID_PREFIX%-date {
  margin-top: 2px;
  margin-bottom: 8px;
}

#%ID_PREFIX%-comment {
  margin-bottom: 15px;
}
</style>
