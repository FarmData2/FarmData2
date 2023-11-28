import * as farmosUtil from './farmosUtil.js';

describe('Test the creation of plant assets', () => {
  var farm = null;
  var cropMap = null;

  before(() => {
    cy.wrap(
      farmosUtil
        .getFarmOSInstance('http://farmos', 'farm', 'admin', 'admin')
        .then((newFarm) => {
          farm = newFarm;
        })
    );

    cy.wrap(
      farmosUtil.getCropNameToTermMap().then((map) => {
        cropMap = map;
      })
    );
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('creates an asset--plant', () => {
    cy.wrap(
      farmosUtil
        .createPlantAsset('testPlant', 'active', 'BROCCOLI')
        .then((result) => {
          expect(result.id).not.to.be.null;
          expect(result.type).to.equal('asset--plant');
          expect(result.attributes.name).to.equal('testPlant');
          expect(result.attributes.status).to.equal('active');
          expect(result.relationships.plant_type[0].type).to.equal(
            'taxonomy_term--plant_type'
          );
          expect(result.relationships.plant_type[0].id).to.equal(
            cropMap.get('BROCCOLI').id
          );

          return result.id;
        })
    ).then((id) => {
      cy.wrap(farm.asset.delete('plant', id));
    });
  });

  it('creates a plant--asset with additional opts', () => {
    cy.wrap(
      farmosUtil
        .createPlantAsset('testPlant', 'active', 'BROCCOLI', {
          notes: 'test note',
          data: 'test data',
        })
        .then((result) => {
          expect(result.id).not.to.be.null;
          expect(result.type).to.equal('asset--plant');
          expect(result.attributes.name).to.equal('testPlant');
          expect(result.attributes.status).to.equal('active');
          expect(result.relationships.plant_type[0].type).to.equal(
            'taxonomy_term--plant_type'
          );
          expect(result.relationships.plant_type[0].id).to.equal(
            cropMap.get('BROCCOLI').id
          );

          expect(result.attributes.notes.value).to.equal('test note');
          expect(result.attributes.data).to.equal('test data');

          return result.id;
        })
    ).then((id) => {
      cy.wrap(farm.asset.delete('plant', id));
    });
  });

  it('throws error if no assetName is provided', () => {
    cy.wrap(
      farmosUtil
        .createPlantAsset(null, 'active', 'BROCCOLI')
        .then(() => {
          throw Error('Should throw error if assetName is not provided.');
        })
        .catch((err) => {
          expect(err.message).to.equal('assetName is required.');
        })
    );
  });

  it('throws error if an unknown status is provided', () => {
    cy.wrap(
      farmosUtil
        .createPlantAsset('testPlant', 'unknownStatus', 'BROCCOLI')
        .then(() => {
          throw Error('Should throw error if a valid status is not provided.');
        })
        .catch((err) => {
          expect(err.message).to.equal(
            'status is unknownStatus but must be one of [ "active" | "archived" ].'
          );
        })
    );
  });

  it('throws error if an unknown cropName is provided', () => {
    cy.wrap(
      farmosUtil
        .createPlantAsset('testPlant', 'active', 'NO_SUCH_CROP')
        .then(() => {
          throw Error('Should throw error if cropName is unknown.');
        })
        .catch((err) => {
          expect(err.message).to.equal(
            'Unable to find crop with name NO_SUCH_CROP.'
          );
        })
    );
  });

  it('throws error on invalid property in additional opts', () => {
    cy.wrap(
      farmosUtil
        .createPlantAsset('testPlant', 'active', 'BROCCOLI', {
          parent: 'abc',
        })
        .then(() => {
          throw Error(
            'Should throw error when opts contains invalid property name.'
          );
        })
        .catch((err) => {
          expect(err.message).to.equal('Unable to create plant asset.');
          expect(err.cause).not.to.be.null;
        })
    );
  });

  it('throws error on network error', () => {
    cy.intercept('POST', '**/api/asset/*', {
      // Note: forceNetworkError allows request to be sent and the
      // asset is created.  So need to stub this response instead.
      statusCode: 500,
      body: 'bad request',
    });

    cy.wrap(
      farmosUtil
        .createPlantAsset('testPlant', 'active', 'BROCCOLI')
        .then(() => {
          throw Error('Should throw error on network failure.');
        })
        .catch((err) => {
          expect(err.message).to.equal('Unable to create plant asset.');
          expect(err.cause).not.to.be.null;
        })
    );
  });
});
