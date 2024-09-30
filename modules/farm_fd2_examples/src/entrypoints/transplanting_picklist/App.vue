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
    v-bind:showValidityStyling="validity.show"
    v-on:update:picked="
      (picked) => {
        form.picked = picked;
      }
    "
    v-on:valid="
      (valid) => {
        validity.picked = valid;
      }
    "
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
            v-model="validity.show"
          />
        </td>
      </tr>
    </tbody>
  </table>

  <h5>Component Event Payloads:</h5>
  <table class="example-table">
    <thead>
      <tr>
        <th>Event</th>
        <th>Payload</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>update:picked</td>
        <td>
          <div v-if="form.picked.size === 0">No trays picked.</div>
          <ul
            v-else
            style="list-style-type: disc; padding-left: 20px"
          >
            <li
              v-for="[key, value] in form.picked.entries()"
              :key="key"
              style="margin-bottom: 10px"
            >
              {{ JSON.stringify(value) }}
              <hr style="margin: 10px 0" />
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>valid</td>
        <td>{{ validity.picked }}</td>
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
      form: {
        picked: new Map(),
      },
      validity: {
        show: false,
        picked: false,
      },
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

/**
 * This ensures that the css for this file is picked up by the builder.
 * Not sure why this is necessary, but without it the css imports
 * above are not processed.
 */
transplanting-picklist-base-hack {
  display: none;
}
</style>
