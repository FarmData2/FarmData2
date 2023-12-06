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
- Three `quantity--standard` records representing:

  - The number of trays that were seeded. This quantity sets the plant asset's inventory.
  - The number of cells in each tray.
  - The number of seeds planted in each cell.

- Logs and assets associated with a tray seeding will be named: `yyyy-mm-dd_ts_cropName`

See `modules/farm_fd2/src/entrypoints/tray_seeding/lib.js` for the details of how the asset, quantities and log are created.

A tray seeding is represented by a `asset--plant` asset.

- The asset's inventory represents the number of trays that are available for transplanting. Initially this will equal the number of trays that have been seeded. As trays are transplanted (or composted or discarded) the inventory will be decremented.
- The asset will be referenced by a `log--seeding` with a `log-type` of `tray_seeding`.

- Creates

  - A _Plant Asset_:

  ```JavaScript
  {
    name: '???',
    status: 'active',
    inventory: [ '** Trays will be managed by Inventory **' ]
    relationships: {
      plant_type: [ { type: 'taxonomy_term--plant_type', id: '** Plant Type ID **}' ]
    }
  }
  ```

  - A _Seeding Log_:

  ```JavaScript
  {
    attributes: {
      name: '???',
      status: 'done',
      notes: '** Comment **',
      is_movement: true,
    },
    relationships: {
      location: [ { type: 'asset--structure', id: '** Greenhouse ID **'} ],
      asset: [ { type: 'asset--plant', id: '** Plant Asset ID **'} ],
      category: [ { type: 'taxonomy_term--log_category', id: '** Log Category ID **' } ],
      quantity: [
        {
          attributes: {
            measure: 'count',
            value: {
              decimal: '** Trays **',
            },
            label: 'Trays',
            inventory_adjustment: 'increment'
          },
          relationships: {
            units: {
              type: 'taxonomy_term--unit',
              id: '** Trays Unit ID **'
            },
            inventory_asset: {
              type: 'asset--plant',
              id: '** Plant Asset ID **'
            }
          }
        },
        {
          attributes: {
            measure: 'ratio',
            value: {
              decimal: '** Tray Size **',
            },
            label: 'Cells/Tray',
          },
          relationships: {
            units: { type: 'taxonomy_term--unit', id: '** CELLS/TRAY ID **' },
          }
        },
        {
          attributes: {
            measure: 'ratio',
            value: {
              decimal: '** Seeds/Cell **',
            },
            label: 'Seeds/Cell',
          },
          relationships: {
            units: { type: 'taxonomy_term--unit', id: '** SEEDS/CELL ID **' },
          }
        }
      ]
    }
  }
  ```

### Direct Seeding

- Keep row/feet as inventory on the planting.

### Cover Crop Seeding

## Transplanting

- Decrease Trays inventory on the planting and create new in ground planting for each transplant operation.

NOTE: There is no transplant log type.

- Possibly just use an Activity log with a transplanting log category?

## Harvesting

- Decrease row/feed inventory on the in ground planting.

## Soil Disturbance
