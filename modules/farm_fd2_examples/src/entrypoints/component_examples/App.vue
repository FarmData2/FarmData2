<template>
  <p>A set of examples illustrating the use of the FarmData2 components.</p>
  <ul>
    <li>
      <a href="bed_picker">BedPicker</a>: A component for picking multiple beds.
    </li>
    <li>
      <a href="comment_box">CommentBox</a>: A component for writing a comment.
    </li>
    <li>
      <a href="crop_selector">CropSelector</a>: A component for selecting a
      crop.
    </li>
    <li>
      <a href="date_selector">DateSelector</a>: A component for selecting a
      date.
    </li>
    <li>
      <a href="equipment_selector">EquipmentSelector</a>: A component for
      selecting equipment.
    </li>
    <li>
      <a href="location_selector">LocationSelector</a>: A component for
      selecting a location.
    </li>
    <li>
      <a href="multi_crop_selector">MultiCropSelector</a>: A component for
      selecting multiple crops.
    </li>
    <li>
      <a href="numeric_input">NumericInput</a>: A component for inputting a
      numerical value.
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
      <a href="submit_reset_buttons">SubmitResetButtons</a>: A component for the
      Submit and Reset buttons used on forms.
    </li>
    <li>
      <a href="text_display">TextDisplay</a>: A component for displaying a
      labeled text string.
    </li>
    <li>
      <a href="transplanting_picklist">TransplantingPicklist</a>: A component
      for selecting a crop from a list of all crops that currently have tray
      seedings.
    </li>
    <li>
      <a href="winter_kill">WinterKill</a>: A component to specify if a crop
      will be winter killed.
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
