<template>
  <h3>%COMPONENT_NAME% Example</h3>
  <p data-cy="description">
    Short description of the component goes here.
  </p>

  <hr />

  <!-- v-model or v-bind other props and v-on additional event handlers
       here as they are added to the component. 
  -->
  <%COMPONENT_NAME%
    id="%COMPONENT_ID%"
    data-cy="%COMPONENT_ID%"
    v-bind:required="required"
    v-bind:showValidityStyling="validity.showStyling"
    v-on:valid="
      (valid) => {
        validity.valid = valid;
      }
    "
    v-on:ready="createdCount++"
  />
  <hr />

  <h5>Component Props:</h5>
  <table class="example-table">
    <thead>
      <tr>
        <th>Prop</th>
        <th>Control</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>required</td>
        <td>
          <BFormCheckbox
            id="required-checkbox"
            data-cy="required-checkbox"
            switch
            v-model="required"
          />
        </td>
      </tr>
      <tr>
        <td>showValidityStyling</td>
        <td>
          <BFormCheckbox
            id="styling-checkbox"
            data-cy="styling-checkbox"
            switch
            v-model="validity.showStyling"
          />
        </td>
      </tr>
      <!-- Add additional <tr> elements and controls for new props 
           here as they are added to the component. See the other
           examples and their App.vue files for samples -->
    </tbody>
  </table>

  <h5>Component Event Payloads</h5>
  <table class="example-table">
    <thead>
      <tr>
        <th>Event</th>
        <th>Payload</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>valid</td>
        <td>{{ validity.valid }}</td>
      </tr>
    </tbody>
  </table>

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
/*
 * Import the components being used in this example here.
 */

import %COMPONENT_NAME% from '@comps/%COMPONENT_NAME%/%COMPONENT_NAME%.vue';

export default {
  components: {
    /**
     * List the components being used in this example here.
     */
     %COMPONENT_NAME%,
  },
  data() {
    return {
      required: true,
      form: {
        /*
         * Add elements here to hold each of the values that this component collects.
         * This models how form data is collected in entry points, where the
         * form element is passed to lib.js, which uses it to submit data to
         * the farmOS server.
         */ 
      },
      validity: {
        /* 
         * Indicates if the validity styling should be shown. In this example it's
         * value is v-modeled to the toggle switch input above, and to the showValidityStyling prop
         * of the component in the template.  In an entry point this is replaced by the
         * showValidityStyling computed property.
         */
        showStyling: false,
        /*
         * Add a new element here to hold the validity of each of the components in this component.
         * See the other examples and their App.vue files for samples.
         */
        valid: true,
      },
      createdCount: 0,
    };
  },
  methods: {},
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>

<style>
@import url('@css/fd2-examples.css');
@import url('@css/fd2-mobile.css');

/**
 * This ensures that the css for this file is picked up by the builder.
 * Not sure why this is necessary, but without it the css imports
 * above are not processed.
 */
%COMPONENT_ID%-hack {
  display: none;
}
</style>
