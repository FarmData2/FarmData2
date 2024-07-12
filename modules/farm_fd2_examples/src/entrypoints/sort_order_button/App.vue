<template>
  <div>
    <h3>SortOrderButton Example</h3>
    <p>
      The SortOrderButton component allows the user to toggle the sort order
      between ascending and descending.
    </p>

    <hr />
    <BForm>
      <BTableSimple
        id="example-table"
        data-cy="example-table"
        small
        responsive
        striped
      >
        <BThead>
          <BTr>
            <BTh>
              <SortOrderButton
                id="sort-order-button-letters"
                data-cy="sort-order-button-letters"
                v-bind:label="'letters'"
                v-bind:sortOrder="sortColumn === 'letters' ? sortOrder : 'none'"
                v-on:sort="handleSort"
                v-on:ready="createdCount++"
              />
            </BTh>
            <BTh>
              <SortOrderButton
                id="sort-order-button-numbers"
                data-cy="sort-order-button-numbers"
                v-bind:label="'numbers'"
                v-bind:sortOrder="sortColumn === 'numbers' ? sortOrder : 'none'"
                v-on:sort="handleSort"
                v-on:ready="createdCount++"
              />
            </BTh>
            <BTh>
              <SortOrderButton
                id="sort-order-button-'letters and numbers'"
                data-cy="sort-order-button-'letters and numbers'"
                v-bind:label="'letters and numbers'"
                v-bind:sortOrder="
                  sortColumn === 'letters and numbers' ? sortOrder : 'none'
                "
                v-on:sort="handleSort"
                v-on:ready="createdCount++"
              />
            </BTh>
          </BTr>
        </BThead>
        <BTbody>
          <BTr
            v-for="(row, index) in sortedRows"
            v-bind:key="index"
          >
            <BTd>{{ row.letters }}</BTd>
            <BTd>{{ row.numbers }}</BTd>
            <BTd>{{ row['letters and numbers'] }}</BTd>
          </BTr>
        </BTbody>
      </BTableSimple>
    </BForm>
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
          <td>
            <p>sortOrder</p>
            <p>(controls the letter column only)</p>
          </td>
          <td>
            <BButton
              id="sort-letters-none"
              data-cy="sort-letters-none"
              v-on:click="setSortOrder('letters', 'none')"
              :variant="
                sortColumn === 'letters' && sortOrder === 'none'
                  ? 'primary'
                  : 'outline-primary'
              "
              size="md"
            >
              None
            </BButton>
            <BButton
              id="sort-letters-asc"
              data-cy="sort-letters-asc"
              v-on:click="setSortOrder('letters', 'asc')"
              :variant="
                sortColumn === 'letters' && sortOrder === 'asc'
                  ? 'primary'
                  : 'outline-primary'
              "
              size="md"
            >
              Asc
            </BButton>
            <BButton
              id="sort-letters-desc"
              data-cy="sort-letters-desc"
              v-on:click="setSortOrder('letters', 'desc')"
              :variant="
                sortColumn === 'letters' && sortOrder === 'desc'
                  ? 'primary'
                  : 'outline-primary'
              "
              size="md"
            >
              Desc
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
          <td>sortColumn</td>
          <td>{{ sortColumn }}</td>
        </tr>
        <tr>
          <td>sortOrder</td>
          <td>{{ sortOrder }}</td>
        </tr>
      </tbody>
    </table>

    <div
      data-cy="page-loaded"
      v-show="false"
    >
      {{ pageDoneLoading }}
    </div>
  </div>
</template>

<script>
import SortOrderButton from '@comps/SortOrderButton/SortOrderButton.vue';

export default {
  components: {
    SortOrderButton,
  },
  data() {
    return {
      rows: [
        { letters: 'A', numbers: 3, 'letters and numbers': 'A3' },
        { letters: 'C', numbers: 1, 'letters and numbers': 'C1' },
        { letters: 'B', numbers: 10, 'letters and numbers': 'A1' },
        { letters: 'D', numbers: 4, 'letters and numbers': 'D4' },
      ],
      sortColumn: 'letters',
      sortOrder: 'none',
      createdCount: 0,
    };
  },
  computed: {
    sortedRows() {
      if (this.sortOrder === 'none') {
        return this.rows;
      }
      if (this.sortColumn) {
        return [...this.rows].sort((a, b) => {
          if (a[this.sortColumn] < b[this.sortColumn]) {
            return this.sortOrder === 'asc' ? -1 : 1;
          } else if (a[this.sortColumn] > b[this.sortColumn]) {
            return this.sortOrder === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
      }
      return this.rows;
    },
    pageDoneLoading() {
      return this.createdCount == 4;
    },
  },
  methods: {
    handleSort({ label, sortOrder }) {
      this.sortColumn = label;
      this.sortOrder = sortOrder;
    },
    toggleSort(column) {
      this.sortColumn = column;
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    setSortOrder(column, order) {
      this.sortColumn = column;
      this.sortOrder = order;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>

<style scoped>
@import url('@css/fd2-examples.css');
@import url('@css/fd2-mobile.css');

.example-table {
  margin-top: 20px;
  border-collapse: collapse;
}

.example-table th,
.example-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.example-table th {
  background-color: #f2f2f2;
  text-align: left;
}

.example-table td {
  text-align: left;
}
</style>
