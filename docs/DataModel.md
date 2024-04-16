# FarmData2 Data Model

FarmData2 uses the farmOS data model to store all of the data that it collects. The data model is organized around representing farming operation including seeding (tray, direct, cover crop), transplanting, harvesting, and soil disturbances and amendments.

The data representing these operations is organized using farmOS/Drupal _taxonomies_, _assets_, _logs_, _quantities_.

- **Taxonomies** are collections of terms such as crops, equipment, units, etc.
- **Assets** represent physical objects, such as plants, fields, beds, greenhouses, etc.
- **Logs** represent an operation or activity, such as seeding, transplanting, harvesting, tillage, etc.
- **Quantities** represent an amount associated with the action represented by a log, such as seeds, trays, bed feet, speed, depth, etc.

LINK TO THE FARMOS DATA MODEL HERE.

## The `farmosUtil` Library

The `farmosUtil.js` library provides the functions that are used to interact with (e.g. create, fetch and delete) the taxonomies, assets, logs and quantities used by FarmData2.

## Data Consistency

FarmData2 uses a number of assets and taxonomies to ensure data consistency. For example, all fields are defined as land assets and any time an activity takes place in a field, the log representing that activity is associated with a defined field. Similarly, activities related to a crop are always associated with a defined crop. This helps to ensure data consistency by preventing typos, different capitalizations, etc.

### Land & Structure Assets

Fields, greenhouses, and beds.

### Equipment Assets

### Taxonomies

#### Crops

#### Log Categories

The following log categories are defined by the [conventions used for storing data related to the PASA Soil Health Benchmark Study](https://our-sci.gitlab.io/software/json_schema_distribution/staging_wiki/docs/Description%20and%20Specification) and one of them must be associated with every log that is created:

```text
amendment,For logs where soil amendments are made.
grazing,For logs that record animal grazing events.
irrigation,For logs associated with field irrigation.
pest_disease_control,For logs related to pest or disease control.
seeding,For logs associated with seedings.
termination,For logs associated with termination of a planting.
tillage,For logs representing soil disturbances.
transplanting,For logs representing transplantation of a plant.
weed_control,For logs related to weed control.
```

The following log categories are defined specifically by FarmData2 and should be applied to any log that is associated with the type of event described. For example, an activity log representing the `tillage` associated with a direct seeding should also have a `seeding_direct` log category.

```text
seeding_cover_crop,For logs associated with the seeding of a cover crop.
seeding_direct,For logs associated with direct seedings.
seeding_tray,For logs associated with seedings in trays.
```

MOVE GENERAL DESCRIPTIONS OF THE LOGS HERE AND THEN REFER TO THEM BELOW.

#### Tray Sizes

#### Units

## Representing Operations

FarmData2 represents operations using assets and logs.

MAYBE GIVE GENERAL DESCRIPTION OF OPERATION REPRESENTATION HERE AND THEN ADD DETAILS AFTER THAT INSTEAD OF OTHER WAY AROUND?

### Plant Asset Naming Conventions

FarmData2 uses the following convention for naming plant assets:

- `yyyy-mm-dd_<crop>`

### Log Naming Conventions

FarmData2 uses the following convention for naming logs:

- `yyyy-mm-dd_<type>_<description>`
  - `<type>` is an abbreviation for the type of operation
    - `ts` - tray seeding
    - `ds` - direct seeding
    - `cs` - cover crop seeding
    - `xp` - transplanting
    - `ha` - harvest
    - `sd` - soil disturbance
    - `sa` - soil amendment
  - `<description>` is typically one word that describes the operation. For example, for a tray seeding the `<description>` is the name of the crop that was seeded.

### Plant Assets

Every planting in FarmData2 has a single plant asset associated with it.

MOVE GENERAL DESCRIPTION OF PLANT ASSET HERE AND THEN REFERENCE IT BELOW.

### Logs

Every operation in FarmData2 has one or more logs associated with it.

#### Seeding Logs

`yyyy-mm-dd_<type>_<crop>` - where `<type>` is `ts`, `ds`, or `cs` as defined above.

#### Transplanting Logs

`yyyy-mm-dd_xp_<crop>`

#### Tillage Logs

`yyyy-mm-dd_sd_<location>`

#### Amendment Logs

### Quantities

## FarmData2 Operations

### Seeding Operations

#### Tray Seeding

A tray seeding represents the activity and product of planting seeds in trays in a greenhouse.

MOVE THE SPECIFIC DESCRIPTIONS OF THE ASSETS AND LOGS ABOVE AND JUST REFER TO THEM HERE.

A tray seeding consists of:

- An `asset--plant` representing the seeded plant in the greenhouse.
  - The `Inventory` of this asset represents the number of trays currently available for transplanting and is managed by quantities attached to logs via the farmOS Inventory module.
  - Comments associated with the tray seeding are stored in the `asset--plant` asset.
- A `log--seeding` representing the seeding activity with:
  - log `category` set to `seeding_tray`
  - three `quantity--standard` records with the labels:
    - `Trays`: The number of trays that were seeded with units of `TRAYS`. This quantity sets the plant asset's inventory.
    - `Tray Size`:The number of cells in each tray with units of `CELLS/TRAY`.
    - `Seeds`:The total number of seeds planted with units of `SEEDS`. Note: This is computed from the other data entered in the form (trays x cells per tray x seeds per cell).
  - References the `asset--plant` asset in its `relationship.assets` attribute.
  - References the greenhouse in its `relationship.location` attribute.

Logs and assets associated with a tray seeding will be named: `yyyy-mm-dd_ts_cropName`

See `modules/farm_fd2/src/entrypoints/tray_seeding/lib.js` for the details of how the asset, quantities and log are created.

#### Direct Seeding

A direct seeding represents the activity and product of planting seeds directly in the ground.

A direct seeding consists of:

- An `asset--plant` representing the seeded plant in the ground.
  - Comments associated with the direct seeding are stored in the `asset--plant` asset.
- A `log--seeding` representing the seeding activity:
  - the log `category` set to `[seeding, seeding_direct]`
  - four `quantity--standard` records with the labels:
    - `Bed Feet`: the number of bed feet that were seeded with units of 'FEET'.
    - `Rows/Bed`: the number of rows in the bed that was seeded with units of `ROWS/BED'
    - `Row Feet`: the number of row feet that were seeded with units of `FEET`. This quantity is an inventory quantity that increments the Row Feet inventory of the plant asset.
    - `Bed/Width`: the width of the bed that was seeded with units `INCHES`
  - References the `asset--plant` asset in its `relationship.assets` attribute.
  - References the field/greenhouse and beds (if selected) in its `relationship.location` attribute.
- A `log--activity` representing the soil disturbance associated with the direct seeding with:
  - the log `category` set to `[tillage, seeding_direct]`
  - `equipment` relationships for all of the equipment used.
  - three `quantity--standard` records with the labels:
    - `Depth`: the depth of the soil disturbed with units of `INCHES`
    - `Speed`: the rate at which the soil was disturbed with units of `MPH`
    - `Area`: the area of the soil disturbed as a percentage of the location (e.g. 50% of the field) with units of `PERCENT`.
  - References the `asset--plant` asset in its `relationship.assets` attribute.
  - References the field or bed in its `relationship.location` attribute.

Logs and assets associated with a direct seeding will be named: `yyyy-mm-dd_ds_cropName`

See `modules/farm_fd2/src/entrypoints/direct_seeding/lib.js` for the details of how the asset, quantities and logs are created.

#### Cover Crop Seeding

### Transplanting

A transplanting represents the activity of moving the seedlings that result from a tray seeding to being planted directly in the ground.

A transplanting consists of:

- An `asset--plant` representing the transplanted trays in the ground.
  - Comments associated with the transplanting are stored in the `asset--plant` asset.
  - Has each tray seeded planting that was transplanted as a parent.
- A `log--activity` representing the transplanting operation with:
  - the log `category` set to `[transplanting]`
  - four `quantity--standard` records with the labels:
    - `Bed Feet`: the number of bed feet that were seeded with units of 'FEET'.
    - `Rows/Bed`: the number of rows in the bed that was seeded with units of `ROWS/BED'
    - `Row Feet`: the number of row feet that were seeded with units of `FEET`. This quantity is an inventory quantity that increments the Row Feet inventory of the plant asset.
    - `Bed/Width`: the width of the bed that was seeded with units `INCHES`
  - one `quantity--standard` for every tray seeded planting from which trays were transplanted with the label:
    - `Trays`: the number of trays that were transplanted with units of `TRAYS`. This quantity is an inventory quantity that decrements the Trays inventory of the plant asset from which the trays came.
  - Reference to the transplanting `asset--plant` asset in its `relationship.assets` attribute.
  - `is_movement` set to true
  - References the field or greenhouse and beds (if selected) in its `relationship.location` attribute.
- A `log--activity` representing the soil disturbance associated with the transplanting (if equipment data is provided)with:
  - the log `category` set to `[tillage, transplanting]`
  - `equipment` relationships for all of the equipment used.
  - three `quantity--standard` records with the labels:
    - `Depth`: the depth of the soil disturbed with units of `INCHES`
    - `Speed`: the rate at which the soil was disturbed with units of `MPH`
    - `Area`: the area of the soil disturbed as a percentage of the location (e.g. 50% of the field) with units of `PERCENT`.
  - References the `asset--plant` asset in its `relationship.assets` attribute.
  - References the field and beds (if selected) in its `relationship.location` attribute.

Logs and assets associated with a transplanting will be named: `yyyy-mm-dd_xp_cropName`

See `modules/farm_fd2/src/entrypoints/transplanting/lib.js` for the details of how the quantities and logs are created.

### Harvesting

- Decrease FEET inventory on the planting????? Optionally entered?

### Soil Disturbance

### Soil Amendment
