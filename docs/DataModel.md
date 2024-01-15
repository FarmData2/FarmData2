# FarmData2 Data Model

## Log Categories

- Seeding Logs
  - `seeding_tray`
  - `seeding_direct`
  - `seeding_cover_crop`

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

Logs and assets associated with a tray seeding will be named: `yyyy-mm-dd_ts_cropName`

See `modules/farm_fd2/src/entrypoints/tray_seeding/lib.js` for the details of how the asset, quantities and log are created.

### Direct Seeding

A direct seeding represents the activity and product of planting seeds directly in the ground.

A direct seeding consists of:

- An `asset--plant` representing the seeded plant in the ground.
  - Comments associated with the direct seeding are stored in the `asset--plant` asset.
- A `log--seeding` representing the seeding activity with three `quantity--standard` records with the labels:
  - `Bed Feet`: the number of bed feet that were seeded with units of 'FEET'
  - `Rows/Bed`: the number of rows in the bed that was seeded with units of `ROWS/BED'
  - `Bed/Width`: the width of the bed that was seeded with units `INCHES`
- A `log--activity` representing the soil disturbance associated with the direct seeding with:
  - the log `category` set to `tillage`
  - `equipment` relationships for all of the equipment used.
  - Two `quantity--standard` records with the labels:
    - `Depth`: the depth of the soil disturbed with units of `INCHES`
    - `Speed`: the rate at which the soil was disturbed with units of `MPH`

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
