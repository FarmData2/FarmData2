<template>
  <h3>TransplantingPicklist Example</h3>
  <p>
    A Transplanting Picklist allows the user to select a crop from a list of all
    crops that currently have tray seedings (i.e. can be transplanted).
  </p>

  <hr />
  <TransplantingPicklist
    id="transplanting-picklist"
    data-cy="transplanting-picklist"
    v-bind:required="required"
    v-bind:showValidityStyling="validity.showStyling"
    v-on:ready="createdCount++"
  />
  <hr />

  <h5>Component Props:</h5>
  <table class="example-table">
    <thead>
      <tr>
        <th>Prop</th>
        <th>Control</th>
      </tr>
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
import TransplantingPicklist from '@comps/TransplantingPicklist/TransplantingPicklist.vue';

export default {
  name: 'TransplantingPicklistExample',
  components: {
    TransplantingPicklist,
  },
  data() {
    return {
      createdCount: 0,
      required: true,
      validity: {
        showStyling: true,
      }
    };
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
</style>
