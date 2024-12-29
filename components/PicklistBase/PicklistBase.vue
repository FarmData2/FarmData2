<template>
  <div
    v-bind:style="{ padding: '2px', border: '1px solid ' + tableBorderColor }"
  >
    <BForm>
      <BTableSimple
        id="picklist-table"
        data-cy="picklist-table"
        small
        responsive
        striped
        stickyHeader
        v-bind:aria-hidden="showOverlay ? 'true' : null"
        v-bind:class="tableStyling"
      >
        <BThead>
          <BTr>
            <BTh stickyColumn>
              <BButton
                id="picklist-all-button"
                data-cy="picklist-all-button"
                v-if="allButtonVisible && !units"
                v-bind:disabled="showOverlay != null"
                size="sm"
                variant="primary"
                v-on:click="handleAllButton()"
              >
                <span v-if="allPicked">🚫 All</span>
                <span v-else>✅ All</span>
              </BButton>
              <BButton
                id="picklist-units-button"
                data-cy="picklist-units-button"
                v-if="allButtonVisible && units"
                v-bind:disabled="showOverlay != null"
                size="sm"
                variant="primary"
                v-on:click="handleUnitsButton()"
              >
                <span v-if="allPicked">🚫 {{ units }}</span>
                <span v-else>✅ {{ units }}</span>
              </BButton>
            </BTh>
            <BTh
              v-for="header in columns"
              v-bind:id="'picklist-header-' + getLabelId(header)"
              v-bind:data-cy="'picklist-header-' + getLabelId(header)"
              v-bind:key="header"
            >
              <SortOrderButton
                v-bind:id="`picklist-sort-button-${header}`"
                v-bind:data-cy="`picklist-sort-button-${header}`"
                v-bind:label="getLabel(header)"
                v-bind:sortOrder="sortColumn === header ? sortOrder : 'none'"
                v-on:sort="handleSort"
              />
            </BTh>
            <BTh
              v-if="showInfoIcons"
              class="narrow-col"
            >
            </BTh>
          </BTr>
          <BTr v-if="validityStyling === false">
            <th style="height: 0px" />
            <BTh
              colspan="100"
              style="font-weight: normal"
            >
              <BFormInvalidFeedback
                id="picklist-invalid-feedback"
                data-cy="picklist-invalid-feedback"
                v-bind:state="validityStyling"
              >
                {{ invalidFeedbackText }}
              </BFormInvalidFeedback>
            </BTh>
          </BTr>
        </BThead>

        <BTbody>
          <BTr
            v-for="(row, i) in sortedRows"
            v-bind:key="i"
            v-bind:id="'picklist-row-' + i"
            v-bind:data-cy="'picklist-row-' + i"
          >
            <BTh stickyColumn>
              <BFormCheckbox
                v-bind:id="'picklist-checkbox-' + i"
                v-bind:data-cy="'picklist-checkbox-' + i"
                v-if="!units"
                v-bind:name="'picklist-checkbox-' + i"
                v-bind:key="'checkbox' + i"
                v-bind:disabled="showOverlay != null"
                v-bind:checked="pickedRows[i]"
                v-on:change="(state) => handleCheckboxChange(i, state)"
                size="lg"
              />
              <BFormSelect
                v-bind:id="'picklist-quantity-' + i"
                v-bind:data-cy="'picklist-quantity-' + i"
                v-if="units"
                v-bind:key="'select ' + i"
                v-bind:name="'picklist-quantity-' + i"
                v-bind:disabled="showOverlay != null"
                v-model="pickedRows[i]"
                size="sm"
                style="
                  width: auto;
                  margin: 0px;
                  padding: 0px;
                  padding-right: 30px;
                "
              >
                <BFormSelectOption
                  v-for="(option, j) in quantityOptions(i)"
                  v-bind:id="'picklist-quantity-' + i + '-' + j"
                  v-bind:data-cy="'picklist-quantity-' + i + '-' + j"
                  v-bind:key="option"
                  v-bind:value="option"
                >
                  {{ option }}
                </BFormSelectOption>
              </BFormSelect>
            </BTh>
            <BTd
              v-for="(col, j) in columns"
              v-bind:id="'picklist-' + getLabelId(columns[j]) + '-' + i"
              v-bind:data-cy="'picklist-' + getLabelId(columns[j]) + '-' + i"
              v-bind:key="j"
            >
              {{ row[col] }}
            </BTd>
            <BTd
              v-if="showInfoIcons"
              v-bind:id="'picklist-info-' + i"
              v-bind:data-cy="'picklist-info-' + i"
            >
              <BOverlay
                id="picklist-info-overlay"
                data-cy="picklist-info-overlay"
                v-bind:show="showOverlay == i"
                v-bind:aria-hidden="!showOverlay ? 'true' : null"
                v-on:click="showOverlay = null"
              >
                <template #overlay>
                  <BCard
                    id="picklist-info-card"
                    data-cy="picklist-info-card"
                    v-bind:style="{
                      width: overlayWidth + 'px',
                      left: overlayLeft + 'px',
                    }"
                  >
                    <BCardHeader
                      id="picklist-info-card-header"
                      data-cy="picklist-info-card-header"
                      v-bind:style="{
                        width: overlayWidth + 'px',
                        height: infoRowHeight + 'px',
                      }"
                    >
                      <p />
                    </BCardHeader>

                    <BCardBody
                      id="picklist-info-card-body"
                      data-cy="picklist-info-card-body"
                      v-bind:style="{
                        width: overlayWidth + 'px',
                      }"
                    >
                      <ul>
                        <span
                          v-for="(value, name) in sortedRows[i]"
                          v-bind:key="name"
                        >
                          <li
                            v-if="includeAttributeInInfo(name)"
                            v-bind:id="
                              'picklist-info-' + getLabelId(name) + '-' + i
                            "
                            v-bind:data-cy="
                              'picklist-info-' + getLabelId(name) + '-' + i
                            "
                            v-bind:key="name"
                          >
                            {{ getLabel(name) }}: {{ value }}
                          </li>
                        </span>
                      </ul>
                    </BCardBody>
                  </BCard>
                </template>
                <svg
                  v-bind:id="'picklist-info-icon-' + i"
                  v-bind:data-cy="'picklist-info-icon-' + i"
                  v-on:click="showInfo(i)"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="green"
                  class="bi bi-info-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"
                  />
                </svg>
              </BOverlay>
            </BTd>
          </BTr>
        </BTbody>
      </BTableSimple>
    </BForm>
  </div>
</template>

<script>
import { BCardHeader } from 'bootstrap-vue-next';
import SortOrderButton from '@comps/SortOrderButton/SortOrderButton.vue';

/**
 * The `PicklistBase` component allows the user to pick multiple items from a list displayed as a table.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/picklist_base">The PicklistBase Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/picklist_base/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <PicklistBase
 *  id="picklist"
 *  data-cy="picklist"
 *  v-bind:required="required"
 *  invalidFeedbackText="At least one row must be selected."
 *  v-bind:showValidityStyling="validity.showStyling"
 *  v-bind:columns="columns"
 *  v-bind:labels="labels"
 *  v-bind:units="units"
 *  v-bind:quantityAttribute="quantityAttribute"
 *  v-bind:rows="rows"
 *  v-bind:showAllButton="showAllButton"
 *  v-bind:showInfoIcons="showInfoIcons"
 *  v-bind:picked="form.picked"
 *  v-on:valid="(valid) => (validity.picked = valid)"
 *  v-on:update:picked="form.picked = $event"
 *  v-on:ready="createdCount++"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name              | Description
 * ----------------------------| -----------
 * `picklist-all-button`       | The "All" `BButton` element in the leftmost column header..
 * `picklist-checkbox-i`       | The checkbox in the leftmost column of the ith row (counting from 0).
 * `picklist-header-*`         | The `<th>` element for the column with header `*`.  Column headings are lowercased and ' ' are replaced with `-`.
 * `picklist-info-card`        | The `BCard` element that displays more detailed information about a row.
 * `picklist-info-card-header` | The `BCardHeader` element that is the transparent area of the info table.
 * `picklist-sort-button-*`    | The `SortOrderButton` element used to sort the table by the column with header `*`. The `*` is replaced by the attribute names in the `columns` array.
 * `picklist-info-card-body`   | The `BCardBody` element that contains the `li` elements in the `BCard`.
 * `picklist-info-icon-i`      | The info icon in the rightmost column of the ith row (counting from 0).
 * `picklist-info-overlay`     | The `BOverlay` element that is used to display more detailed information on the rows.
 * `picklist-info-*`           | The `<li>` element in the info card that displays the attribute and value with label `*`. Labels are lowercased and ' ' are replaced with `-`.
 * `picklist-invalid-feedback` | The `BFormInvalidFeedback` element that displays help when the picklist value is invalid.
 * `picklist-quantity-i`       | The select list in the leftmost column of the ith row (counting from 0).
 * `picklist-quantity-i-j`     | The jth item in the select list in the ith row (counting from 0).
 * `picklist-row-i`            | The `BTr` element for the ith row (counting from 0).
 * `picklist-table`            | The `BTableSimple` element containing the items that can be picked.
 * `picklist-units-button'`    | The "Units" `BButton` element in the leftmost column header.
 * `picklist-*-i`              | The `<td>` element in the column with header `*` in the ith row (counting from 0). Column headings are lowercased and ' ' are replaced with `-`.
 */
export default {
  name: 'PicklistBase',
  components: { BCardHeader, SortOrderButton },
  emits: ['ready', 'update:picked', 'valid'],
  props: {
    /**
     * An array of strings giving the attribute names of the `rows` values to appear in each column of the table.
     * Each column name must match an attribute name in the objects in the `rows` prop.
     * The column header that is displayed is given by the mapping of the attribute name to its label using the `labels` prop.
     */
    columns: {
      type: Array,
      required: true,
    },
    /**
     * The text to display if the input is invalid.
     */
    invalidFeedbackText: {
      type: String,
      required: true,
    },
    /**
     * Gives a translation from attribute name to the label that will be used to display it.
     * The label will be used as the column header if the attribute is listed in `columns` or in the info box if it is not.
     * Attributes not listed in this prop will not be displayed in the info box.
     */
    labels: {
      type: Object,
      required: true,
    },
    /**
     * A Map indicating the rows/quantities that have been picked in the table.
     * The keys of the Map are row indices from the `rows` array.
     * The values of the Map are objects containing information about the picked row, including the picked quantity if the `units` prop is set.
     * If the row is picked, the Map will have an entry with the row number as the key and the value will have a picked attribute
     * containing a 1 if the units prop is not set, or the value picked if the units prop is set.
     * The Map will be empty if no rows are picked
     */
    picked: {
      type: Object,
      default: () => new Map(),
    },
    /**
     * The name of the attribute that will be used to generate the list of selectable quantities in the leftmost column if the `units` prop is not null.
     * The selectable quantities will be 0...rows[i][quantityAttribute]
     */
    quantityAttribute: {
      type: String,
      default: null,
    },
    /**
     * Whether at least one row must be picked or not.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * An array of objects giving the data for each row.
     * Each object is expected to contain an attribute for each name listed in the array given by the `labels` prop.
     * Attributes not listed in the `columns` prop and their values will be displayed in the info box.
     */
    rows: {
      type: Array,
      required: true,
    },
    /**
     * Whether the leftmost column header should be displayed.
     * This header is rendered as a button that acts as a select/deselect all button.
     */
    showAllButton: {
      type: Boolean,
      default: true,
    },
    /**
     * Whether the info icon should be displayed for any row that provides additional information.
     */
    showInfoIcons: {
      type: Boolean,
      default: true,
    },
    /**
     * Whether validity styling should appear on the element.
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
    /**
     * The units for the leftmost column of the picklist.
     * If this prop is `null` no units are used, the button in the leftmost column heading will be "All", and the column renders as checkboxes.
     * If this prop is not `null`, the prop value will be used in the button in the leftmost column heading, the column will render as a select element with values from 0...row[i][quantityAttribute].
     */
    units: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      showOverlay: null,
      overlayWidth: null,
      overlayLeft: null,
      infoRowHeight: null,
      pickedRows: this.picked,
      sortColumn: null,
      sortOrder: 'none',
      sortedRows: [...this.rows], // Initialize sortedRows with the rows prop
      quantityOptionsMap: this.initializeQuantityOptionsMap(this.rows),
    };
  },
  computed: {
    pickedAsArray() {
      return Array.from(this.picked.entries());
    },
    isValid() {
      if (this.required) {
        for (let i = 0; i < this.pickedRows.length; i++) {
          if (this.pickedRows[i]) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    },
    validityStyling() {
      if (this.showValidityStyling) {
        if (!this.required && this.picked.length === 0) {
          return null;
        } else {
          return this.isValid;
        }
      } else {
        return null;
      }
    },
    allPicked() {
      if (this.pickedRows.length < this.rows.length) {
        return false;
      }

      for (let i = 0; i < this.pickedRows.length; i++) {
        if (!this.pickedRows[i]) {
          return false;
        }
      }

      return true;
    },
    allButtonVisible() {
      return this.showAllButton && this.rows && this.rows.length > 0;
    },
    tableBorderColor() {
      if (this.validityStyling) {
        return 'green';
      } else if (this.validityStyling === false) {
        return 'red';
      } else {
        return '#dee2e6';
      }
    },
    tableStyling() {
      if (this.validityStyling) {
        return '{ is-valid }';
      } else if (this.validityStyling === false) {
        return '{ is-invalid }';
      } else {
        return '{}';
      }
    },
  },
  methods: {
    syncPickedRows(newPickedEntries) {
      // Ensure we are mapping the original row indices to pickedRows
      const newPickedRows = this.sortedRows.map((row) => {
        const originalIndex = this.rows.indexOf(row);
        const pickedEntry = newPickedEntries.find(
          ([index]) => index === originalIndex
        );
        return pickedEntry ? pickedEntry[1].picked : 0;
      });

      // Only update if there's a mismatch to avoid loops
      if (JSON.stringify(newPickedRows) !== JSON.stringify(this.pickedRows)) {
        this.pickedRows = newPickedRows;
      }
    },
    initializeQuantityOptionsMap(rows) {
      const map = new Map();
      rows.forEach((row, index) => {
        if (this.quantityAttribute) {
          map.set(
            index,
            Array.from(
              { length: row[this.quantityAttribute] + 1 },
              (_, idx) => idx
            )
          );
        }
      });
      return map;
    },
    quantityOptions(rowIndex) {
      return this.quantityOptionsMap.get(rowIndex) || [];
    },
    includeAttributeInInfo(attributeName) {
      return (
        !this.columns.includes(attributeName) && this.getLabel(attributeName)
      );
    },
    getLabel(attributeName) {
      return this.labels[attributeName];
    },
    getLabelId(attributeName) {
      const label = this.labels[attributeName];
      return label.toLowerCase().replace(/ /g, '-');
    },
    showInfo(row) {
      const table = document.getElementById('picklist-table');
      const col1 = document.getElementById(
        'picklist-' + this.getLabelId(this.columns[0]) + '-' + row
      );
      const infoCol = document.getElementById('picklist-info-' + row);
      if (table != null) {
        this.overlayWidth = infoCol.offsetLeft - col1.offsetLeft;
        this.overlayLeft = -(table.clientWidth - col1.offsetLeft - 10);
      }

      const tableCell = document.getElementById('picklist-info-' + row);
      if (tableCell != null) {
        this.infoRowHeight = tableCell.offsetHeight;
      }

      this.showOverlay = row;
    },
    handleCheckboxChange(row, state) {
      if (state) {
        this.pickedRows[row] = 1;
      } else {
        this.pickedRows[row] = 0;
      }
    },
    handleAllButton() {
      if (this.allPicked) {
        this.pickedRows = new Array(this.pickedRows.length).fill(0);
      } else {
        this.pickedRows = new Array(this.pickedRows.length).fill(1);
      }
    },
    handleUnitsButton() {
      if (this.allPicked) {
        this.pickedRows = new Array(this.pickedRows.length).fill(0);
      } else {
        const newPickedRows = new Array(this.pickedRows.length).fill(1);
        this.sortedRows.forEach((row, index) => {
          newPickedRows[index] = row[this.quantityAttribute];
        });
        this.pickedRows = newPickedRows;
      }
    },
    handleSort({ label, sortOrder }) {
      this.sortColumn = this.columns.find(
        (column) => this.getLabel(column) === label
      );
      this.sortOrder = sortOrder;

      const sorted = [...this.sortedRows].sort((a, b) => {
        let aVal = a[this.sortColumn];
        let bVal = b[this.sortColumn];

        if (isNaN(aVal) || isNaN(bVal)) {
          aVal = aVal.toString().toLowerCase();
          bVal = bVal.toString().toLowerCase();
        }

        if (aVal < bVal) {
          return this.sortOrder === 'asc' ? -1 : 1;
        } else if (aVal > bVal) {
          return this.sortOrder === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });

      const newPickedRows = new Array(this.rows.length).fill(0);
      const newQuantityOptionsMap = new Map();

      sorted.forEach((sortedRow, index) => {
        const originalIndex = this.rows.indexOf(sortedRow);
        if (this.picked.has(originalIndex)) {
          newPickedRows[index] = this.picked.get(originalIndex).picked;
        }
        if (this.quantityAttribute) {
          newQuantityOptionsMap.set(
            index,
            Array.from(
              { length: sortedRow[this.quantityAttribute] + 1 },
              (_, i) => i
            )
          );
        }
      });

      this.sortedRows = sorted;
      this.pickedRows = newPickedRows;
      this.quantityOptionsMap = newQuantityOptionsMap;
    },
    applySort() {
      if (this.sortColumn && this.sortOrder !== 'none') {
        this.handleSort({
          label: this.getLabel(this.sortColumn),
          sortOrder: this.sortOrder,
        });
      }
    },
  },
  watch: {
    isValid() {
      /**
       * Indicates if this component's value is valid or not.
       * @property {Boolean} valid `true` if the component's value is valid; `false` if it is invalid.
       */
      this.$emit('valid', this.isValid);
    },
    pickedAsArray: {
      handler(newPickedEntries) {
        this.syncPickedRows(newPickedEntries);
      },
      deep: true, // Ensure the watcher goes deep into the structure
    },
    pickedRows: {
      handler() {
        const pickedMap = new Map();
        for (let i = 0; i < this.pickedRows.length; i++) {
          if (this.pickedRows[i] > 0) {
            // Only add non-zero selections
            const row = this.sortedRows[i];
            const originalIndex = this.rows.indexOf(row);
            if (originalIndex !== -1) {
              pickedMap.set(originalIndex, {
                row,
                picked: this.pickedRows[i],
              }); // Store the quantity with the row
            }
          }
        }
        /**
         * Emitted when the pickedRows array has been updated.
         *
         * @event update:picked
         * @property {Map<number, Object>} picked - A Map where the keys are the indices of the picked rows in the `rows` prop, and the values are objects representing the picked rows and their data.
         *
         */
        this.$emit('update:picked', pickedMap);
      },
      deep: true,
    },
    rows: {
      handler() {
        // No good way to really know what has changed so deselect everything.
        // This should be an unusual event so hopefully it isn't an issue.
        this.showOverlay = null;
        this.sortedRows = [...this.rows]; // Update sortedRows when rows prop changes
        this.quantityOptionsMap = this.initializeQuantityOptionsMap(this.rows); // Initialize quantity options map
        this.applySort(); // Apply the sort when rows change

        // Rebuild pickedRows from picked Map
        this.pickedRows = new Array(this.sortedRows.length).fill(0);
        for (let i = 0; i < this.sortedRows.length; i++) {
          const row = this.sortedRows[i];
          const originalIndex = this.rows.indexOf(row);
          if (this.picked.has(originalIndex)) {
            this.pickedRows[i] = this.picked.get(originalIndex).picked;
          }
        }
      },
      deep: true,
    },
    units() {
      this.pickedRows = new Array(this.rows.length).fill(0);
    },
  },
  created() {
    //Emit the initial valid state of the component's value.
    this.$emit('valid', this.isValid);
    this.sortedRows = [...this.rows]; // Initialize sortedRows with the rows prop
    this.quantityOptionsMap = this.initializeQuantityOptionsMap(this.rows); // Initialize quantity options map

    if (this.picked instanceof Map && this.picked.size > 0) {
      this.pickedRows = new Array(this.sortedRows.length).fill(0);
      for (let i = 0; i < this.sortedRows.length; i++) {
        const row = this.sortedRows[i];
        const originalIndex = this.rows.indexOf(row);
        if (this.picked.has(originalIndex)) {
          this.pickedRows[i] = this.picked.get(originalIndex).picked; // or set to the quantity if needed
        }
      }
    } else {
      this.pickedRows = new Array(this.rows.length).fill(0);
    }

    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>

<style scoped>
.narrow-col {
  width: 24px;
  padding: 0px;
  margin: 0px;
  text-align: center;
}

.form-check {
  padding: 0px;
  margin: 0px;
}

.form-control-lg {
  padding-left: 20px;
  margin-left: 10px;
  margin-right: -10px;
  margin-top: -3px;
}

#picklist-all-button,
#picklist-units-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

#picklist-info-card {
  position: absolute;
  top: -37px;
  padding: 0px !important;
  margin: 0px !important;
  background-color: transparent;
  border-style: none;
  border-top-left-radius: 8px !important;
  border-top-right-radius: 8px !important;
}

#picklist-info-card-header {
  position: relative;
  left: -16px;
  padding: 0px !important;
  margin: 0px !important;
  background-color: green;
  opacity: 0.2;
}

#picklist-info-card-body {
  position: relative;
  left: -16px;
  background-color: green;
  opacity: 1;
  color: white;
  border-bottom-left-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}

#picklist-info-card ul {
  margin: 10px;
  margin-top: 0px;
  padding: 0px;
}

#picklist-table {
  max-height: 193px;
  padding-bottom: 0px;
  padding-top: 0px;
  margin-bottom: 0px;
  margin-top: 0px;
}

#picklist-all-button {
  padding-left: 3px;
  padding-right: 3px;
}

th {
  font-weight: bold;
}

tr,
th,
td {
  height: 30px;
}

.b-table {
  margin: 0px;
}
</style>
