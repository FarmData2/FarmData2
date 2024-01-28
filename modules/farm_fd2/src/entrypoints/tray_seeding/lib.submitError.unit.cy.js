import * as lib from './lib';

describe('Test error when submitting tray seeding lib', () => {
  let form = {
    seedingDate: '1950-01-02',
    cropName: 'BROCCOLI',
    locationName: 'CHUAU',
    trays: 25,
    traySize: '200',
    seedsPerCell: 3,
    comment: 'A comment',
  };

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it(
    'Records are deleted if there is a submission error',
    { retries: 4 },
    () => {
      /*
       * Create a error on submission of the seeding log which is the
       * final step.  At that point all other records should have been
       * created and thus should also all be deleted.
       */
      cy.intercept('POST', '**/api/log/seeding', {
        statusCode: 401,
      });

      /*
       * Now create an intercept with a spy for each of the other endpoints
       * where records are being deleted.  We'll then check that each was
       * called the appropriate number of times.  This doesn't actually check
       * the database, but it gives reasonably high confidence that everything
       * worked.
       */
      let standardQuantityDeletes = 0;
      cy.intercept('DELETE', '**/api/quantity/standard/*', (req) => {
        standardQuantityDeletes++;
        req.reply({
          statusCode: 401,
        });
      });

      let plantAssetDeletes = 0;
      cy.intercept('DELETE', '**/api/asset/plant/*', (req) => {
        plantAssetDeletes++;
        req.reply({
          statusCode: 401,
        });
      });

      cy.wrap(
        lib
          .submitForm(form)
          .then(() => {
            // Shouldn't run because submitForm throws an error.
            throw new Error('The submission should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.equal('Error creating tray seeding.');
            expect(standardQuantityDeletes).to.equal(3);
            expect(plantAssetDeletes).to.equal(1);
          }),
        { timeout: 10000 }
      );
    }
  );
});
