<template>
  <div
    id="transplanting"
    data-cy="transplanting"
  >
    <BToaster
      id="transplanting-toaster"
      data-cy="transplanting-toaster"
    />
    <BCard
      id="transplanting-card"
      data-cy="transplanting-card"
      bg-variant="light"
      header-tag="header"
    >
      <template #header>
        <h2
          id="transplanting-header"
          data-cy="transplanting-header"
          class="text-center"
        >
          Transplanting
        </h2>
      </template>

      <BForm
        id="transplanting-form"
        data-cy="transplanting-form"
      >
        <!-- Transplanting Picklist -->

          
      </BForm>
    </BCard>

    <div
      id="page-loaded"
      data-cy="page-loaded"
      v-show="false"
    >
      {{ pageDoneLoading }}
    </div>
  </div>
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
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';
import TransplantingPicklist from '@comps/TransplantingPicklist/TransplantingPicklist.vue';

export default {
  components: {
    TransplantingPicklist,
  },
  data() {
    return {
      form: {
        picked: [],
      },
      validity: {
        show: false,
        picked: false,
      },
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
  },
  methods: {
    
  },
  created() {
    this.createdCount++;
  },
};
</script>

<style>
@import url('@css/fd2-mobile.css');
</style>
