<!-- eslint-disable prettier/prettier -->
<template>
  <p>A set of examples illustrating the use of the FarmData2 components.</p>
  <ul>
    <li>
      <a href="active_plant_asset_picklist">ActivePlantAssetPicklist</a>: The ActivePlantAssetPicklist allows the user to pick crops from a location.
    </li>
    <li>
      <a href="bed_picker">BedPicker</a>: The BedPicker component is a UI element that allows the user to select beds from a within a location.
    </li>
    <li>
      <a href="comment_box">CommentBox</a>: The CommentBox component provides a UI element that allows the user to enter a comment.
    </li>
    <li>
      <a href="crop_selector">CropSelector</a>: The CropSelector component is a UI element that allows the user to select a crop.
    </li>
    <li>
      <a href="date_selector">DateSelector</a>: The DateSelector component provides a UI element for selecting a date.
    </li>
    <li>
      <a href="equipment_selector">EquipmentSelector</a>: The EquipmentSelector is a component for selecting equipment that was used for an activity.
    </li>
    <li>
      <a href="location_selector">LocationSelector</a>: The LocationSelector component provides a UI element that allows the user to select a location.
    </li>
    <li>
      <a href="multi_crop_selector">MultiCropSelector</a>: The MultiCropSelector is a component for selecting multiple crops.
    </li>
    <li>
      <a href="multi_selector_base">MultiSelectorBase</a>: The MultiSelectorBase is a component for selecting multiple items. 
    </li>
    <li>
      <a href="numeric_input">NumericInput</a>: The NumericInput component is a UI component used to read numeric input values from the user.
    </li>
    <li>
      <a href="picker_base">PickerBase</a>: The PickerBase is a base component that allows the user to pick multiple items using checkboxes.
    </li>
    <li>
      <a href="picklist_base">PicklistBase</a>: The `PicklistBase` component allows the user to pick multiple items from a list displayed as a table.
    </li>
    <li>
      <a href="selector_base">SelectorBase</a>: The SelectorBase component is a base component used to build other components
    </li>
    <li>
      <a href="soil_disturbance">SoilDisturbance</a>: The SoilDisturbance component collects data on soil disturbances, including
    </li>
    <li>
      <a href="sort_order_button">SortOrderButton</a>: The SortOrderButton component is used to toggle the sort order between ascending and descending.
    </li>
    <li>
      <a href="submit_reset_buttons">SubmitResetButtons</a>: The SubmitResetButtons component provides the Submit and Reset buttons used on forms.
    </li>
    <li>
      <a href="text_display">TextDisplay</a>: A TextDisplay component provides a UI element for displaying a labeled text string.
    </li>
    <li>
      <a href="transplanting_picklist">TransplantingPicklist</a>: A TransplantingPicklist allows the user to select a crop from a list
    </li>
    <li>
      <a href="tray_size_selector">TraySizeSelector</a>: The TraySizeSelector component is a UI element that allows the user to select a tray size (i.e. number of cells) for a tray seeding.
    </li>
    <li>
      <a href="winter_kill">WinterKill</a>: The WinterKill component provides a UI element for specifying if a crop seeding will be winter killed.
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
