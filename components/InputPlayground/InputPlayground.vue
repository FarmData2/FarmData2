<template>
  <!-- number input with spinners -->
  <BFormGroup
    label="Trays:"
    label-for="trays-input"
    label-cols="auto"
  >
    <BInputGroup id="trays-group">
      <BInputGroupPrepend>
        <BButton
          variant="outline-primary"
          v-on:click="clickOne(-25)"
          >&#x27EA;</BButton
        >
        <BButton
          variant="outline-primary"
          v-on:click="clickOne(-5)"
          >&#x27E8;</BButton
        >
        <BButton
          variant="outline-primary"
          v-on:click="clickOne(-1)"
          >&#x2039;</BButton
        >
      </BInputGroupPrepend>
      <BFormInput
        id="trays-input"
        number
        v-model="countOne"
        v-bind:formatter="formatterOne"
      />
      <BInputGroupAppend>
        <BButton
          variant="outline-primary"
          v-on:click="clickOne(1)"
          >&#x203A;</BButton
        >
        <BButton
          variant="outline-primary"
          v-on:click="clickOne(5)"
          >&#x203A;</BButton
        >
        <BButton
          variant="outline-primary"
          v-on:click="clickOne(25)"
          >&#x27EB;</BButton
        >
      </BInputGroupAppend>
    </BInputGroup>
  </BFormGroup>

  <!-- number dropdown with add item -->
  <SelectorBase
    id="tray-size"
    label="Tray Size"
    invalidFeedbackText="A size is required"
    v-bind:addOptionUrl="addTraySizeUrl"
    v-bind:options="[
      '6',
      '12',
      '24',
      '32',
      '50',
      '72',
      '96',
      '105',
      '128',
      '200',
      '288',
    ]"
    v-model:selected="traySize"
    required
    v-bind:showValidityStyling="false"
  />

  <!-- number input with spinner -->
  <BFormGroup
    label="Seeds / Cell:"
    label-for="seeds-group"
    label-cols="auto"
  >
    <BInputGroup id="seeds-group">
      <BInputGroupPrepend>
        <BButton
          variant="outline-primary"
          v-on:click="clickTwo(-1)"
          >&#x2039;</BButton
        >
      </BInputGroupPrepend>
      <BFormInput
        id="seeds-input"
        number
        v-model="countTwo"
        v-bind:formatter="formatterTwo"
      />
      <BInputGroupAppend>
        <BButton
          variant="outline-primary"
          v-on:click="clickTwo(1)"
          >&#x203A;</BButton
        >
      </BInputGroupAppend>
    </BInputGroup>
  </BFormGroup>

  <!-- plain text display -->
  <BFormGroup
    id="total-group"
    label="Total Seeds:"
    label-for="total-seeds"
    label-cols="auto"
  >
    <BFormInput
      id="total-seeds"
      disabled
      v-model="totalSeeds"
    />
  </BFormGroup>
</template>

<script>
import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';

export default {
  name: 'InputPlayground',
  components: { SelectorBase },
  emits: [],
  props: {},
  data() {
    return {
      countOne: this.formatterOne(0),
      countTwo: this.formatterTwo(1),
      traySize: '',
      addTraySizeUrl: '/admin/structure/taxonomy/manage/tray_sizes/overview',
    };
  },
  computed: {
    totalSeeds() {
      if (this.traySize === '') {
        return '';
      } else {
        return (
          parseFloat(this.traySize) *
          parseFloat(this.countOne) *
          parseFloat(this.countTwo)
        );
      }
    },
  },
  methods: {
    clickOne(inc) {
      let value = parseFloat(this.countOne) + parseFloat(inc);
      if (value < 0) {
        value = 0;
      }
      this.countOne = this.formatterOne(value);
    },
    formatterOne(value) {
      let x = parseFloat(value);
      if (value === '') {
        this.countOne = '0.00';
        return '0.00';
      }
      if (!isNaN(x)) {
        if (x < 0) {
          x = 0;
          this.countOne = '0.00';
        }
        return x.toFixed(2).toString();
      } else {
        this.countOne = '0.00';
        return '0.00';
      }
    },
    clickTwo(inc) {
      let value = parseFloat(this.countTwo) + parseFloat(inc);
      if (value < 1) {
        value = 1;
      }
      this.countTwo = this.formatterTwo(value);
    },
    formatterTwo(value) {
      if (value === '') {
        this.countTwo = '1';
        return '1';
      }
      let x = parseInt(value);
      if (!isNaN(x)) {
        if (x < 1) {
          this.countTwo = '1';
          return '1';
        }
        this.countTwo = x.toString();
        return x.toString();
      } else {
        return '0';
      }
    },
  },
  watch: {},
  created() {},
};
</script>

<style scoped>
#trays-group,
#tray-size,
#seeds-group,
#total-group {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
