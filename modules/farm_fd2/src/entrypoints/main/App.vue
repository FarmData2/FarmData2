<template>
  <div>
    FarmData2 provides data entry and reporting features that support:
    <ul>
      <li>the day-to-day operation of diversified vegetable farms.</li>
      <li>record keeping for the organic certification process.</li>
      <li>sustainable farming practices including soil health.</li>
    </ul>
  </div>
  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
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
