# Adding Fields to farmOS Entities

This is a draft!

The purpose of this document is to describe how to add new fields to farmOS entities.

## Adding a Field to a Taxonomy Term

To add a field to a Vocabulary of Taxonomy Terms (`plant_type`)

### Create the Field and its Storage

- Go to Administration -> Structure -> Taxonomy
  - Pick "Edit Vocabulary" in the dropdown for the Vocabulary to be edited.
  - Under "Manage Fields"
    - Click "Create a new field"
    - Configure the field.
    - Save
    - Use `npm run printlog taxonomy_term--????` to confirm the field has been created.
      - Replace `????` with the name of the vocabulary to which the field has been added.
  - Under "Manage Form Display"
    - ~~Move the field to the preferred location.~~ (locations cannot be specified in the configuration so this is a waste of time).
    - Use the "Gear" icon to configure the field edit widget.
    - Save
    - Go to Administration -> Structure -> Taxonomy
      - Pick "Add Terms" in the dropdown for the Vocabulary being edited.
      - Confirm that the widget for the new field is present.
  - Under "Manage Display"
    - ~~Move the field to the preferred location.~~ (locations cannot be specified in the configuration so this is a waste of time).
    - Use the dropdowns and "Gear" icon to configure the field display widget.
    - Save
    - Go to Administration -> Structure -> Taxonomy
      - Create a new term in the vocabulary being edited.
      - View the new term and confirm that the added field is present.
- Go to Administration -> Configuration -> Development -> Configuration synchronization
  - Under "Export" choose "Single item"
    - For "Configuration type" pick "Field"
      - For "Configuration name" pick the new field that you added.
        - Copy the configuration except for the `uuid` line.
        - Replace the `field_` prefix throughout with `fd2_`.
        - Save it in `modules/farm_fd2/src/module/config/install` using the filename given below the configuration with the `field_` prefix replaced with `fd2_`.
    - For "Configuration type" pick "Field storage"
      - - For "Configuration name" pick the new field that you added.
        - Copy the configuration except for the `uuid` line.
        - Replace the `field_` prefix throughout with `fd2_`.
        - Save it in `modules/farm_fd2/src/module/config/install` using the filename given below the configuration with the `field_` prefix replaced with `fd2_`.
  - Run
    - `npm run build:fd2`
    - `installDB.bash --current`
    - use `npm run printlog taxonomy_term--???` to confirm that the field has been added to the database

### Add the Field to the Form and Display

- Add code to the `modules/farm_fd2/src/module/farm_fd2.module` file to add the new field to the `farm_plant_type` entity.
  - The code below shows the general structure of the code.
  - Typically an appropriate `if` block containing the necessary `$form_display->setComponent` and `$display->setComponent` calls can be added.
    - The `weight` of the field in the form and display can then be adjusted to position the field.

```php
function farm_plant_type_entity_form_display_alter(
  EntityFormDisplayInterface $form_display,
  array $context
) {
  if (
    $context['entity_type'] == 'taxonomy_term' &&
    $context['bundle'] == 'plant_type'
  ) {
    $form_display->setComponent('fd2_harvest_units', [
      'type' => 'entity_reference',
      'settings' => [
        'target_type' => 'taxonomy_term',
      ],
      'region' => 'content',
      'weight' => 2,
    ]);
  }
}

function farm_plant_type_entity_view_display_alter(
  EntityViewDisplayInterface $display,
  array $context
) {
  if (
    $context['entity_type'] == 'taxonomy_term' &&
    $context['bundle'] == 'plant_type'
  ) {
    $display->setComponent('fd2_harvest_units', [
      'type' => 'entity_reference',
      'label' => 'inline',
      'settings' => [
        'target_type' => 'taxonomy_term',
      ],
      'region' => 'content',
      'weight' => 25,
    ]);
  }
}
```
