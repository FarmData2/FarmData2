<template>
  <h3>PicklistBase Example</h3>
  <p>
    The PicklistBase component allows the user to pick multiple items from a
    list displayed as a table.
  </p>

  <hr />
  <PicklistBase
    v-bind:columns="columns"
    v-bind:labels="labels"
    v-bind:rows="rows"
    v-bind:showAllButton="showAllButton"
    v-bind:showInfoIcons="showInfoIcons"
    v-bind:picked="form.picked"
    v-on:valid="(valid) => (validity.picked = valid)"
    v-on:update:picked="form.picked = $event"
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
        <td>showAllButton</td>
        <td>
          <BFormCheckbox
            id="show-all-button-checkbox"
            data-cy="show-all-button-checkbox"
            switch
            v-model="showAllButton"
          />
        </td>
      </tr>
      <tr>
        <td>showInfoIcons</td>
        <td>
          <BFormCheckbox
            id="show-info-icons-checkbox"
            data-cy="show-info-icons-checkbox"
            switch
            v-model="showInfoIcons"
          />
        </td>
      </tr>
      <tr>
        <td>picked</td>
        <td>
          <BButton
            id="set-picked-button"
            data-cy="set-picked-button"
            variant="outline-primary"
            size="sm"
            v-on:click="form.picked[0] = !form.picked[0]"
          >
            Toggle first row
          </BButton>
        </td>
      </tr>
      <tr>
        <td>rows / rowsInfo</td>
        <td>
          <BButton
            id="add-row-button"
            data-cy="add-row-button"
            variant="outline-primary"
            size="sm"
            v-on:click="
              if (this.rows.length < 5) {
                this.rows.push({
                  c1: 'R4-C1',
                  c2: 'R4-C2',
                  c3: 'R4-C3',
                  stuff: 'Stuff here4',
                  name: 'name5',
                  value: 'info 5',
                });
              } else {
                this.rows.splice(4, 1);
              }
            "
          >
            Add/Remove 5th row
          </BButton>
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
        <td>{{ form.picked }}</td>
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
import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';

export default {
  components: {
    PicklistBase,
  },
  data() {
    return {
      columns: ['c1', 'c2', 'c3'],
      labels: {
        c1: 'Column1',
        c2: 'Column2',
        c3: 'Column3',
        stuff: 'More Info',
        name: 'Name',
        value: 'A Number',
        text: 'Text',
        text2: 'Text2',
        text4: 'Text4',
        text6: 'Text6',
        text8: 'Text8',
        text10: 'Text10',
        text12: 'Text12',
        text14: 'Text14',
      },
      rows: [
        {
          c1: 'R0-C1',
          c2: 'R0-C2',
          c3: 'R0-C3',
          stuff: 'Stuff here1',
        },
        {
          c1: 'R1-C1',
          c2: 'R1-C2',
          c3: 'R1-C3',
          stuff: 'Stuff here2',
        },
        {
          c1: 'R2-C1',
          c2: 'R2-C2',
          c3: 'R2-C3',
        },
        {
          c1: 'R3-C1',
          c2: 'R3-C2',
          c3: 'R3-C3 - A longer value in this cell to show what happens.',
          stuff: 'Stuff here4',
          name: 'name1',
          value: '8',
          text: 'Lots of values here as an example.',
          text2: '2',
          text3: '3',
          text4: '4',
          text5: '5',
          text6: '6',
          text7: '7',
          text8: '8',
          text9: '9',
          text10: '10',
          text11: '11',
          text12: '12',
          text13: '13',
          text14: '14',
        },
      ],
      showAllButton: true,
      showInfoIcons: true,
      form: {
        picked: [],
      },
      validity: {
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
  created() {
    this.createdCount++;
  },
};
</script>

<style>
@import url('@css/fd2-examples.css');
@import url('@css/fd2-mobile.css');
</style>
