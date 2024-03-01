<template>
  <p>
    PickerBase is a component that allows the user to pick multiple items using
    checkboxes.
  </p>

  <hr />
  <PickerBase
    v-if="picks.length > 0"
    id="bed-picker"
    data-cy="bed-picker"
    label="Options"
    v-bind:options="picks"
  />
  <hr />

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
import PickerBase from '@comps/PickerBase/PickerBase.vue';

export default {
  components: {
    PickerBase,
  },
  data() {
    return {
      picks: ['A', 'B', 'C'],
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 1;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>
