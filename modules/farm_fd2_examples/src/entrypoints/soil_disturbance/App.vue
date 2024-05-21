<template>
  <h3>Soil Disturbance Example</h3>
  <p data-cy="description">
    The SoilDisturbance component collects data on soil disturbances.
  </p>

  <hr />
  <SoilDisturbance
    id="soil-disturbance"
    data-cy="soil-disturbance"
    v-bind:required="required"
    v-model:area="form.area"
    v-model:depth="form.depth"
    v-model:equipment="form.equipment"
    v-bind:includePasses="includePasses"
    v-model:speed="form.speed"
    v-model:passes="form.passes"
    v-bind:showValidityStyling="validity.showStyling"
    v-on:valid="
      (valid) => {
        validity.soilDisturbance = valid;
      }
    "
    v-on:ready="createdCount++"
  />
  <hr />

  <h5>Component Props:</h5>
  <table class="example-table">
    <thead>
      <th>Prop</th>
      <th>Control</th>
    </thead>
    <tbody>
      <tr>
        <td>required</td>
        <td>
          <BFormCheckbox
            id="required-checkbox"
            data-cy="required-checkbox"
            switch
            v-model="required"
          />
        </td>
      </tr>
      <tr>
        <td>showValidityStyling</td>
        <td>
          <BFormCheckbox
            id="styling-checkbox"
            data-cy="styling-checkbox"
            switch
            v-model="validity.showStyling"
          />
        </td>
      </tr>
      <tr>
        <td>Add Planter</td>
        <td>
          <BButton
            id="add-equipment-button"
            data-cy="add-equipment-button"
            variant="outline-primary"
            size="sm"
            v-on:click="addEquipment"
          >
            Add Planter
          </BButton>
        </td>
      </tr>
      <tr>
        <td>Clear</td>
        <td>
          <BButton
            id="clear-equipment-button"
            data-cy="clear-equipment-button"
            variant="outline-primary"
            size="sm"
            v-on:click="clearEquipment"
          >
            Clear Equipment
          </BButton>
        </td>
      </tr>
      <template v-if="form.equipment.length > 0">
        <tr>
          <td>area</td>
          <td>
            <BButton
              id="set-area-button"
              data-cy="set-area-button"
              variant="outline-primary"
              size="sm"
              v-on:click="changeArea"
            >
              Area = 50
            </BButton>
          </td>
        </tr>
        <tr>
          <td>depth</td>
          <td>
            <BButton
              id="set-depth-button"
              data-cy="set-depth-button"
              variant="outline-primary"
              size="sm"
              v-on:click="changeDepth"
            >
              Depth = 6
            </BButton>
          </td>
        </tr>
        <tr>
          <td>speed</td>
          <td>
            <BButton
              id="set-speed-button"
              data-cy="set-speed-button"
              variant="outline-primary"
              size="sm"
              v-on:click="changeSpeed"
            >
              Speed = 3
            </BButton>
          </td>
        </tr>
        <tr>
          <td>includePasses</td>
          <td>
            <BFormCheckbox
              id="include-passes-checkbox"
              data-cy="include-passes-checkbox"
              switch
              v-model="includePasses"
            />
          </td>
        </tr>
        <tr v-if="includePasses">
          <td>Set Passes</td>
          <td>
            <BButton
              id="set-passes-button"
              data-cy="set-passes-button"
              variant="outline-primary"
              size="sm"
              v-on:click="changePasses"
            >
              Passes = 4
            </BButton>
          </td>
        </tr>
      </template>
    </tbody>
  </table>

  <h5>Component Event Payloads</h5>
  <table class="example-table">
    <thead>
      <th>Event</th>
      <th>Payload</th>
    </thead>
    <tbody>
      <tr>
        <td>equipment</td>
        <td>{{ form.equipment }}</td>
      </tr>
      <tr>
        <td>area</td>
        <td>{{ form.area }}</td>
      </tr>
      <tr>
        <td>depth</td>
        <td>{{ form.depth }}</td>
      </tr>
      <tr>
        <td>speed</td>
        <td>{{ form.speed }}</td>
      </tr>
      <tr>
        <td>passes</td>
        <td>{{ form.passes }}</td>
      </tr>
      <tr>
        <td>valid</td>
        <td>{{ validity.soilDisturbance }}</td>
      </tr>
    </tbody>
  </table>

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
import SoilDisturbance from '@comps/SoilDisturbance/SoilDisturbance.vue';
import { BButton } from 'bootstrap-vue-next';

export default {
  components: {
    SoilDisturbance,
    BButton,
  },
  data() {
    return {
      required: true,
      includePasses: true,
      form: {
        area: 100,
        depth: 0,
        equipment: [],
        passes: 1,
        speed: 0,
      },
      validity: {
        showStyling: false,
        soilDisturbance: false,
      },
      createdCount: 0,
    };
  },
  methods: {
    changeArea() {
      this.form.area = 50;
    },
    changeDepth() {
      this.form.depth = 6;
    },
    changePasses() {
      this.form.passes = 4;
    },
    changeSpeed() {
      this.form.speed = 3;
    },
    addEquipment() {
      this.form.equipment.push('Planter');
    },
    clearEquipment() {
      this.form.equipment = [];
    },
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>

<style>
@import url('@css/fd2-examples.css');
@import url('@css/fd2-mobile.css');

/**
 * This ensures that the css for this file is picked up by the builder.
 * Not sure why this is necessary, but without it the css imports
 * above are not processed.
 */
soil-disturbance-hack {
  display: none;
}
</style>
