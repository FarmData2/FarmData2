<template>
  <p>
    The PicklistBase component allows the user to pick multiple items from a
    list displayed as a table.
  </p>

  <hr />
  <PicklistBase
    v-bind:headers="headers"
    v-bind:rows="rows"
    v-bind:rowsInfo="rowsInfo"
    v-bind:showAllButton="showAllButton"
    v-bind:picked="form.picked"
    v-on:valid="(valid) => (validity.picked = valid)"
    v-on:update:picked="form.picked = $event"
    v-on:ready="createdCount++"
  />
  <hr />

  <h5>Component Props:</h5>
  <table>
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
        <td>picked</td>
        <td>
          <BButton
            id="set-picked-button"
            data-cy="set-picked-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.picked[0] = !this.form.picked[0]"
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
                this.rows.push(['R4-C1', 'R4-C2', 'R4-C3']);
                this.rowsInfo.push({
                  name: 'name5',
                  value: 'info 5',
                });
              } else {
                this.rows.splice(4, 1);
                this.rowsInfo.splice(4, 1);
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

  <table>
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
      headers: ['Column1', 'Column2', 'Column3'],
      rows: [
        ['R0-C1', 'R0-C2', 'R0-C3'],
        ['R1-C1', 'R1-C2', 'R1-C3'],
        ['R2-C1', 'R2-C2', 'R2-C3'],
        [
          'R3-C1',
          'R3-C2',
          'R3-C3 - A longer value in this cell to show what happens.',
        ],
      ],
      rowsInfo: [
        {
          name: 'name1',
          value: 'info 1',
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
        {
          name: 'name2',
          value: 'info 2',
          text: 'A longer text string to show what happens when the text is long.',
        },
        { name: 'name3', value: 'info 3' },
        { name: 'name4', value: 'info 4' },
      ],
      showAllButton: true,
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
</style>
