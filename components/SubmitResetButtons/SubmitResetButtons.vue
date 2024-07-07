<template>
  <div>
    <BRow
      id="submit-reset"
      data-cy="submit-reset"
      class="grid-container"
    >
      <BCol class="submit-button-col d-flex justify-content-start">
        <BButton
          id="submit-button"
          data-cy="submit-button"
          variant="primary"
          size="lg"
          class="fd2-submit"
          v-on:click="submit()"
          v-bind:disabled="!submitEnabled"
          >Submit</BButton
        >
      </BCol>
      <BCol class="reset-button-col d-flex justify-content-end p-0">
        <BButton
          id="reset-button"
          data-cy="reset-button"
          variant="warning"
          size="lg"
          class="fd2-reset"
          v-on:click="reset()"
          v-bind:disabled="!resetEnabled"
          >Reset</BButton
        >
      </BCol>
    </BRow>
  </div>
</template>

<script>
/**
 * The SubmitResetButtons component provides the Submit and Reset buttons used on forms.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/submit_reset_buttons">The SubmitResetButtons Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/submit_reset_buttons/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <SubmitResetButtons
 *   v-model:enableSubmit="enableSubmit"
 *   v-model:enableReset="enableReset"
 *   v-on:ready="createdCount++"
 *   v-on:submit="submit()"
 *   v-on:reset="reset()"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * submit-reset          | The `<row>` element containing the submit and reset buttons.
 * submit-button         | The submit button.
 * reset-button          | The reset button.
 */
export default {
  name: 'SubmitResetButtons',
  emits: ['submit', 'ready', 'reset'],
  props: {
    /**
     * Indicates if the reset button should be enabled.
     * This prop is watched by the component.
     */
    enableReset: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicates if the submit button should be enabled.
     * This prop is watched by the component.
     */
    enableSubmit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      submitEnabled: this.enableSubmit,
      resetEnabled: this.enableReset,
    };
  },
  computed: {},
  methods: {
    submit() {
      /**
       * The submit button has been clicked.
       */
      this.$emit('submit', this.submitEnabled);
    },
    reset() {
      /**
       * The reset button has been clicked.
       */
      this.$emit('reset', this.resetEnabled);
    },
  },
  watch: {
    enableSubmit() {
      this.submitEnabled = this.enableSubmit;
    },
    enableReset() {
      this.resetEnabled = this.enableReset;
    },
  },
  created() {
    /**
     * This component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
  width: 100%;
  margin-left: 0 !important;
}

.submit-button-col {
  padding-left: 0 !important;
}

.fd2-submit {
  width: 100%;
}

.fd2-reset {
  width: 100%;
  max-width: 120px;
}
</style>
