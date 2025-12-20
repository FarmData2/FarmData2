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
    v-model:enableReset="enableReset"
    v-model:enableSubmit="enableSubmit"
    v-on:submit="submitCount++"
    v-on:reset="resetCount++"
    v-on:ready="handleReady"
  />
  <hr />
  <h5>Component Props:</h5>
  <table class="example-table">
    <thead>
      <tr>
        <th>Prop</th>
        <th>Control</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>enableReset</td>
        <td>
          <BFormCheckbox
            id="enable-reset-checkbox"
            data-cy="enable-reset-checkbox"
            switch
            v-model="enableReset"
          />
        </td>
        <td>{{ enableReset }}</td>
      </tr>
      <tr>
        <td>enableSubmit</td>
        <td>
          <BFormCheckbox
            id="enable-submit-checkbox"
            data-cy="enable-submit-checkbox"
            switch
            v-model="enableSubmit"
          />
        </td>
        <td>{{ enableSubmit }}</td>
      </tr>
    </tbody>
  </table>

  <h5>Component Event Payloads</h5>
  <table class="example-table">
    <thead>
      <tr>
        <th>Event</th>
        <th>Events handled</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>ready</td>
        <td>{{ readyPayload }}</td>
      </tr>
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
      enableReset: false,
      submitCount: 0,
      resetCount: 0,
      createdCount: 0,
      readyPayload: null, // now holds true/false
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount === 2;
    },
  },
  methods: {
    handleReady(isReady) {
      this.readyPayload = isReady;
      this.createdCount++;
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
