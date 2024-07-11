<template>
  <h3>TextDisplay Example</h3>
  <p data-cy="description">
    The TextDisplay component provides a UI element for displaying a labeled
    text string.
  </p>

  <hr />
  <TextDisplay
    id="text-display"
    data-cy="text-display"
    label="TextDisplay"
    v-model:text="this.text"
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
        <td>text</td>
        <td>
          <BButton
            id="set-text-button"
            data-cy="set-text-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.text = 'example text'"
            v-bind:disabled="this.text !== null"
          >
            Example Text
          </BButton>
          <BButton
            id="clear-text-button"
            data-cy="clear-text-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.text = null"
            v-bind:disabled="this.text == null"
          >
            Clear
          </BButton>
        </td>
      </tr>
    </tbody>
  </table>

  <h5>Component Event Payloads</h5>
  <table class="example-table">
    <thead>
      <th>Event</th>
      <th>Payload</th>
    </thead>
    <tbody>
      <tr>
        <td>N/A</td>
        <td>N/A</td>
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
import TextDisplay from '@comps/TextDisplay/TextDisplay.vue';
import { BButton } from 'bootstrap-vue-next';

export default {
  components: {
    TextDisplay,
    BButton,
  },
  data() {
    return {
      text: null,
      createdCount: 0,
    };
  },
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
text-display-hack {
  display: none;
}
</style>
