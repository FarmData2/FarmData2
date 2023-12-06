import * as lib from './lib';

describe('Test the tray seeding submission', () => {
  let form = null;

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    form = {
      seedingDate: '1950-01-01',
      cropName: 'BROCCOLI',
      locationName: 'CHUAU',
      trays: 25,
      traySize: '200',
      seedsPerCell: 3,
      comment: 'A comment',
    };
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it.only('Successful submit', () => {
    // Submit the form
    // Check for planting, quantities and log.
    // Delete planting, quantities and log.

    cy.wrap(lib.submitForm(form)).then(() => {
      
      expect(true).to.equal(false);
    });
 

  });

  it('Error creating the farmOS object', () => {
    // check error
    // ensure that the asset, quantities and log do not exist.
    expect(true).to.equal(false);
  });

  it('Error fetching a map', () => {
    // check error
    // ensure that the asset, quantities and log do not exist.
    expect(true).to.equal(false);
  });

  it('Error creating the planting', () => {
    // check error
    // ensure that the asset, quantities and log do not exist.
    expect(true).to.equal(false);
  });

  it('Error creating a quantity', () => {
    // check error
    // ensure that the asset, quantities and log do not exist.
    expect(true).to.equal(false);
  });

  it('Error creating the the log object', () => {
    // check error
    // ensure that the asset, quantities and log do not exist.
    expect(true).to.equal(false);
  });
});
