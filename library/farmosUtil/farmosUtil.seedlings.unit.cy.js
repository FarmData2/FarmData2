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
      expect(seedlings.length).to.equal(25);

      const first = seedlings[0];
      expect(first.log_id).to.not.be.undefined;
      expect(first.asset_id).to.not.be.undefined;
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

      const last = seedlings[24];
      expect(last.log_id).to.not.be.undefined;
      expect(last.asset_id).to.not.be.undefined;
      expect(last.date).to.equal('2019-08-29');
      expect(last.user).to.equal('admin');
      expect(last.crop).to.equal('LETTUCE-ICEBERG');
      expect(last.trays_location).to.equal('CHUAU');
      expect(last.asset_locations).to.equal('CHUAU');
      expect(last.total_trays).to.equal(2);
      expect(last.available_trays).to.equal(2);
      expect(last.tray_size).to.equal(128);
      expect(last.seeds_per_cell).to.equal(1);
      expect(last.total_seeds).to.equal(2 * 128);
      expect(last.notes).to.equal('Last lettuce tray seeding.');
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

  it('Error getting crop names of active tray seeded crops with tray inventory > 0', () => {
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
  });
});
