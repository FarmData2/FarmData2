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

  it('Create a plant asset with parents', () => {
    cy.wrap(farmosUtil.createPlantAsset('p1', 'ARUGULA', 'p1')).as('p1');
    cy.wrap(farmosUtil.createPlantAsset('p2', 'ARUGULA', 'p2')).as('p2');
    cy.wrap(farmosUtil.createPlantAsset('p3', 'ARUGULA', 'p3')).as('p3');

    cy.getAll(['@p1', '@p2', '@p3']).then(([p1, p2, p3]) => {
      cy.wrap(
        farmosUtil.createPlantAsset('child', 'ARUGULA', 'child', [p1, p2, p3])
      ).as('plant');
    });

    cy.getAll(['@plant', '@p1', '@p2', '@p3']).then(([plant, p1, p2, p3]) => {
      expect(plant.attributes.name).to.equal('child');
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
