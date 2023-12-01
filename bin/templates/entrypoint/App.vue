<template>
  <h1 data-cy="title">Template for %ENTRY_POINT% Entry Point</h1>
  <p>
    This uses the dayjs import: <span>{{ formatDate }}</span>
  </p>
  <p>
    This uses the lib import: <span>{{ callLib }}</span>
  </p>

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
import dayjs from 'dayjs';
import * as lib from './lib';

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
    callLib() {
      return lib.placeholder();
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
