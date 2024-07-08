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
                v-bind:label="'Letters'"
                v-bind:sortOrder="sortColumn === 'letters' ? sortOrder : 'none'"
                v-on:sort="handleSort"
                v-on:ready="createdCount++"
              />
            </BTh>
            <BTh>
              <SortOrderButton
                id="sort-order-button-numbers"
                data-cy="sort-order-button-numbers"
                v-bind:label="'Numbers'"
                v-bind:sortOrder="sortColumn === 'numbers' ? sortOrder : 'none'"
                v-on:sort="handleSort"
                v-on:ready="createdCount++"
              />
            </BTh>
            <BTh>
              <SortOrderButton
                id="sort-order-button-both"
                data-cy="sort-order-button-both"
                v-bind:label="'Both'"
                v-bind:sortOrder="sortColumn === 'both' ? sortOrder : 'none'"
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
            <BTd>{{ row.both }}</BTd>
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
          <td>Sort Letters</td>
          <td>
            <BButton
              id="sort-letters"
              data-cy="sort-letters"
              v-on:click="toggleSort('letters')"
              variant="outline-primary"
              size="sm"
            >
              Toggle Sort Letters
            </BButton>
          </td>
        </tr>
        <tr>
          <td>Sort Numbers</td>
          <td>
            <BButton
              id="sort-numbers"
              data-cy="sort-numbers"
              v-on:click="toggleSort('numbers')"
              variant="outline-primary"
              size="sm"
            >
              Toggle Sort Numbers
            </BButton>
          </td>
        </tr>
        <tr>
          <td>Sort Both</td>
          <td>
            <BButton
              id="sort-both"
              data-cy="sort-both"
              v-on:click="toggleSort('both')"
              variant="outline-primary"
              size="sm"
            >
              Toggle Sort Both
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
        { letters: 'A', numbers: 3, both: 'A3' },
        { letters: 'C', numbers: 1, both: 'C1' },
        { letters: 'B', numbers: 10, both: 'A1' },
        { letters: 'D', numbers: 4, both: 'D4' },
      ],
      sortColumn: '',
      sortOrder: 'none',
      createdCount: 0,
    };
  },
  computed: {
    sortedRows() {
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
      this.sortColumn = label.toLowerCase();
      this.sortOrder = sortOrder;
    },
    toggleSort(column) {
      this.sortColumn = column;
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
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
  width: 100%;
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
