<template>
  <!-- 
    Every HTML element that is tested must have an id and a 
    data-cy attribute. The values of these attributes should be
    the same and should be prefixed with the name of the entry point.
    Use the examples below as a guide when adding your own elements.
  -->
  <div
    id="example-entry-point"
    data-cy="example-entry-point"
  >
    <!-- 
      The BToaster element provides an anchor for BootstrapVueNext
      Toast elements.  FarmData2 uses Toast elements to display 
      status and error messages that occur during the use of an
      entry point. 
    -->
    <BToaster
      id="example-entry-point-toaster"
      data-cy="example-entry-point-toaster"
    />
    <!-- 
      A BCard element is used to provide all a consistent look and 
      feel across all FarmData2 entry points. 
    -->
    <BCard
      id="example-entry-point-card"
      data-cy="example-entry-point-card"
      bg-variant="light"
      header-tag="header"
    >
      <!-- 
        The header of the BCard is used to display the title of
        the entry point.
      -->
      <template #header>
        <h2
          id="example-entry-point-header"
          data-cy="example-entry-point-header"
          class="text-center"
        >
          Example Entry Point
        </h2>
      </template>

      <!--
        The BForm element is a container used to hold all of the 
        components that make up the data entry form for the entry point.
      -->
      <BForm
        id="example-entry-point-form"
        data-cy="example-entry-point-form"
      >
        <!--
          Components are added here to build the data collection form 
          for the entry point.

          The components in the BForm element are typically custom
          FarmData2 components but may also be BootstrapVueNext components
          or basic HTML elements.
        -->

        <!-- Date -->
        <DateSelector
          id="example-entry-point-date"
          data-cy="example-entry-point-date"
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

        <!-- 
          Add additional form elements here.
        
          See the FarmData2 documentation for links to the documentation
          for the custom FarmData2 Vue Components.

          See the BootstrapVueNext documentation for links to the 
          documentation for its Vue Components.
        -->

        <hr />
        <!-- Comment Box -->
        <CommentBox
          id="example-entry-point-comment"
          data-cy="example-entry-point-comment"
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
          id="example-entry-point-submit-reset"
          data-cy="example-entry-point-submit-reset"
          v-bind:enableSubmit="submitEnabled"
          v-bind:enableReset="resetEnabled"
          v-on:ready="createdCount++"
          v-on:submit="submit()"
          v-on:reset="reset()"
        />
      </BForm>
    </BCard>

    <!-- 
      This invisible div is used to signal e2e tests, allowing them 
      to check if all of the page content has been loaded. 
      See the `data.createdCount` attribute and the `pageDoneLoading`
      computed property in the `<script>` section below for 
      more information.
    -->
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
import CommentBox from '@comps/CommentBox/CommentBox.vue';
import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';
import * as uiUtil from '@libs/uiUtil/uiUtil.js';
import { lib } from './lib.js';

export default {
  components: {
    DateSelector,
    CommentBox,
    SubmitResetButtons,
  },
  data() {
    return {
      /*
       * The `data.form` object is used to hold all of the data that is
       * collected from the form. This data is stored in a single
       * object so that it can be passed easily to the submitForm
       * function in the lib.js file.
       *
       * Each of the Vue Components above should use `v-model` to bind its
       * value to an attribute in the `data` object. See the `DateSelector`
       * and `CommentBox` Vue Components above for examples.
       */
      form: {
        date: dayjs().format('YYYY-MM-DD'),
        comment: null,
      },
      /*
       * The `data.validity object` is used to hold the validity values
       * for each of the Vue Components. This data is stored in a single
       * object to parallel the use of the `data.form` object.
       *
       * Each of the Vue Components above uses `v-bind` to bind its
       * `valid` prop to to an attribute in the `data.validity` object.
       * See the DateSelector and CommentBox Vue Components above for examples.
       *
       * When the `data.validity.show` attribute is `true` each Vue
       * Component will display a Bootstrap validation style based on the
       * value of the `data.validity` attribute bound to its `valid` prop.
       * If the `valid` prop is:
       * - `true` - the component is valid and will appear in green with a checkmark.
       * - `false` - the component is invalid and will appear in red with an X and feedback.
       * - `null` - the component will not be styled.
       *
       * The `data.validity.show` value is controlled by the `submit()`
       * and `reset()` methods below.
       */
      validity: {
        show: false,
        date: false,
        comment: false,
      },

      /*
       * This value will be true when the form is actively being submitted. It is
       * set to true when submit() is called and to false when the submission has
       * completed.  It is used by the submitEnabled and resetEnabled computed
       * properties to disable and enable the Submit and Reset buttons.
       */
      submitting: false,

      /*
       * This value is used to ensure that only one submission error
       * is displayed at a time. The `submitForm()` function in `lib.js` is called
       * to submit the form. If there are connectivity issues, that function
       * may generate multiple errors.  The `showErrorToast()` function
       * uses this value to ensure that only one of those errors is shown.
       */
      errorShowing: false,

      /*
       * This value counts the number of components that have been created
       * including the SFC that is the entry point.  This value is used by
       * the `pageDoneLoading` computed property to determine when all of
       * the components have been crated.  See the `pageDoneLoading` computed
       * property below for more information.
       */
      createdCount: 0,
    };
  },
  computed: {
    /*
     * This property must become `true` when all of the components
     * used by this entry point, plus the entry point's SFC itself,
     * are fully ready to be used. For example any API calls that
     * they make in their `created` hooks are complete.
     *
     * To find the value to use for comparison here, count one for each
     * FarmData2 Vue Component that is used by this entry point and add
     * one for the entry point SFC itself. BootstrapVueNext Vue Components
     * do not follow this convention and should not be counted.
     *
     * This computed property is:
     *  - bound in the invisible`page-loaded` `div` above.
     *  - incremented in response to the `ready` event in a `v-on`
     *    handler for each Vue Component used in the entry point.
     *    See the `DateSelector`,  `CommentBox` and `SubmitResetButtons`
     *    Vue Components above.
     *  - incremented when this entry point's `created` life cycle hook
     *    completes.  See the `created()` method below.
     *
     * E2e tests for this entry point will use the `cy.waitForPage()`
     * function to check this value and only continue with the test
     * when all of the components are fully ready.
     */
    pageDoneLoading() {
      return this.createdCount == 4;
    },
    /*
     * The Submit button will be enabled when this property is true.
     * This property is bound to the `enableSubmit` prop of the
     * `SubmitResetButtons` in the template.
     */
    submitEnabled() {
      return !this.validity.show || (this.validToSubmit && !this.submitting);
    },
    /*
     * The Reset button will be enabled when this property is true.
     * This property is bound to the `enableReset` prop of the
     * `SubmitResetButtons` in the template.
     */
    resetEnabled() {
      return !this.submitting;
    },
    /*
     * This method must return `true` if the values of all of the input
     * elements in the form are valid to be submitted to farmOS.
     *
     * Typically this will be when all of the attributes in `data.validity`
     * are `true`. That happens when the most recent `valid` event from
     * each FarmData2 Vue component has the value `true`.
     *
     * If a form contains any BootstrapVueNext Vue Components
     * or basic HTML input elements, then this method will have to manually
     * account for their validity as they do not emit `valid` events.
     */
    validToSubmit() {
      return Object.entries(this.validity)
        .filter(([key]) => key !== 'show')
        .every((item) => item[1] === true);
    },
  },
  methods: {
    /*
     * This method is called when the "Submit" button is clicked. See
     * the `v-on:submit` binding in the `SubmitResetButtons` Vue Component
     * in the `<template>` above.
     */
    submit() {
      this.submitting = true;
      this.validity.show = true;

      if (this.validToSubmit) {
        /*
         * Show a status message at the top of the screen
         * while the submission is processing.
         */
        uiUtil.showToast(
          'Submitting Example Entry Point...',
          '',
          'top-center',
          'success'
        );

        /*
         * Use the `submitForm()` function in `lib.js` to build
         * assets, logs and quantities based on the values in `data.form`
         * and submit them to farmOS.  We pass a copy of this.form so
         * that the tests in example_entry_point.submission.e2e.cy.js and
         * example_entry_point.submitError.e2e.cy.js have their own copy that
         * is not modified when the form is reset during testing.
         */
        lib
          .submitForm({ ...this.form })
          .then(() => {
            /*
             * If we get here, the submission was successful, so hide
             * the status message and display a success message. Then
             * reset the form and enable the Submit and Reset buttons
             * when the success message is dismissed.
             */
            uiUtil.hideToast();
            uiUtil
              .showToast(
                'Example Entry Point created.',
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
            /*
             * If we get here, the submission failed, so hide the status
             * message and display an error message.
             */
            uiUtil.hideToast();
            if (!this.errorShown) {
              this.errorShowing = true;
              uiUtil
                .showToast(
                  'Error creating Example Entry Point records.',
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
    /*
     * This method is called when the "Reset" button is clicked or when
     * a successful submission is made.
     *
     * See the `submit()` method above and the `v-on:reset` binding in
     * the `SubmitResetButtons` Vue Component in the `<template>` above.
     *
     * A reset can be "Sticky" or "Non-Sticky".
     *
     * A "Sticky" reset occurs following a successful submission.
     * During a "Sticky" reset any values that are "Sticky" are not reset.
     * "Sticky" values should be values that are likely to remain the same
     * if multiple submissions are made in sequence.
     *
     * A "Non-Sticky" reset occurs when the "Reset" button is clicked.
     * All values are reset during a "Non-Sticky" reset.
     *
     * Which values are reset on a "Sticky" reset will be different for
     * each entry point and should to be evaluated carefully and
     * then customized in this function.
     */
    reset(sticky = false) {
      this.validity.show = false;

      if (!sticky) {
        /* Reset is not sticky, so also reset the sticky values. */
        this.form.date = dayjs().format('YYYY-MM-DD');
      }

      /* Always reset the non-sticky values. */
      this.form.comment = '';
    },
  },
  watch: {},
  /*
   * The `created()` life cycle hook is called when the Vue instance
   * for the entry point has been created in the browser. This function
   * can be used to do initialization of the entry point. For example,
   * if the entry point needs data from farmOS then this function can
   * fetch that data. In most cases, data needed from farmOS is fetched
   * by the individual Vue Components used in the page and this hook
   * will simply increment `this.createdCount`.
   */
  created() {
    this.createdCount++;

    if (window.Cypress) {
      /*
       * Make the lib containing the submitForm function accessible to the
       * e2e tests so that the submission test can spy on the submitForm
       * function to verify that it is receiving the correct information.
       *
       * Note that this variable is not exposed unless we are running within
       * the Cypress test environment.
       */
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

/*
 * Include any other styles for this entry point. It is best
 * practice here to use id selectors (`#`) for the elements 
 * in the entry point.
 */
#example-entry-point-date {
  margin-top: 2px;
  margin-bottom: 8px;
}

#example-entry-point-comment {
  margin-bottom: 15px;
}
</style>
