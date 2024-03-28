<template>
  <div>
    <BTableSimple
      id="picklist-table"
      data-cy="picklist-table"
      small
      responsive
      striped
      bordered
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
              v-if="showAllButton"
              v-bind:disabled="showOverlay != null"
              size="sm"
              variant="primary"
              v-on:click="handleAllButton()"
            >
              All
            </BButton>
          </BTh>
          <BTh
            v-for="header in headers"
            v-bind:id="'picklist-header-' + header"
            v-bind:data-cy="'picklist-header-' + header"
            v-bind:key="header"
          >
            {{ header }}</BTh
          >
          <BTh
            v-if="showInfoIcons"
            class="narrow-col"
          >
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
            v-for="(col, j) in headers"
            v-bind:id="'picklist-' + headers[j] + '-' + i"
            v-bind:data-cy="'picklist-' + headers[j] + '-' + i"
            v-bind:key="j"
          >
            {{ row[col] }}
          </BTd>
          <BTd v-if="showInfoIcons">
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
                  <template #header>
                    <p />
                  </template>

                  <BCardBody
                    id="picklist-info-card-body"
                    data-cy="picklist-info-card-body"
                    v-bind:style="{
                      width: overlayWidth + 'px',
                      left: overlayLeft + 'px',
                    }"
                  >
                    <ul>
                      <span
                        v-for="(value, name) in rows[i]"
                        v-bind:key="name"
                      >
                        <li
                          v-if="!headers.includes(name)"
                          v-bind:id="'picklist-info-' + name"
                          v-bind:data-cy="'picklist-info-' + name"
                          v-bind:key="name"
                        >
                          {{ name }}: {{ value }}
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
  </div>
</template>

<script>
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
 *   v-bind:headers="headers"
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
 * Attribute Name            | Description
 * --------------------------| -----------
 * `picklist-checkbox-i`     | The checkbox in the leftmost column of the ith row (counting from 0).
 * `picklist-header-*`       | The `<th>` element for the column with header `*`.
 * `picklist-info-card`      | The `BCard` element that displays more detailed information about a row.
 * `picklist-info-card-body` | The `BCardBody` element that contains the `li` elements in the `BCard`.
 * `picklist-info-icon-i`    | The info icon in the rightmost column of the ith row (counting from 0).
 * `picklist-info-overlay`   | The `BOverlay` element that is used to display more detailed information on the rows.
 * `picklist-info-*`         | The `<li>` element in the info card that displays the attribute and value with name `*`.
 * `picklist-table`          | The `BTableSimple` element containing the items that can be picked.
 * `picklist-*-i`            | The `<td>` element in the column with header `*` in the ith row (counting from 0).
 */
export default {
  name: 'PicklistBase',
  components: {},
  emits: ['ready', 'update:picked', 'valid'],
  props: {
    /**
     * An array of strings giving the column headers.
     * Each column header must match an attribute name in the objects in the array provided by the `rows` prop.
     */
    headers: {
      type: Array,
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
     * An array of objects giving the data for each row.
     * Each object is expected to contain an attribute for each name listed in the array given by the `headers` prop.
     * Attributes not listed in the `headers` prop and their values will be displayed in the additional info overlay.
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
  },
  data() {
    return {
      showOverlay: null,
      overlayWidth: null,
      overlayLeft: null,
      pickedRows: this.picked,
    };
  },
  computed: {
    isValid() {
      for (let i = 0; i < this.pickedRows.length; i++) {
        if (this.pickedRows[i]) {
          return true;
        }
      }

      return false;
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
  },
  methods: {
    showInfoIcon(row) {
      return Object.keys(this.rows[row]).length > this.headers.length;
    },
    showInfo(row) {
      const table = document.getElementById('picklist-table');
      if (table != null) {
        this.overlayWidth = table.clientWidth - 55;
        this.overlayLeft = -(table.clientWidth - 43);
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
  top: -16px;
  background-color: transparent;
  border-color: green;
  border-width: 2px;
  border-radius: 8px !important;
  border-radius: 8px !important;
}

#picklist-info-card-body {
  background-color: green;
  color: white;
  opacity: 1;
  margin: -18px;
  margin-top: 8px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

#picklist-info-card ul {
  margin: 10px;
  margin-top: 0px;
  padding: 0px;
}

#picklist-table {
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
