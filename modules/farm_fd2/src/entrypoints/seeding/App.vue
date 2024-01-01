<template>
  <h1 data-cy="title">FarmData2 Seeding Features</h1>
  <p>
    This menu contains the collection of FarmData2 seeding features including:
  </p>

  <UL>
    <LI>
      Tray Seeding Input: A form for recording seedings that are made in trays
      in a greenhouse.
    </LI>
    <LI>
      Direct Seeding Input: A form for recording seedings that are made directly
      in the ground.
    </LI>
    <LI>Cover Crop Seedings: Seeding of a cover crop in a field. </LI>
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
