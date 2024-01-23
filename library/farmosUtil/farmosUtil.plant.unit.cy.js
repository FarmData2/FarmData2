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
    cy.wrap(farmosUtil.createPlantAsset('testPlant', 'ARUGULA', 'testComment'))
      .then((plantAsset) => {
        cy.wrap(farmosUtil.getPlantAsset(plantAsset.id));
      })
      .then((result) => {
        expect(result.attributes.name).to.equal('testPlant');
        expect(result.attributes.status).to.equal('active');
        expect(result.attributes.notes.value).to.equal('testComment');
        expect(result.relationships.plant_type[0].id).to.equal(
          cropMap.get('ARUGULA').id
        );
      });
  });

  it('Error creating plant asset', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/asset/plant', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil
        .createPlantAsset('testPlant', 'ARUGULA', 'testComment')
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
      farmosUtil.createPlantAsset('testPlant', 'ARUGULA', 'testComment')
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
});
