<template>
  <div
    id="picklist-div"
    data-cy="picklist-div"
    v-bind:style="{ padding: '2px', border: '1px solid ' + borderColor }"
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
      >
        <BThead>
          <BTr>
            <BTh
              class="narrow-col"
              stickyColumn
            >
              <BButton
                id="picklist-all-button"
                data-cy="picklist-all-button"
                v-if="allButtonVisible"
                v-bind:disabled="showOverlay != null"
                size="sm"
                variant="primary"
                v-on:click="handleAllButton()"
              >
                All
              </BButton>
            </BTh>
            <BTh
              v-for="header in columns"
              v-bind:id="'picklist-header-' + getLabel(header)"
              v-bind:data-cy="'picklist-header-' + getLabel(header)"
              v-bind:key="header"
            >
              {{ getLabel(header) }}</BTh
            >
            <BTh
              v-if="showInfoIcons"
              class="narrow-col"
            >
            </BTh>
          </BTr>
          <BTr v-if="validityStyling === false">
            <Bth></Bth>
            <BTh
              colspan="100"
              style="font-weight: normal"
            >
              <BFormInvalidFeedback
                id="picklist-invalid-feedback"
                data-cy="picklist-invalid-feedback"
                v-bind:state="validityStyling"
              >
                At least one row must be selected
              </BFormInvalidFeedback>
            </BTh>
          </BTr>
        </BThead>

        <BTbody>
          <BTr
            v-for="(row, i) in rows"
            v-bind:key="i"
          >
            <BTh stickyColumn>
              <BFormCheckbox
                v-bind:id="'picklist-checkbox-' + i"
                v-bind:data-cy="'picklist-checkbox-' + i"
                v-bind:name="'picklist-checkbox-' + i"
                v-bind:key="i"
                v-bind:disabled="showOverlay != null"
                v-model="pickedRows[i]"
                size="lg"
              />
            </BTh>
            <BTd
              v-for="(col, j) in columns"
              v-bind:id="'picklist-' + getLabel(columns[j]) + '-' + i"
              v-bind:data-cy="'picklist-' + getLabel(columns[j]) + '-' + i"
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
                v-if="showInfoIcon(i)"
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
                          v-for="(value, name) in rows[i]"
                          v-bind:key="name"
                        >
                          <li
                            v-if="includeAttributeInInfo(name)"
                            v-bind:id="'picklist-info-' + name"
                            v-bind:data-cy="'picklist-info-' + name"
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
 *   id="picklist"
 *   data-cy="picklist"
 *   v-bind:required="required"
 *   v-bind:showValidityStyling="validity.showStyling"
 *   v-bind:columns="columns"
 *   v-bind:labels="labels"
 *   v-bind:rows="rows"
 *   v-bind:showAllButton="showAllButton"
 *   v-bind:showInfoIcons="showInfoIcons"
 *   v-bind:picked="form.picked"
 *   v-on:valid="(valid) => (validity.picked = valid)"
 *   v-on:update:picked="form.picked = $event"
 *   v-on:ready="createdCount++"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name              | Description
 * ----------------------------| -----------
 * `picklist-checkbox-i`       | The checkbox in the leftmost column of the ith row (counting from 0).
 * `picklist-header-*`         | The `<th>` element for the column with header `*`.
 * `picklist-info-card`        | The `BCard` element that displays more detailed information about a row.
 * `picklist-info-card-header` | The `BCardHeader` element that is the transparent area of the info table.
 * `picklist-info-card-body`   | The `BCardBody` element that contains the `li` elements in the `BCard`.
 * `picklist-info-icon-i`      | The info icon in the rightmost column of the ith row (counting from 0).
 * `picklist-info-overlay`     | The `BOverlay` element that is used to display more detailed information on the rows.
 * `picklist-info-*`           | The `<li>` element in the info card that displays the attribute and value with name `*`.
 * `picklist-invalid-feedback` | The `BFormInvalidFeedback` element that displays help when the picklist value is invalid.
 * `picklist-table`            | The `BTableSimple` element containing the items that can be picked.
 * `picklist-*-i`              | The `<td>` element in the column with header `*` in the ith row (counting from 0).
 */
export default {
  name: 'PicklistBase',
  components: { BCardHeader },
  emits: ['ready', 'update:picked', 'valid'],
  props: {
    /**
     * An array of strings giving the attribute names of the values to appear in each column of the table.
     * Each column name must match an attribute name in the objects in the array provided by the `rows` prop.
     * The column header will be given by the mapping of the attribute name to its label as given by the `labels` prop.
     */
    columns: {
      type: Array,
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
     * An array of boolean values indicating the rows in the table that are picked.
     * The rows are indexed from 0.
     * The length of this array must be equal to the length of the array provided by the `rows` prop.
     */
    picked: {
      type: Array,
      default: () => [],
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
     * Attributes not listed in the `columns` prop and their values will be displayed in the additional info overlay.
     */
    rows: {
      type: Array,
      required: true,
    },
    /**
     * Whether the select "All" button should be displayed in the first column header.
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
     * Whether validity styling should appear on input elements.
     */
    showValidityStyling: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showOverlay: null,
      overlayWidth: null,
      overlayLeft: null,
      infoRowHeight: null,
      pickedRows: this.picked,
    };
  },
  computed: {
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
      return this.showAllButton && this.rows && this.rows.length > 1;
    },
    borderColor() {
      if (this.validityStyling) {
        return 'green';
      } else if (this.validityStyling === false) {
        return 'red';
      } else {
        return '#dee2e6';
      }
    },
  },
  methods: {
    includeAttributeInInfo(attributeName) {
      return (
        !this.columns.includes(attributeName) && this.getLabel(attributeName)
      );
    },
    getLabel(attributeName) {
      return this.labels[attributeName];
    },
    showInfoIcon(row) {
      return Object.keys(this.rows[row]).length > this.columns.length;
    },
    showInfo(row) {
      const table = document.getElementById('picklist-table');
      if (table != null) {
        this.overlayWidth = table.clientWidth - 56;
        this.overlayLeft = -(table.clientWidth - 43);
      }

      const tableCell = document.getElementById('picklist-info-' + row);
      if (tableCell != null) {
        this.infoRowHeight = tableCell.offsetHeight;
      }

      this.showOverlay = row;
    },
    handleAllButton() {
      if (this.allPicked) {
        this.pickedRows = [];
      } else {
        this.pickedRows = new Array(this.rows.length).fill(true);
      }
    },
  },
  watch: {
    isValid() {
      /**
       * This component is valid if at least one row is selected.
       * @property {Boolean} valid `true` if the component's value is valid; `false` if it is invalid.
       */
      this.$emit('valid', this.isValid);
    },
    picked: {
      handler() {
        this.pickedRows = this.picked;
      },
      deep: true,
    },
    pickedRows: {
      handler() {
        /**
         * There has been a change to the picked rows.
         *
         * @property {Array} pickedRows If index `i` is `true` the row is picked. If row `i` is not picked index `i` will not be `true` (i.e. it may be `undefined`, `null` or `false`).
         */
        this.$emit('update:picked', this.pickedRows);
      },
      deep: true,
    },
    rows: {
      handler() {
        // No good way to really know what has changed so deselect everything.
        // This should be an unusual event so hopefully it isn't an issue.
        this.pickedRows = [];
        this.showOverlay = null;
      },
      deep: true,
    },
  },
  created() {
    //Emit the initial valid state of the component's value.
    this.$emit('valid', this.isValid);

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
  max-height: 250px;
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
