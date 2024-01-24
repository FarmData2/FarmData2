# FarmData2 Data Model

## Log Categories

The following log categories are defined by the [conventions used for storing data related to the PASA Soil Health Benchmark Study](https://our-sci.gitlab.io/software/json_schema_distribution/staging_wiki/docs/Description%20and%20Specification) and one of them should be associated with every log that is created:

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

## Units

## Log/Asset Naming Conventions

The general convention for naming logs and generated assets is:

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

### Assets

### Logs

### Quantities

## Seeding Operations

### Tray Seeding

A tray seeding represents the activity and product of planting seeds in trays in a greenhouse.

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

### Direct Seeding

A direct seeding represents the activity and product of planting seeds directly in the ground.

A direct seeding consists of:

- An `asset--plant` representing the seeded plant in the ground.
  - Comments associated with the direct seeding are stored in the `asset--plant` asset.
- A `log--seeding` representing the seeding activity:
  - the log `category` set to `seeding_direct`
  - three `quantity--standard` records with the labels:
    - `Bed Feet`: the number of bed feet that were seeded with units of 'FEET'
    - `Rows/Bed`: the number of rows in the bed that was seeded with units of `ROWS/BED'
    - `Bed/Width`: the width of the bed that was seeded with units `INCHES`
  - References the `asset--plant` asset in its `relationship.assets` attribute.
  - References the field or bed in its `relationship.location` attribute.
- A `log--activity` representing the soil disturbance associated with the direct seeding with:
  - the log `category` set to `tillage`
  - `equipment` relationships for all of the equipment used.
  - two `quantity--standard` records with the labels:
    - `Depth`: the depth of the soil disturbed with units of `INCHES`
    - `Speed`: the rate at which the soil was disturbed with units of `MPH`
  - References the `asset--plant` asset in its `relationship.assets` attribute.
  - References the field or bed in its `relationship.location` attribute.

Logs and assets associated with a direct seeding will be named: `yyyy-mm-dd_ds_cropName`

See `modules/farm_fd2/src/entrypoints/direct_seeding/lib.js` for the details of how the asset, quantities and logs are created.

### Cover Crop Seeding

## Transplanting

- Decrease Trays inventory on the planting and create new in ground planting for each transplant operation.

NOTE: There is no transplant log type.

- Possibly just use an activity log with a transplanting log category?

## Harvesting

- Decrease row/feed inventory on the in ground planting.

## Soil Disturbance
