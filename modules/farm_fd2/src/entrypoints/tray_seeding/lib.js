import * as farmosUtil from '@libs/farmosUtil/farmosUtil';
import dayjs from 'dayjs';

/**
 * Create the farmOS records (asset, quantities and log) to represent
 * a tray seeding.
 *
 * @param {Object} formData the form data from the tray seeding form.
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {
  let plantAsset = null;
  let traysQuantity = null;
  let traySizeQuantity = null;
  let seedsQuantity = null;
  let seedingLog = null;

  try {
    const farm = await farmosUtil.getFarmOSInstance();
    const cropMap = await farmosUtil.getCropNameToTermMap();
    const unitMap = await farmosUtil.getUnitToTermMap();
    const categoryMap = await farmosUtil.getLogCategoryToTermMap();
    const greenhouseMap = await farmosUtil.getGreenhouseNameToAssetMap();

    const assetName = formData.seedingDate + '_ts_' + formData.cropName;

    // create an asset--plant
    const plantProps = farm.asset.create({
      type: 'asset--plant',
      name: assetName,
      status: 'active',
      notes: { value: formData.comment },
      plant_type: [
        {
          type: 'taxonomy_term--plant_type',
          id: cropMap.get(formData.cropName).id,
        },
      ],
    });

    plantAsset = await farm.asset.send(plantProps);

    // create the necessary quantities
    const traysQuantityProps = farm.quantity.create({
      type: 'quantity--standard',
      label: 'Trays',
      measure: 'count',
      value: {
        decimal: formData.trays,
      },
      inventory_adjustment: 'increment',
      units: {
        type: 'taxonomy_term--unit',
        id: unitMap.get('TRAYS').id,
      },
      inventory_asset: {
        type: 'asset--plant',
        id: plantAsset.id,
      },
    });
    traysQuantity = await farm.quantity.send(traysQuantityProps);

    const traySizeQuantityProps = farm.quantity.create({
      type: 'quantity--standard',
      label: 'Tray Size',
      measure: 'ratio',
      value: {
        decimal: parseInt(formData.traySize),
      },
      units: {
        type: 'taxonomy_term--unit',
        id: unitMap.get('CELLS/TRAY').id,
      },
    });
    traySizeQuantity = await farm.quantity.send(traySizeQuantityProps);

    const seedsQuantityProps = farm.quantity.create({
      type: 'quantity--standard',
      label: 'Seeds',
      measure: 'count',
      value: {
        decimal:
          formData.trays *
          parseInt(formData.traySize) *
          formData.seedsPerCell,
      },
      units: {
        type: 'taxonomy_term--unit',
        id: unitMap.get('SEEDS').id,
      },
    });
    seedsQuantity = await farm.quantity.send(seedsQuantityProps);

    // create the seeding log
    const seedingLogProps = farm.log.create({
      type: 'log--seeding',
      timestamp: dayjs(formData.seedingDate).format(),
      purchase_date: '0000-00-00',
      category: [
        {
          type: 'taxonomy_term--log_category',
          id: categoryMap.get('seeding_tray').id,
        },
      ],
      name: assetName,
      status: 'done',
      is_movement: true,
      location: [
        {
          type: 'asset--structure',
          id: greenhouseMap.get(formData.locationName).id,
        },
      ],
      asset: [{ type: 'asset--plant', id: plantAsset.id }],
      quantity: [
        {
          type: 'quantity--standard',
          id: traysQuantity.id,
        },
        {
          type: 'quantity--standard',
          id: traySizeQuantity.id,
        },
        {
          type: 'quantity--standard',
          id: seedsQuantity.id,
        },
      ],
    });

    seedingLog = await farm.log.send(seedingLogProps);
  } catch (error) {
    console.log('TraySeeding: \n' + error.message);
    console.dir(error);

    // Handle errors here by trying to delete everything?

    throw Error('Error creating tray seeding', error);
  }
}
