import { lib } from './lib.js';

describe('Submission using the cover_crop lib.', () => {
  // form with no winter kill
  let formNoWinterKill = {
    date: '1950-01-02',
    crops: ['BEAN', 'CARROT'],
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    areaSeeded: 50,
    seedApplicationEquipment: ['Tractor'],
    seedIncorporationEquipment: ['Rake'],
    seedApplicationDepth: 6,
    seedApplicationSpeed: 5,
    seedIncorporationDepth: 8,
    seedIncorporationSpeed: 3,
    winterKill: false,
    comment: 'A comment',
  };

  // form with no seed application equipment
  let formNoSeedApplicationEquipment = {
    date: '1950-01-02',
    crops: ['BEAN', 'CARROT'],
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    areaSeeded: 50,
    seedApplicationEquipment: [],
    seedIncorporationEquipment: ['Rake'],
    seedApplicationDepth: 0,
    seedApplicationSpeed: 0,
    seedIncorporationDepth: 8,
    seedIncorporationSpeed: 3,
    winterKill: true,
    winterKillDate: '1950-12-31',
    comment: 'A comment',
  };

  // form with no seed incorporation equipment
  let formNoSeedIncorporationEquipment = {
    date: '1950-01-02',
    crops: ['BEAN', 'CARROT'],
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    areaSeeded: 50,
    seedApplicationEquipment: ['Tractor'],
    seedIncorporationEquipment: [],
    seedApplicationDepth: 6,
    seedApplicationSpeed: 5,
    seedIncorporationDepth: 0,
    seedIncorporationSpeed: 0,
    winterKill: true,
    winterKillDate: '1950-12-31',
    comment: 'A comment',
  };

  before(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check that winter kill log is not created if winterKill is false', () => {
    cy.wrap(lib.submitForm(formNoWinterKill), { timeout: 10000 }).then(
      (res) => {
        expect(res.plantAsset).to.exist;
        expect(res.areaSeededQuantity).to.exist;
        expect(res.seedingLog).to.exist;
        expect(res.winterKillLog).to.be.undefined;
        expect(res.seedApplicationDepthQuantity).to.exist;
        expect(res.seedApplicationSpeedQuantity).to.exist;
        expect(res.seedApplicationAreaQuantity).to.exist;
        expect(res.seedApplicationActivityLog).to.exist;
        expect(res.seedIncorporationDepthQuantity).to.exist;
        expect(res.seedIncorporationSpeedQuantity).to.exist;
        expect(res.seedIncorporationAreaQuantity).to.exist;
        expect(res.seedIncorporationActivityLog).to.exist;
      }
    );
  });

  it('Check that seed application logs are not created if no seedApplicationEquipment is provided', () => {
    cy.wrap(lib.submitForm(formNoSeedApplicationEquipment), {
      timeout: 10000,
    }).then((res) => {
      expect(res.plantAsset).to.exist;
      expect(res.areaSeededQuantity).to.exist;
      expect(res.seedingLog).to.exist;
      expect(res.winterKillLog).to.exist;
      expect(res.seedApplicationDepthQuantity).to.be.null;
      expect(res.seedApplicationSpeedQuantity).to.be.null;
      expect(res.seedApplicationAreaQuantity).to.be.null;
      expect(res.seedApplicationActivityLog).to.be.null;
      expect(res.seedIncorporationDepthQuantity).to.exist;
      expect(res.seedIncorporationSpeedQuantity).to.exist;
      expect(res.seedIncorporationAreaQuantity).to.exist;
      expect(res.seedIncorporationActivityLog).to.exist;
    });
  });

  it('Check that seed incorporation logs are not created if no seedIncorporationEquipment is provided', () => {
    cy.wrap(lib.submitForm(formNoSeedIncorporationEquipment), {
      timeout: 10000,
    }).then((res) => {
      expect(res.plantAsset).to.exist;
      expect(res.areaSeededQuantity).to.exist;
      expect(res.seedingLog).to.exist;
      expect(res.winterKillLog).to.exist;
      expect(res.seedApplicationDepthQuantity).to.exist;
      expect(res.seedApplicationSpeedQuantity).to.exist;
      expect(res.seedApplicationAreaQuantity).to.exist;
      expect(res.seedApplicationActivityLog).to.exist;
      expect(res.seedIncorporationDepthQuantity).to.be.null;
      expect(res.seedIncorporationSpeedQuantity).to.be.null;
      expect(res.seedIncorporationAreaQuantity).to.be.null;
      expect(res.seedIncorporationActivityLog).to.be.null;
    });
  });
});
