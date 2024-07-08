<template>
  <BFormGroup
    id="sort-order-button-group"
    data-cy="sort-order-button-group"
    class="p-0"
  >
    <div
      id="sort-order-button-container"
      data-cy="sort-order-button-container"
    >
      <BButton
        id="sort-order-button"
        data-cy="sort-order-button"
        block
        squared
        v-on:click="toggleSortOrder"
        v-bind:variant="false"
        v-bind:class="{ sorted: orderBy !== 'none' }"
      >
        <span
          id="sort-order-text"
          data-cy="sort-order-text"
        >
          {{ label }}
        </span>

        <span
          id="sort-order-icon"
          data-cy="sort-order-icon"
        >
          <svg
            v-if="orderBy === 'none'"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="24"
            height="24"
          >
            <symbol
              id="sort"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 12h14M3 6h18M3 18h10"
                fill="none"
                stroke="currentColor"
                stroke-width="2.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </symbol>
            <use
              xlink:href="#sort"
              width="18"
              height="18"
            />
          </svg>
          <span
            class="sort-order-unicode"
            v-else-if="orderBy === 'asc'"
            >↓</span
          >
          <span
            class="sort-order-unicode"
            v-else-if="orderBy === 'desc'"
            >↑</span
          >
        </span>
      </BButton>
    </div>
  </BFormGroup>
</template>

<script>
import { BButton } from 'bootstrap-vue-next';

/**
 * A button component for toggling the sort order between ascending and descending.
 * It displays an icon that changes based on the current sort order.
 *
 * ## Live Example
 *
 * <a href="http://farmos/fd2_examples/sort_order_button">SortOrderButton Example</a>
 *
 * Source: <a href="../../modules/farm_fd2_examples/src/entrypoints/sort_order_button/App.vue">App.vue</a>
 *
 * ## Usage Example
 *
 * ```html
 * <SortOrderButton
 *   id="sort-order-button-letters"
 *   data-cy="sort-order-button-letters"
 *   v-bind:label="'example'"
 *   v-bind:isActive="true"
 *   v-bind:sortOrder="'asc'"
 *   v-on:sort="handleSort"
 *   v-on:activate="handleActivate"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name                   | Description
 * ---------------------------------| -----------
 * `sort-order-button-group`        | Identifies the form group element.
 * `sort-order-button-container`    | Identifies the container div element for the button.
 * `sort-order-button`              | Identifies the button element.
 * `sort-order-text`                | Identifies the text element within the button.
 * `sort-order-icon`                | Identifies the icon element within the button.
 */
export default {
  name: 'SortOrderButton',
  components: { BButton },
  emits: ['ready', 'sort'],
  props: {
    /**
     * The label to be displayed on the button.
     */
    label: {
      type: String,
      required: true,
    },
    /**
     * The current sort order. Can be 'asc', 'desc', or 'none'.
     */
    sortOrder: {
      type: String,
      default: 'none', // 'asc' or 'desc'
    },
  },
  data() {
    return {
      orderBy: this.sortOrder || 'none',
    };
  },
  watch: {
    sortOrder(newSortOrder) {
      this.orderBy = newSortOrder;
    },
  },
  methods: {
    toggleSortOrder() {
      if (this.orderBy === 'none' || this.orderBy === 'desc') {
        this.orderBy = 'asc';
      } else {
        this.orderBy = 'desc';
      }
      /**
       * The sort order changed.
       * @property {Object} event - Contains the label and the current sort order.
       * @property {String} event.label - The label for the sort order button.
       * @property {String} event.sortOrder - The current sort order, which can be 'asc' for ascending, 'desc' for descending, or 'none'.
       */
      this.$emit('sort', {
        label: this.label,
        sortOrder: this.orderBy,
      });
    },
  },
  created() {
    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>

<style scoped>
#sort-order-text {
  color: #222330;
}

#sort-order-button.sorted #sort-order-text,
#sort-order-button.sorted #sort-order-icon,
#sort-order-button:hover #sort-order-text {
  color: #198754;
}

#sort-order-icon {
  color: #6c757d;
  opacity: 0.5;
  transition: none;
  width: 30px;
  height: 30px;
}

#sort-order-button.sorted #sort-order-icon,
#sort-order-button:hover #sort-order-icon {
  opacity: 1;
}

#sort-order-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  transition: none;
  padding: 0;
}

#sort-order-button-container {
  margin-right: 1.5rem;
}

#sort-order-button:hover {
  border-bottom: 1px solid #198754;
  opacity: 1;
}

.sort-order-unicode {
  font-size: 1.3rem;
  transition: none;
}
</style>
