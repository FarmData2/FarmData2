<template>
  <p>A set of examples illustrating the use of the FarmData2 components.</p>
  <ul>
    <li>
      <a href="bed_picker">BedPicker</a>: A component for picking multiple beds.
    </li>
    <li>
      <a href="date_selector">DateSelector</a>: A component for selecting a
      date.
    </li>
    <li>
      <a href="picker_base">PickerBase</a>: Base component for picking multiple
      items via checkboxes.
    </li>
    <li>
      <a href="picklist_base">PicklistBase</a>: Base component for picking
      multiple items from a list displayed as a table.
    </li>
    <li>
      <a href="selector_base">SelectorBase</a>: Base component for selecting an
      item via a drop down list.
    </li>
    <li>
      <a href="soil_disturbance">SoilDisturbance</a>: A component for collecting
      data on soil disturbances.
    </li>
    <li>
      <a href="transplanting_picklist">TransplantingPicklist</a>: A component
      for selecting a crop from a list of all crops that currently have tray
      seedings.
    </li>
  </ul>

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>

  <br />
</template>

<script>
export default {
  data() {
    return {
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 1;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>
