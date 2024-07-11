import * as farmosUtil from './farmosUtil.js';

describe('Test the field utility functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Get the field land assets', () => {
    cy.wrap(farmosUtil.getFields()).then((fields) => {
      expect(fields).to.not.be.null;
      expect(fields.length).to.equal(9);

      expect(fields[0].attributes.name).to.equal('A');
      expect(fields[0].type).to.equal('asset--land');

      expect(fields[8].attributes.name).to.equal('H');
      expect(fields[8].type).to.equal('asset--land');
    });
  });

  it('Check that fields are cached', () => {
    cy.wrap(farmosUtil.getFields()).then(() => {
      expect(farmosUtil.getFromGlobalVariableCache('fields')).to.not.be.null;
      expect(sessionStorage.getItem('fields')).to.not.be.null;
    });
  });

  it('Get fields throws error if fetch fails', { retries: 4 }, () => {
    farmosUtil.clearCachedFields();

    cy.intercept('GET', '**/api/asset/land?*', {
      forceNetworkError: true,
    });

    cy.wrap(
      farmosUtil
        .getFields()
        .then(() => {
          throw new Error('Fetching fields should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Unable to fetch fields.');
        })
    );
  });

  it('Get the FieldNameToAsset map', () => {
    cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((fieldNameMap) => {
      expect(fieldNameMap).to.not.be.null;
      expect(fieldNameMap.size).to.equal(9);

      expect(fieldNameMap.get('A')).to.not.be.null;
      expect(fieldNameMap.get('A').type).to.equal('asset--land');

      expect(fieldNameMap.get('G')).to.not.be.null;
      expect(fieldNameMap.get('G').type).to.equal('asset--land');

      expect(fieldNameMap.get('CHUAU')).to.be.undefined;
    });
  });

  it('Get the FieldIdToAsset map', () => {
    cy.wrap(farmosUtil.getFieldIdToAssetMap()).then((fieldIdMap) => {
      expect(fieldIdMap).to.not.be.null;
      expect(fieldIdMap.size).to.equal(9);

      cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((fieldNameMap) => {
        const fieldAId = fieldNameMap.get('A').id;
        expect(fieldIdMap.get(fieldAId).attributes.name).to.equal('A');
        expect(fieldIdMap.get(fieldAId).type).to.equal('asset--land');

        const fieldGId = fieldNameMap.get('G').id;
        expect(fieldIdMap.get(fieldGId).attributes.name).to.equal('G');
        expect(fieldIdMap.get(fieldGId).type).to.equal('asset--land');
      });
    });
  });

  it('Check empty fields in sample database', () => {
    // These fields should be empty in the sample database because other tests rely on them

    cy.wrap(farmosUtil.getPlantAssets('H')).then((plantAssets) => {
      expect(plantAssets).to.have.length(0);
    });
  });
});
