import * as farmosUtil from './farmosUtil';

describe('Test the plant asset functions', () => {
  let cropMap = null;

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(farmosUtil.getCropNameToTermMap()).then((map) => {
      cropMap = map;
    });
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Create a plant asset', () => {
    cy.wrap(farmosUtil.createPlantAsset('1999-01-03', 'ARUGULA', 'testComment'))
      .then((plantAsset) => {
        cy.wrap(farmosUtil.getPlantAsset(plantAsset.id));
      })
      .then((result) => {
        expect(result.attributes.name).to.equal('1999-01-03_ARUGULA');
        expect(result.attributes.status).to.equal('active');
        expect(result.attributes.notes.value).to.equal('testComment');
        expect(result.relationships.plant_type[0].id).to.equal(
          cropMap.get('ARUGULA').id
        );
      });
  });

  it('Create a plant asset with parents', () => {
    cy.wrap(farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'p1')).as(
      'p1'
    );
    cy.wrap(farmosUtil.createPlantAsset('1999-01-03', 'ARUGULA', 'p2')).as(
      'p2'
    );
    cy.wrap(farmosUtil.createPlantAsset('1999-01-04', 'ARUGULA', 'p3')).as(
      'p3'
    );

    cy.getAll(['@p1', '@p2', '@p3']).then(([p1, p2, p3]) => {
      cy.wrap(
        farmosUtil.createPlantAsset('1999-01-05', 'ARUGULA', 'child', [
          p1,
          p2,
          p3,
        ])
      ).as('plant');
    });

    cy.getAll(['@plant', '@p1', '@p2', '@p3']).then(([plant, p1, p2, p3]) => {
      expect(plant.attributes.name).to.equal('1999-01-05_ARUGULA');
      expect(plant.attributes.status).to.equal('active');
      expect(plant.attributes.notes.value).to.equal('child');
      expect(plant.relationships.plant_type[0].id).to.equal(
        cropMap.get('ARUGULA').id
      );
      expect(plant.relationships.parent).to.have.length(3);
      expect(plant.relationships.parent[0].id).to.equal(p1.id);
      expect(plant.relationships.parent[1].id).to.equal(p2.id);
      expect(plant.relationships.parent[2].id).to.equal(p3.id);
    });
  });

  it('Create a plant asset with multiple crop names', () => {
    const cropNames = ['ARUGULA', 'LETTUCE'];
    cy.wrap(farmosUtil.createPlantAsset('1999-01-03', cropNames, 'testComment'))
      .then((plantAsset) => {
        cy.wrap(farmosUtil.getPlantAsset(plantAsset.id));
      })
      .then((result) => {
        expect(result.attributes.name).to.equal('1999-01-03_ARUGULA_LETTUCE');
        expect(result.attributes.status).to.equal('active');
        expect(result.attributes.notes.value).to.equal('testComment');
        cropNames.forEach((cropName, index) => {
          expect(result.relationships.plant_type[index].id).to.equal(
            cropMap.get(cropName).id
          );
        });
      });
  });

  it('Error creating plant asset', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/asset/plant', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil
        .createPlantAsset('1999-01-02', 'ARUGULA', 'testComment')
        .then(() => {
          throw new Error('Creating plant asset should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });

  it('Delete a plant asset', () => {
    cy.wrap(
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testComment')
    ).then((plantAsset) => {
      cy.wrap(farmosUtil.deletePlantAsset(plantAsset.id)).then((result) => {
        expect(result.status).to.equal(204);
      });
    });
  });

  it('Error deleting plant asset', { retries: 4 }, () => {
    cy.intercept('DELETE', '**/api/asset/plant/*', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil
        .deletePlantAsset('1234')
        .then(() => {
          throw new Error('Deleting plant asset should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });

  it('Archive/Unarchive a plant asset', () => {
    cy.wrap(farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'p1')).as(
      'p1'
    );

    cy.get('@p1').then((p1) => {
      expect(p1.attributes.name).to.equal('1999-01-02_ARUGULA');
      expect(p1.attributes.status).to.equal('active');

      cy.wrap(farmosUtil.archivePlantAsset(p1.id, true)).as('archived');
    });

    cy.get('@archived').then((archived) => {
      cy.wrap(farmosUtil.getPlantAsset(archived.id)).as('p1-archived');
    });

    cy.get('@p1-archived').then((p1Archived) => {
      expect(p1Archived.attributes.name).to.equal('1999-01-02_ARUGULA');
      expect(p1Archived.attributes.status).to.equal('archived');

      cy.wrap(farmosUtil.archivePlantAsset(p1Archived.id), false).as(
        'unArchived'
      );
    });

    cy.get('@unArchived').then((unArchived) => {
      cy.wrap(farmosUtil.getPlantAsset(unArchived.id)).as('p1-unArchived');
    });

    cy.get('@p1-unArchived').then((p1unArchived) => {
      expect(p1unArchived.attributes.name).to.equal('1999-01-02_ARUGULA');
      expect(p1unArchived.attributes.status).to.equal('active');
    });
  });

  it('check getPlantAssets contents w/o beds', () => {
    const locationName = 'A';

    cy.wrap(farmosUtil.getPlantAssets(locationName)).then((plantAssets) => {
      expect(plantAssets).to.have.length(5);

      plantAssets.forEach((plantAsset) => {
        expect(plantAsset.location).to.equal('A');
      });

      expect(plantAssets[3].crop[0]).to.equal('LETTUCE-MES MIX');
      expect(plantAssets[3].created_by).to.have.length(2);
      expect(plantAssets[3].created_by[0]).to.equal('seeding');
      expect(plantAssets[3].created_by[1]).to.equal('seeding_direct');
      expect(plantAssets[3].timestamp).to.equal('2019-05-07');
      expect(plantAssets[3].location).to.equal('A');
      expect(plantAssets[3].beds).to.have.length(0);

      expect(plantAssets[4].crop[0]).to.equal('BROCCOLI');
      expect(plantAssets[4].created_by).to.have.length(1);
      expect(plantAssets[4].created_by[0]).to.equal('transplanting');
      expect(plantAssets[4].timestamp).to.equal('2019-07-17');
      expect(plantAssets[4].location).to.equal('A');
      expect(plantAssets[4].beds).to.have.length(0);
    });
  });

  // it('Check crops are split into array', () => {
  // Currently sample DB has no cover crops.
  // });

  it('Check beds are split into array', () => {
    cy.wrap(farmosUtil.getPlantAssets('ALF', [], false, true)).then(
      (plantAssets) => {
        expect(plantAssets).to.have.length(2);
        expect(plantAssets[0].beds).to.have.length(1);
        expect(plantAssets[0].beds[0]).to.equal('ALF-1');
        expect(plantAssets[1].beds).to.have.length(2);
        expect(plantAssets[1].beds[0]).to.equal('ALF-1');
        expect(plantAssets[1].beds[1]).to.equal('ALF-2');
      }
    );
  });

  it('Check that only active plant assets are fetched', () => {
    // CHUAU contains one archived plant asset in sample db.
    const locationName = 'CHUAU';

    cy.wrap(farmosUtil.getPlantAssets(locationName)).then((plantAssets) => {
      expect(plantAssets).to.have.length(18);
      plantAssets.forEach((plantAsset) => {
        cy.wrap(farmosUtil.getPlantAsset(plantAsset.uuid)).then((asset) => {
          expect(asset.attributes.status).to.equal('active');
        });
      });
    });
  });

  it('Get plant assets for a specific field and bed', () => {
    const locationName = 'CHUAU';
    const checkedBeds = ['CHUAU-1', 'CHUAU-2'];

    cy.wrap(farmosUtil.getPlantAssets(locationName, checkedBeds)).then(
      (plantAssets) => {
        expect(plantAssets).to.have.length(4);

        plantAssets.forEach((plantAsset) => {
          const inChuau1 = plantAsset.beds.includes('CHUAU-1');
          const inChuau2 = plantAsset.beds.includes('CHUAU-2');
          expect(inChuau1 || inChuau2).to.equal(true);
        });
      }
    );
  });

  it('Get plant assets in trays only', () => {
    cy.wrap(farmosUtil.getPlantAssets('CHUAU', [], true, false)).then(
      (plantAssets) => {
        expect(plantAssets).to.have.length(12);
        plantAssets.forEach((plantAsset) => {
          expect(plantAsset.location).to.equal('CHUAU');

          cy.wrap(farmosUtil.getPlantAsset(plantAsset.uuid)).then((asset) => {
            const trays = farmosUtil.getAssetInventory(asset, 'count', 'TRAYS');
            expect(trays).not.to.be.null;
          });
        });
      }
    );
  });

  it('Get plant assets in ground only', () => {
    cy.wrap(farmosUtil.getPlantAssets('CHUAU', [], false, true)).then(
      (plantAssets) => {
        expect(plantAssets).to.have.length(6);
        plantAssets.forEach((plantAsset) => {
          expect(plantAsset.location).to.equal('CHUAU');

          cy.wrap(farmosUtil.getPlantAsset(plantAsset.uuid)).then((asset) => {
            const trays = farmosUtil.getAssetInventory(asset, 'count', 'TRAYS');
            expect(trays).to.be.null;
          });
        });
      }
    );
  });

  it('Get plant assets with both inTrays and inGround set to false', () => {
    const locationName = 'CHUAU';

    cy.wrap(farmosUtil.getPlantAssets(locationName, [], false, false)).then(
      (plantAssetIds) => {
        expect(plantAssetIds).to.be.an('array').that.is.empty;
      }
    );
  });

  it('Get plant assets with no matching field asset', () => {
    const locationName = 'NonExistentField';

    cy.wrap(farmosUtil.getPlantAssets(locationName)).then((plantAssetIds) => {
      expect(plantAssetIds).to.be.an('array').that.is.empty;
    });
  });

  it('Get plant assets with no matching beds', () => {
    const locationName = 'CHUAU';
    const checkedBeds = ['NonExistentBed1', 'NonExistentBed2'];

    cy.wrap(farmosUtil.getPlantAssets(locationName, checkedBeds)).then(
      (plantAssetIds) => {
        expect(plantAssetIds).to.be.an('array').that.is.empty;
      }
    );
  });
});
