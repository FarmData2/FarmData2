import * as farmosUtil from './farmosUtil.js';

describe('Test the equipment utility functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Get the equipment', () => {
    cy.wrap(farmosUtil.getEquipment()).then((equipment) => {
      expect(equipment).to.not.be.null;
      expect(equipment.length).to.equal(17);

      // Garden Rake - no category
      expect(equipment[8].attributes.name).to.equal('Rake');
      expect(equipment[8].attributes.notes.value).to.equal('A garden rake.');
      expect(equipment[8].type).to.equal('asset--equipment');
      expect(equipment[8].relationships.parent).to.have.length(0);

      // Shovel - no category - no info.
      expect(equipment[12].attributes.name).to.equal('Shovel');
      expect(equipment[12].attributes.notes).to.be.null;
      expect(equipment[12].type).to.equal('asset--equipment');
      expect(equipment[12].relationships.parent).to.have.length(0);

      // Category
      expect(equipment[1].attributes.name).to.equal('Category');
      expect(equipment[1].attributes.notes.value).to.equal(
        'Parent of all categories'
      );
      expect(equipment[1].type).to.equal('asset--equipment');
      expect(equipment[1].relationships.parent).to.have.length(0);

      // General - has Category as parent.
      expect(equipment[4].attributes.name).to.equal('General');
      expect(equipment[4].attributes.notes.value).to.equal(
        'Equipment used for a variety of operations.'
      );
      expect(equipment[4].type).to.equal('asset--equipment');
      expect(equipment[4].relationships.parent).to.have.length(1);
      expect(equipment[4].relationships.parent[0].id).to.equal(equipment[1].id);

      // Tractor - has General as parent
      expect(equipment[16].attributes.name).to.equal('Tractor');
      expect(equipment[16].attributes.notes.value).to.equal(
        'A standard tractor.'
      );
      expect(equipment[16].type).to.equal('asset--equipment');
      expect(equipment[16].relationships.parent[0].id).to.equal(
        equipment[4].id
      );
    });
  });

  it('Check that equipment is cached', () => {
    cy.wrap(farmosUtil.getEquipment()).then(() => {
      expect(farmosUtil.getFromGlobalVariableCache('equipment')).to.not.be.null;
      expect(sessionStorage.getItem('equipment')).to.not.be.null;
    });
  });

  it(
    'Test that get equipment throws error if fetch fails',
    { retries: 4 },
    () => {
      farmosUtil.clearCachedEquipment();

      cy.intercept('GET', '**/api/asset/equipment?*', {
        forceNetworkError: true,
      });

      cy.wrap(
        farmosUtil
          .getEquipment()
          .then(() => {
            throw new Error('Fetching equipment should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.equal('Unable to fetch equipment.');
          })
      );
    }
  );

  it('Get the equipmentNameToTerm map for all categories', () => {
    cy.wrap(farmosUtil.getEquipmentNameToAssetMap()).then((equipmentMap) => {
      expect(equipmentMap).to.not.be.null;
      expect(equipmentMap.size).to.equal(13); // Note: Categories are excluded

      expect(equipmentMap.get('Rake')).to.not.be.undefined;
      expect(equipmentMap.get('Rake').type).to.equal('asset--equipment');

      expect(equipmentMap.get('Shovel')).to.not.be.undefined;
      expect(equipmentMap.get('Shovel').type).to.equal('asset--equipment');

      expect(equipmentMap.get('Tractor')).to.not.be.undefined;
      expect(equipmentMap.get('Tractor').type).to.equal('asset--equipment');

      expect(equipmentMap.get('Seeding Drill')).to.not.be.undefined;
      expect(equipmentMap.get('Seeding Drill').type).to.equal(
        'asset--equipment'
      );

      expect(equipmentMap.get('Category')).to.be.undefined;
      expect(equipmentMap.get('General')).to.be.undefined;
    });
  });

  it('Get the equipmentNameToTerm map for a specific category', () => {
    cy.wrap(farmosUtil.getEquipmentNameToAssetMap(['General'])).then(
      (equipmentMap) => {
        expect(equipmentMap).to.not.be.null;
        expect(equipmentMap.size).to.equal(2);

        expect(equipmentMap.get('Tractor')).to.not.be.undefined;
        expect(equipmentMap.get('Tractor').type).to.equal('asset--equipment');

        expect(equipmentMap.get('Small Tractor')).to.not.be.undefined;
        expect(equipmentMap.get('Small Tractor').type).to.equal(
          'asset--equipment'
        );

        expect(equipmentMap.get('Seeding Drill')).to.be.undefined;
        expect(equipmentMap.get('Rake')).to.be.undefined;
        expect(equipmentMap.get('Shovel')).to.be.undefined;
      }
    );
  });

  it('Get the equipmentNameToTerm map for a specific categories', () => {
    cy.wrap(farmosUtil.getEquipmentNameToAssetMap(['General', 'Seeding'])).then(
      (equipmentMap) => {
        expect(equipmentMap).to.not.be.null;
        expect(equipmentMap.size).to.equal(6);

        expect(equipmentMap.get('Tractor')).to.not.be.undefined;
        expect(equipmentMap.get('Tractor').type).to.equal('asset--equipment');

        expect(equipmentMap.get('Small Tractor')).to.not.be.undefined;
        expect(equipmentMap.get('Small Tractor').type).to.equal(
          'asset--equipment'
        );

        expect(equipmentMap.get('Seeding Drill')).to.not.be.undefined;
        expect(equipmentMap.get('Seeding Drill').type).to.equal(
          'asset--equipment'
        );

        expect(equipmentMap.get('Planter')).to.not.be.undefined;
        expect(equipmentMap.get('Planter').type).to.equal('asset--equipment');

        expect(equipmentMap.get('Rake')).to.be.undefined;
        expect(equipmentMap.get('Shovel')).to.be.undefined;
      }
    );
  });

  it('Get the EquipmentIdToAsset map for all equipment', () => {
    cy.wrap(farmosUtil.getEquipmentNameToAssetMap()).then(
      (equipmentNameMap) => {
        expect(equipmentNameMap).to.not.be.null;
        expect(equipmentNameMap.size).to.equal(13);

        cy.wrap(farmosUtil.getEquipmentIdToAssetMap()).then(
          (equipmentIdMap) => {
            const tractorId = equipmentNameMap.get('Tractor').id;
            expect(equipmentIdMap.get(tractorId).attributes.name).to.equal(
              'Tractor'
            );
            expect(equipmentIdMap.get(tractorId).type).to.equal(
              'asset--equipment'
            );

            const drillId = equipmentNameMap.get('Seeding Drill').id;
            expect(equipmentIdMap.get(drillId).attributes.name).to.equal(
              'Seeding Drill'
            );
            expect(equipmentIdMap.get(drillId).type).to.equal(
              'asset--equipment'
            );

            const rakeId = equipmentNameMap.get('Rake').id;
            expect(equipmentIdMap.get(rakeId).attributes.name).to.equal('Rake');
            expect(equipmentIdMap.get(rakeId).type).to.equal(
              'asset--equipment'
            );

            const shovelId = equipmentNameMap.get('Shovel').id;
            expect(equipmentIdMap.get(shovelId).attributes.name).to.equal(
              'Shovel'
            );
            expect(equipmentIdMap.get(shovelId).type).to.equal(
              'asset--equipment'
            );

            expect(equipmentNameMap.get('Category')).to.be.undefined;
            expect(equipmentNameMap.get('Seeding')).to.be.undefined;
          }
        );
      }
    );
  });

  it('Get the EquipmentIdToAsset map for a specific category', () => {
    cy.wrap(farmosUtil.getEquipmentNameToAssetMap()).then(
      (equipmentNameMap) => {
        expect(equipmentNameMap).to.not.be.null;
        expect(equipmentNameMap.size).to.equal(13);

        cy.wrap(farmosUtil.getEquipmentIdToAssetMap(['General'])).then(
          (equipmentIdMap) => {
            expect(equipmentIdMap).to.not.be.null;
            expect(equipmentIdMap.size).to.equal(2);

            const tractorId = equipmentNameMap.get('Tractor').id;
            expect(equipmentIdMap.get(tractorId)).to.not.be.null;
            expect(equipmentIdMap.get(tractorId).type).to.equal(
              'asset--equipment'
            );

            expect(equipmentIdMap.get(equipmentNameMap.get('Seeding Drill'))).to
              .be.undefined;
            expect(equipmentIdMap.get(equipmentNameMap.get('Rake'))).to.be
              .undefined;
            expect(equipmentIdMap.get(equipmentNameMap.get('Shovel'))).to.be
              .undefined;
          }
        );
      }
    );
  });

  it('Get the EquipmentIdToAsset map for a specific categories', () => {
    cy.wrap(farmosUtil.getEquipmentNameToAssetMap()).then(
      (equipmentNameMap) => {
        expect(equipmentNameMap).to.not.be.null;
        expect(equipmentNameMap.size).to.equal(13);

        cy.wrap(
          farmosUtil.getEquipmentIdToAssetMap(['General', 'Seeding'])
        ).then((equipmentIdMap) => {
          expect(equipmentIdMap).to.not.be.null;
          expect(equipmentIdMap.size).to.equal(6);

          const tractorId = equipmentNameMap.get('Tractor').id;
          expect(equipmentIdMap.get(tractorId)).to.not.be.null;
          expect(equipmentIdMap.get(tractorId).type).to.equal(
            'asset--equipment'
          );

          const drillId = equipmentNameMap.get('Seeding Drill').id;
          expect(equipmentIdMap.get(drillId)).to.not.be.null;
          expect(equipmentIdMap.get(drillId).type).to.equal('asset--equipment');

          expect(equipmentIdMap.get(equipmentNameMap.get('Rake'))).to.be
            .undefined;
          expect(equipmentIdMap.get(equipmentNameMap.get('Shovel'))).to.be
            .undefined;
        });
      }
    );
  });
});
