<template>
  <BRow
    id="submit-reset"
    data-cy="submit-reset"
  >
    <BCol cols="auto">
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
    <BCol
      cols="auto"
      alignSelf="center"
    >
      <BButton
        id="reset-button"
        data-cy="reset-button"
        variant="warning"
        v-on:click="reset()"
        v-bind:disabled="!resetEnabled"
        >Reset</BButton
      >
    </BCol>
  </BRow>
</template>

<script>
/**
 * A component containing the Submit and Reset buttons used on forms.
 *
 * ## Usage Example
 *
 * ```html
 * Add example of how to add this component to a template.
 * See the other components in the `components` directory for examples.
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * `submit-reset``       | The `<row> element containing the submit and reset buttons.
 * `submit`              | The submit button.
 * `reset`               | The reset button.
 */
export default {
  name: 'SubmitResetButtons',
  emits: ['submit', 'reset'],
  props: {
    /*
     * Indicates if the submit button should be enabled.
     * This prop is watched by the component.
     */
    enableSubmit: {
      type: Boolean,
      default: false,
    },
    /*
     * Indicates if the reset button should be enabled.
     * This prop is watched by the component.
     */
    enableReset: {
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

<style>
.fd2-submit {
  width: 210px !important;
  min-width: 210px;
  max-width: 210px;
}

.fd2-reset {
  width: 50px !important;
  min-width: 50px;
  max-width: 50px;
}
</style>
