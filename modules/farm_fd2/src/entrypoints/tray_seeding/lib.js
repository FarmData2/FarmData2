import * as farmosUtil from '@libs/farmosUtil/farmosUtil';
import dayjs from 'dayjs';

/**
 * Create the farmOS records (asset, quantities and log) to represent
 * a tray seeding.
 *
 * @param {Object} formData the form data from the tray seeding form.
 * @returns {Promise} a promise that resolves when the records are successfully created.
 * The returned value is an object containing the asset, quantities and log that
 * were sent to the server.  This object has the following properties:
 * {
 *   plantAsset: {asset--plant},
 *   traysQuantity: {quantity--standard},
 *   traySizeQuantity: {quantity--standard},
 *   seedsQuantity: {quantity--standard},
 *   seedingLog: {log--seeding}
 * }
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {
  let plantAsset = null;
  let traysQuantity = null;
  let traySizeQuantity = null;
  let seedsQuantity = null;
  let seedingLog = null;

  try {
    plantAsset = await createPlantAsset(formData);
    traysQuantity = await createTraysQuantity(formData, plantAsset);
    traySizeQuantity = await createTraySizeQuantity(formData);
    seedsQuantity = await createSeedsQuantity(formData);
    seedingLog = await createSeedingLog(
      formData,
      plantAsset,
      traysQuantity,
      traySizeQuantity,
      seedsQuantity
    );

    return {
      plantAsset: plantAsset,
      traysQuantity: traysQuantity,
      traySizeQuantity: traySizeQuantity,
      seedsQuantity: seedsQuantity,
      seedingLog: seedingLog,
    };
  } catch (error) {
    console.log('TraySeeding: \n' + error.message);
    console.dir(error);

    // Handle errors here by deleting any records that were created.
    if (seedingLog) {
      try {
        await farmosUtil
          .getFarmOSInstance()
          .log.delete('seeding', seedingLog.id);
      } catch (error) {
        console.log('TraySeeding: \n');
        console.log('  Unable to delete seeding log with:');
        console.log('    name: ' + seedingLog.name);
        console.log('      id: ' + seedingLog.id);
        console.log(error.message);
        console.dir(error);
      }
    }

    if (seedsQuantity) {
      try {
        await farmosUtil
          .getFarmOSInstance()
          .quantity.delete('standard', seedsQuantity.id);
      } catch (error) {
        console.log('TraySeeding: \n');
        console.log('  Unable to delete Seeds quantity with:');
        console.log('    id: ' + traysQuantity.id);
        console.log(error.message);
        console.dir(error);
      }
    }

    if (traySizeQuantity) {
      try {
        await farmosUtil
          .getFarmOSInstance()
          .quantity.delete('standard', traySizeQuantity.id);
      } catch (error) {
        console.log('TraySeeding: \n');
        console.log('  Unable to delete Tray Size quantity with:');
        console.log('    id: ' + traysQuantity.id);
        console.log(error.message);
        console.dir(error);
      }
    }

    if (traysQuantity) {
      try {
        await farmosUtil
          .getFarmOSInstance()
          .quantity.delete('standard', traysQuantity.id);
      } catch (error) {
        console.log('TraySeeding: \n');
        console.log('  Unable to delete Trays quantity with:');
        console.log('    id: ' + traysQuantity.id);
        console.log(error.message);
        console.dir(error);
      }
    }

    if (plantAsset) {
      try {
        await farmosUtil
          .getFarmOSInstance()
          .asset.delete('plant', plantAsset.id);
      } catch (error) {
        console.log('TraySeeding: \n');
        console.log('  Unable to delete plant asset with:');
        console.log('    name: ' + plantAsset.name);
        console.log('      id: ' + plantAsset.id);
        console.log(error.message);
        console.dir(error);
      }
    }

    throw Error('Error creating tray seeding.', error);
  }
}

/*
 * The functions below are not expected to be called directly from the
 * entry point. They are exported so that they can be unit tested.
 */

export async function createPlantAsset(formData) {
  const farm = await farmosUtil.getFarmOSInstance();
  const cropMap = await farmosUtil.getCropNameToTermMap();

  const assetName = formData.seedingDate + '_ts_' + formData.cropName;

  // create an asset--plant
  const plantAsset = farm.asset.create({
    type: 'asset--plant',
    attributes: {
      name: assetName,
      status: 'active',
      notes: { value: formData.comment },
    },
    relationships: {
      plant_type: [
        {
          type: 'taxonomy_term--plant_type',
          id: cropMap.get(formData.cropName).id,
        },
      ],
    },
  });

  await farm.asset.send(plantAsset);

  return plantAsset;
}

export async function createTraysQuantity(formData, plantAsset) {
  const farm = await farmosUtil.getFarmOSInstance();
  const unitMap = await farmosUtil.getUnitToTermMap();

  // create the necessary quantities
  const traysQuantity = farm.quantity.create({
    type: 'quantity--standard',
    attributes: {
      measure: 'count',
      value: {
        decimal: formData.trays,
      },
      label: 'Trays',
      inventory_adjustment: 'increment',
    },
    relationships: {
      units: {
        type: 'taxonomy_term--unit',
        id: unitMap.get('TRAYS').id,
      },
      inventory_asset: {
        type: 'asset--plant',
        id: plantAsset.id,
      },
    },
  });

  await farm.quantity.send(traysQuantity);

  return traysQuantity;
}

export async function createTraySizeQuantity(formData) {
  const farm = await farmosUtil.getFarmOSInstance();
  const unitMap = await farmosUtil.getUnitToTermMap();

  const traySizeQuantity = farm.quantity.create({
    type: 'quantity--standard',
    attributes: {
      measure: 'ratio',
      value: {
        decimal: parseInt(formData.traySize),
      },
      label: 'Tray Size',
    },
    relationships: {
      units: {
        type: 'taxonomy_term--unit',
        id: unitMap.get('CELLS/TRAY').id,
      },
    },
  });

  await farm.quantity.send(traySizeQuantity);

  return traySizeQuantity;
}

export async function createSeedsQuantity(formData) {
  const farm = await farmosUtil.getFarmOSInstance();
  const unitMap = await farmosUtil.getUnitToTermMap();

  const seedsQuantity = farm.quantity.create({
    type: 'quantity--standard',
    attributes: {
      measure: 'count',
      value: {
        decimal:
          formData.trays * parseInt(formData.traySize) * formData.seedsPerCell,
      },
      label: 'Seeds',
    },
    relationships: {
      units: {
        type: 'taxonomy_term--unit',
        id: unitMap.get('SEEDS').id,
      },
    },
  });

  await farm.quantity.send(seedsQuantity);

  return seedsQuantity;
}

export async function createSeedingLog(
  formData,
  plantAsset,
  traysQuantity,
  traySizeQuantity,
  seedsQuantity
) {
  const farm = await farmosUtil.getFarmOSInstance();
  const categoryMap = await farmosUtil.getLogCategoryToTermMap();
  const greenhouseMap = await farmosUtil.getGreenhouseNameToAssetMap();

  // create the seeding log
  const seedingLog = farm.log.create({
    type: 'log--seeding',
    attributes: {
      name: plantAsset.attributes.name,
      timestamp: dayjs(formData.seedingDate).format(),
      status: 'done',
      is_movement: true,
      purchase_date: dayjs(formData.seedingDate).format(),
    },
    relationships: {
      location: [
        {
          type: 'asset--structure',
          id: greenhouseMap.get(formData.locationName).id,
        },
      ],
      asset: [{ type: 'asset--plant', id: plantAsset.id }],
      category: [
        {
          type: 'taxonomy_term--log_category',
          id: categoryMap.get('seeding_tray').id,
        },
      ],
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
    },
  });

  await farm.log.send(seedingLog);

  return seedingLog;
}
