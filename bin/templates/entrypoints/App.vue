<script setup>
import dayjs from 'dayjs';
import Counter from '@comps/CounterExample/CounterExample.vue';
</script>

<template>
  <h1
    class="sample"
    data-cy="title"
  >
    Template for %ENTRY_POINT% Entry Point
  </h1>
  <p>
    This uses the dayjs import: <span>{{ formatDate }}</span>
  </p>
  <p>
    This uses the CounterExample component.
    <Counter />
  </p>

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
      date: dayjs(),
      createdCount: 0,
    };
  },
  computed: {
    formatDate() {
      return this.date.format('YYYY-MM-DD');
    },
    pageDoneLoading() {
      return this.createdCount == 1;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>

<style scoped>
.sample {
  color: blue;
}
</style>
