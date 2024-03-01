<template>
  <p>A set of examples illustrating the use of the FarmData2 components.</p>
  <ul>
    <li>
      <a href="date_selector">DateSelector</a>: Component for selecting a date.
    </li>
    <li>
      <a href="picker_base">PickerBase</a>: Base component for picking multiple
      items via checkboxes.
    </li>
  </ul>

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>

  <br />
</template>

<script>
export default {
  data() {
    return {
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
