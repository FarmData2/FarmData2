import * as farmosUtil from './farmosUtil';

describe('Test the getSeedlings function', () => {
  before(() => {
    cy.task('initDB');
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Get all seedling information.', () => {
    cy.wrap(farmosUtil.getSeedlings()).then((seedlings) => {
      expect(seedlings).to.not.be.null;
      expect(seedlings.length).to.equal(27);

      const first = seedlings[0];
      expect(first.log_id).to.not.be.undefined;
      expect(first.log_uuid).to.not.be.undefined;
      expect(first.asset_id).to.not.be.undefined;
      expect(first.asset_uuid).to.not.be.undefined;
      expect(first.date).to.equal('2019-03-11');
      expect(first.user).to.equal('admin');
      expect(first.crop).to.equal('BROCCOLI');
      expect(first.trays_location).to.equal('CHUAU');
      expect(first.asset_locations).to.equal('CHUAU');
      expect(first.total_trays).to.equal(4);
      expect(first.available_trays).to.equal(4);
      expect(first.tray_size).to.equal(128);
      expect(first.seeds_per_cell).to.equal(1);
      expect(first.total_seeds).to.equal(4 * 128);
      expect(first.notes).to.equal('First broccoli tray seeding.');

      const another = seedlings[24];
      expect(another.log_id).to.not.be.undefined;
      expect(another.log_uuid).to.not.be.undefined;
      expect(another.asset_id).to.not.be.undefined;
      expect(another.asset_uuid).to.not.be.undefined;
      expect(another.date).to.equal('2019-08-29');
      expect(another.user).to.equal('admin');
      expect(another.crop).to.equal('LETTUCE-ICEBERG');
      expect(another.trays_location).to.equal('CHUAU');
      expect(another.asset_locations).to.equal('CHUAU');
      expect(another.total_trays).to.equal(2);
      expect(another.available_trays).to.equal(2);
      expect(another.tray_size).to.equal(128);
      expect(another.seeds_per_cell).to.equal(1);
      expect(another.total_seeds).to.equal(2 * 128);
      expect(another.notes).to.equal('Last lettuce tray seeding.');
    });
  });

  it('Error when getting seedlings.', { retries: 4 }, () => {
    cy.intercept('GET', '**/api/fd2_seedlings', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil
        .getSeedlings()
        .then(() => {
          throw new Error('Fetching seedlings should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Unable to fetch seedlings.');
        })
    );
  });

  it('Get seedling information for specific crop.', () => {
    cy.wrap(farmosUtil.getSeedlings('BROCCOLI')).then((seedlings) => {
      expect(seedlings).to.not.be.null;
      expect(seedlings.length).to.equal(5);

      const first = seedlings[0];
      expect(first.date).to.equal('2019-03-11');

      const last = seedlings[4];
      expect(last.date).to.equal('2019-07-26');

      for (const seedling of seedlings) {
        expect(seedling.crop).to.equal('BROCCOLI');
      }
    });
  });

  it('Get crop names of active tray seeded crops with tray inventory > 0', () => {
    cy.wrap(farmosUtil.getTraySeededCropNames()).then((crops) => {
      expect(crops.length).to.equal(8);
      expect(crops[0]).to.equal('BROCCOLI');
      expect(crops[7]).to.equal('LETTUCE-ICEBERG');
    });
  });

  it(
    'Error getting crop names of active tray seeded crops with tray inventory > 0',
    { retries: 4 },
    () => {
      cy.intercept('GET', '**/api/fd2_seedlings_crop_names', {
        statusCode: 401,
      });

      cy.wrap(
        farmosUtil
          .getTraySeededCropNames()
          .then(() => {
            throw new Error(
              'Fetching tray seeded crop names should have failed.'
            );
          })
          .catch((error) => {
            expect(error.message).to.equal(
              'Unable to fetch tray seeded crop names.'
            );
          })
      );
    }
  );
});
