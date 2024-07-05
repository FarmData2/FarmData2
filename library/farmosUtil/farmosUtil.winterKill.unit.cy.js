import * as farmosUtil from './farmosUtil';

describe('Test the winter kill activity log functions', () => {
  let fieldMap = null;
  let bedMap = null;
  let categoryMap = null;

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((map) => {
      fieldMap = map;
    });

    cy.wrap(farmosUtil.getBedNameToAssetMap()).then((map) => {
      bedMap = map;
    });

    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      categoryMap = map;
    });
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Create a winter kill log for a cover crop', () => {
    cy.wrap(
      farmosUtil.createPlantAsset('1999-12-15', 'BEAN', 'testing winter kill')
    ).as('winterKillAsset');

    // Create the winter kill log.
    cy.get('@winterKillAsset').then((winterKillAsset) => {
      cy.wrap(
        farmosUtil.createWinterKillActivityLog(
          '12/15/1999',
          'ALF',
          ['ALF-1', 'ALF-2'],
          winterKillAsset
        )
      ).as('winterKillLog');
    });

    // Read the winter kill log so we get the one on the server.
    cy.get('@winterKillLog').then((winterKillLog) => {
      cy.wrap(farmosUtil.getWinterKillActivityLog(winterKillLog.id)).as(
        'readWinterKillLog'
      );
    });

    // Check the winter kill log
    cy.getAll(['@readWinterKillLog', '@winterKillAsset']).then(
      ([winterKillLog, winterKillAsset]) => {
        expect(winterKillLog.attributes.name).to.equal('1999-12-15_wk_BEAN');
        expect(winterKillLog.attributes.timestamp).to.contain('1999-12-15');
        expect(winterKillLog.type).to.equal('log--activity');
        expect(winterKillLog.attributes.status).to.equal('done');
        expect(winterKillLog.attributes.is_movement).to.equal(true);

        expect(winterKillLog.relationships.location).to.have.length(3);
        expect(winterKillLog.relationships.location[0].id).to.equal(
          fieldMap.get('ALF').id
        );
        expect(winterKillLog.relationships.location[1].id).to.equal(
          bedMap.get('ALF-1').id
        );
        expect(winterKillLog.relationships.location[2].id).to.equal(
          bedMap.get('ALF-2').id
        );

        expect(winterKillLog.relationships.asset).to.have.length(1);
        expect(winterKillLog.relationships.asset[0].id).to.equal(
          winterKillAsset.id
        );

        expect(winterKillLog.relationships.category).to.have.length(2);
        expect(winterKillLog.relationships.category[0].id).to.equal(
          categoryMap.get('termination').id
        );
        expect(winterKillLog.relationships.category[1].id).to.equal(
          categoryMap.get('seeding_cover_crop').id
        );
      }
    );
  });

  it('Create a winter kill log for multiple cover crops', () => {
    cy.wrap(
      farmosUtil.createPlantAsset(
        '1999-12-15',
        ['BEAN', 'CARROT'],
        'testing winter kill'
      )
    ).as('winterKillAsset');

    // Create the winter kill log.
    cy.get('@winterKillAsset').then((winterKillAsset) => {
      cy.wrap(
        farmosUtil.createWinterKillActivityLog(
          '1999-12-15',
          'ALF',
          ['ALF-1', 'ALF-2'],
          winterKillAsset
        )
      ).as('winterKillLog');
    });

    // Read the winter kill log so we get the one on the server.
    cy.get('@winterKillLog').then((winterKillLog) => {
      cy.wrap(farmosUtil.getWinterKillActivityLog(winterKillLog.id)).as(
        'readWinterKillLog'
      );
    });

    // Check the winter kill log
    cy.getAll(['@readWinterKillLog', '@winterKillAsset']).then(
      ([winterKillLog, winterKillAsset]) => {
        expect(winterKillLog.attributes.name).to.equal(
          '1999-12-15_wk_BEAN_CARROT'
        );
        expect(winterKillLog.attributes.timestamp).to.contain('1999-12-15');
        expect(winterKillLog.type).to.equal('log--activity');
        expect(winterKillLog.attributes.status).to.equal('done');
        expect(winterKillLog.attributes.is_movement).to.equal(true);

        expect(winterKillLog.relationships.location).to.have.length(3);
        expect(winterKillLog.relationships.location[0].id).to.equal(
          fieldMap.get('ALF').id
        );
        expect(winterKillLog.relationships.location[1].id).to.equal(
          bedMap.get('ALF-1').id
        );
        expect(winterKillLog.relationships.location[2].id).to.equal(
          bedMap.get('ALF-2').id
        );

        expect(winterKillLog.relationships.asset).to.have.length(1);
        expect(winterKillLog.relationships.asset[0].id).to.equal(
          winterKillAsset.id
        );

        expect(winterKillLog.relationships.category).to.have.length(2);
        expect(winterKillLog.relationships.category[0].id).to.equal(
          categoryMap.get('termination').id
        );
        expect(winterKillLog.relationships.category[1].id).to.equal(
          categoryMap.get('seeding_cover_crop').id
        );
      }
    );
  });

  it('Error creating a winter kill log', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/log/activity', {
      statusCode: 401,
    });

    // Create a new plant asset for the winter killed crop
    cy.wrap(
      farmosUtil.createPlantAsset(
        '1999-12-15',
        'BEAN-LIMA',
        'testing winter kill'
      )
    ).as('winterKillAsset');

    // Attempt to create the winter kill log
    cy.get('@winterKillAsset').then((winterKillAsset) => {
      cy.wrap(
        farmosUtil
          .createWinterKillActivityLog('12/15/1999', 'A', [], winterKillAsset)
          .then(() => {
            throw new Error('Creating winter kill log should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.equal(
              'Request failed with status code 401'
            );
          })
      );
    });
  });

  it('Delete a winter kill log', () => {
    // Create a new plant asset for the winter killed crop
    cy.wrap(
      farmosUtil.createPlantAsset('1999-12-15', 'CARROT', 'testing winter kill')
    ).as('winterKillAsset');

    // Create the winter kill log
    cy.get('@winterKillAsset').then((winterKillAsset) => {
      cy.wrap(
        farmosUtil.createWinterKillActivityLog(
          '12/15/1999',
          'A',
          [],
          winterKillAsset
        )
      ).as('winterKillLog');
    });

    cy.get('@winterKillLog').then((winterKillLog) => {
      cy.wrap(
        farmosUtil
          .deleteWinterKillActivityLog(winterKillLog.id)
          .then((result) => {
            expect(result.status).to.equal(204);
          })
      );
    });
  });

  it('Error deleting a winter kill log', { retries: 4 }, () => {
    cy.intercept('DELETE', '**/api/log/activity/*', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil
        .deleteWinterKillActivityLog('1234')
        .then(() => {
          throw new Error('Deleting winter kill log should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });
});
