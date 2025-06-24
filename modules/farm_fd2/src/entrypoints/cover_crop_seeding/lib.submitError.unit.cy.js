import { lib } from './lib.js';

describe('Error when submitting using the cover_crop lib.', () => {
  let form = {
    date: '1950-01-02',
    crops: ['BEAN', 'CARROT'],
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    areaSeeded: 50,
    seedApplicationEquipment: ['Tractor'],
    seedIncorporationEquipment: ['Rake'],
    seedApplicationDepth: 6,
    seedApplicationSpeed: 5,
    seedApplicationPasses: 2,
    seedIncorporationDepth: 8,
    seedIncorporationSpeed: 3,
    seedIncorporationPasses: 2,
    winterKill: true,
    winterKillDate: '1950-12-31',
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

  it('Check error messages when cleanup fails', { retries: 0 }, () => {
    let postRequestCount = 0;
    cy.intercept('POST', '**/api/log/activity', (req) => {
      postRequestCount += 1;
      if (postRequestCount === 3) {
        req.reply({ statusCode: 401 });
      }
    });

    cy.intercept('DELETE', '**/*', { statusCode: 401 });

    cy.wrap(
      lib
        .submitForm(form)
        .then(() => {
          throw new Error(
            'The submission should have failed but it succeeded.'
          );
        })
        .catch((error) => {
          const errorMessage = error.message;

          expect(errorMessage).to.contain(
            'Error creating cover crop seeding records.'
          );

          expect(errorMessage).to.contain(
            'Result of operation plantAsset could not be cleaned up.'
          );
          expect(errorMessage).to.contain(
            'Result of operation seedingLog could not be cleaned up.'
          );
          expect(errorMessage).to.contain(
            'Result of operation winterKillLog could not be cleaned up.'
          );
          expect(errorMessage).to.contain(
            'Result of operation seedApplicationDepthQuantity0 could not be cleaned up.'
          );
          expect(errorMessage).to.contain(
            'Result of operation seedApplicationActivityLog0 could not be cleaned up.'
          );
          expect(errorMessage).to.contain(
            'Result of operation seedApplicationDepthQuantity1 could not be cleaned up.'
          );

          expect(errorMessage).to.not.contain(
            'Result of operation seedApplicationActivityLog1 could not be cleaned up.'
          );
          expect(errorMessage).to.not.contain(
            'Result of operation seedIncorporationActivityLog0 could not be cleaned up.'
          );
        }),
      { timeout: 30000 }
    );
  });
});
