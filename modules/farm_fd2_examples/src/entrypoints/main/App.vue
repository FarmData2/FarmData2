<template>
  <div>
    The FarmData2 Examples module appears only in the development environment.
    It provides canonical examples of how FarmData2 entry points and components
    are created, used, and tested.
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
