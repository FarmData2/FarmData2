<template>
  <h1 data-cy="title">FarmData2 Soil Features</h1>
  <p>This menu contains the collection of FarmData2 soil features including:</p>

  <UL>
    <LI>
      Soil Disturbance: A form for recording activities that disturb the soil.
    </LI>
    <LI>
      Soil Amendment: A form for recording amendments to the soil (e.g.
      fertilizers).
    </LI>
  </UL>

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
