<template>
  <h2>Component Examples</h2>

  <p>A set of examples illustrating the use of the FarmData2 components.</p>
  <ul>
    <li><a href="">ComponentName</a>: Component for blah blah.</li>
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

<style>
@import url('@css/fd2-mobile.css');
</style>
