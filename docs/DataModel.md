# FarmData2 Data Model

## Log Categories

- Seeding Logs
  - `seeding_tray`
  - `seeding_direct`
  - `seeding_cover_crop`

## Units

## Log/Asset Naming Conventions

The general convention for naming logs and assets is:

- `yyyy-mm-dd_<type>_<description>`
  - `<type>` is an abbreviation for the type of operation
    - `ts` - tray seeding
    - `ds` - direct seeding
    - `cs` - cover crop seeding
    - `xp` - transplanting
    - `ha` - harvesting
    - `sd` - soil disturbance
    - `sa` - soil amendment

### Assets

### Logs

### Quantities

## Seeding Operations

### Tray Seeding

A tray seeding represents the activity and product of planting seeds in trays in a greenhouse.

A tray seeding consists of:

- A `asset--plant` representing the seeded plant in the greenhouse.
  - The `Inventory` of this asset represents the number of trays currently available for transplanting and is managed by quantities attached to logs via the farmOS Inventory module.
  - Comments associated with the tray seeding are stored in the `asset--plant` asset.
- A `log--seeding` representing the seeding activity.
- Three `quantity--standard` records with the labels:

  - `Trays`: The number of trays that were seeded. This quantity sets the plant asset's inventory.
  - `Tray Size`:The number of cells in each tray.
  - `Seeds`:The total number of seeds planted. Note: This is computed from the other data entered in the form (trays x cells per tray x seeds per cell).

- Logs and assets associated with a tray seeding will be named: `yyyy-mm-dd_ts_cropName`

See `modules/farm_fd2/src/entrypoints/tray_seeding/lib.js` for the details of how the asset, quantities and log are created.

### Direct Seeding

- Keep row/feet as inventory on the planting.

### Cover Crop Seeding

## Transplanting

- Decrease Trays inventory on the planting and create new in ground planting for each transplant operation.

NOTE: There is no transplant log type.

- Possibly just use an some type of log with a transplanting log category?

## Harvesting

- Decrease row/feed inventory on the in ground planting.

## Soil Disturbance
