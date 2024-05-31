<template>
  <!-- 
    Every HTML element that is tested must have an id and a 
    data-cy attribute. The values of these attributes should be
    the same and should be prefixed with the name of the entry point.
    Use the examples below as a guide when adding your own elements.
  -->
  <div
    id="%ID_PREFIX%"
    data-cy="%ID_PREFIX%"
  >
    <h1
      id="%ID_PREFIX%-header"
      data-cy="%ID_PREFIX%-header"
    >
      %ENTRY_POINT_TITLE%
    </h1>

    <p
      id="%ID_PREFIX%-text"
      data-cy="%ID_PREFIX%-text"
    >
      Placeholder content for the %ENTRY_POINT_TITLE% entry point.
    </p>

    <!-- 
      This invisible div is used to signal e2e tests, allowing them 
      to check if all of the page content has been loaded. 
      See the `data.createdCount` attribute and the `pageDoneLoading`
      computed property in the `<script>` section below for 
      more information.
    -->
    <div
      id="page-loaded"
      data-cy="page-loaded"
      v-show="false"
    >
      {{ pageDoneLoading }}
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      /*
       * This value counts the number of components that have been created
       * including the SFC that is the entry point.  This value is used by
       * the `pageDoneLoading` computed property to determine when all of
       * the components have been crated.  See the `pageDoneLoading` computed
       * property below for more information.
       */
      createdCount: 0,
    };
  },
  computed: {
    /*
     * This property must become `true` when all of the components
     * used by this entry point, plus the entry point's SFC itself,
     * are fully ready to be used. For example any API calls that
     * they make in their `created` hooks are complete.
     *
     * To find the value to use for comparison here, count one for each
     * FarmData2 Vue Component that is used by this entry point and add
     * one for the entry point SFC itself. BootstrapVueNext Vue Components
     * do not follow this convention and should not be counted.
     *
     * This computed property is:
     *  - bound in the invisible`page-loaded` `div` above.
     *  - incremented in response to the `ready` event in a `v-on`
     *    handler for each Vue Component used in the entry point.
     *    See the `DateSelector`,  `CommentBox` and `SubmitResetButtons`
     *    Vue Components above.
     *  - incremented when this entry point's `created` life cycle hook
     *    completes.  See the `created()` method below.
     *
     * E2e tests for this entry point will use the `cy.waitForPage()`
     * function to check this value and only continue with the test
     * when all of the components are fully ready.
     */
    pageDoneLoading() {
      return this.createdCount == 1;
    },
  },
  methods: {},
  watch: {},
  /*
   * The `created()` life cycle hook is called when the Vue instance
   * for the entry point has been created in the browser. This function
   * can be used to do initialization of the entry point. For example,
   * if the entry point needs data from farmOS then this function can
   * fetch that data. In most cases, data needed from farmOS is fetched
   * by the individual Vue Components used in the page and this hook
   * will simply increment `this.createdCount`.
   */
  created() {
    this.createdCount++;
  },
};
</script>

<style></style>
