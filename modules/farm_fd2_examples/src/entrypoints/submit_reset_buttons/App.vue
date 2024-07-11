<template>
  <h3>SubmitResetButtons Example</h3>
  <p data-cy="description">
    The SubmitResetButtons is a component for the Submit and Reset buttons used
    in forms
  </p>

  <hr />
  <SubmitResetButtons
    id="submit-reset-buttons"
    data-cy="submit-reset-buttons"
    v-model:enableReset="this.enableReset"
    v-model:enableSubmit="this.enableSubmit"
    v-on:submit="this.submitCount++"
    v-on:reset="this.resetCount++"
    v-on:ready="createdCount++"
  />
  <hr />

  <h5>Component Props:</h5>
  <table class="example-table">
    <thead>
      <th>Prop</th>
      <th>Control</th>
    </thead>
    <tbody>
      <tr>
        <td>enableReset</td>
        <td>
          <BFormCheckbox
            id="enable-reset-checkbox"
            data-cy="enable-reset-checkbox"
            switch
            v-model="this.enableReset"
          />
        </td>
      </tr>
      <tr>
        <td>enableSubmit</td>
        <td>
          <BFormCheckbox
            id="enable-submit-checkbox"
            data-cy="enable-submit-checkbox"
            switch
            v-model="this.enableSubmit"
          />
        </td>
      </tr>
    </tbody>
  </table>

  <h5>Component Event</h5>
  <table class="example-table">
    <thead>
      <th>Event</th>
      <th>Clicked Count</th>
    </thead>
    <tbody>
      <tr>
        <td>reset</td>
        <td>{{ resetCount }}</td>
      </tr>
      <tr>
        <td>submit</td>
        <td>{{ submitCount }}</td>
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
import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';

export default {
  components: {
    SubmitResetButtons,
  },
  data() {
    return {
      enableSubmit: false,
      submitCount: 0,
      enableReset: false,
      resetCount: 0,
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
  },
  watch: {
    enableSubmit() {
      this.submitEnabled = null;
    },
    enableReset() {
      this.resetEnabled = null;
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
submit-reset-buttons-hack {
  display: none;
}
</style>
