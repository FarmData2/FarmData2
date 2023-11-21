# FarmData2 Data Model

## Log Categories

- Seeding Logs
  - `tray_seeding`
  - `direct_seeding`
  - `cover_crop_seeding`

## Units

## Naming Conventions

- check the PASA schema to see if there is a convention.

### Assets

### Logs

### Quantities

## Seeding Operations

### Tray Seeding

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
            units: { type: 'taxonomy_term--unit', id: '** Trays Unit ID **' },
            inventory_asset: { type: 'asset--plant', id: '** Plant Asset ID **' }
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
