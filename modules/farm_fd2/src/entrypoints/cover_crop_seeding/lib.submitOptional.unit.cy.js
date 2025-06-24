import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submissions with optional content omitted', () => {
  let equipmentMap;

  before(() => {
    const timeout = { timeout: 30000 };
    cy.wrap(farmosUtil.getEquipmentNameToAssetMap(), timeout).then((map) => {
      equipmentMap = map;
    });
  });

  // No winter kill
  describe('When winter kill is false', () => {
    let results = null;
    const form = {
      date: '1950-01-02',
      crops: ['BEAN'],
      location: 'ALF',
      beds: [],
      areaSeeded: 50,
      seedApplicationEquipment: ['Tractor'],
      seedIncorporationEquipment: ['Rake'],
      seedApplicationDepth: 6,
      seedApplicationSpeed: 5,
      seedApplicationPasses: 1,
      seedIncorporationDepth: 8,
      seedIncorporationSpeed: 3,
      seedIncorporationPasses: 1,
      winterKill: false,
      winterKillDate: null,
      comment: 'A comment',
    };

    before(() => {
      cy.wrap(lib.submitForm(form), { timeout: 30000 }).then((res) => {
        results = res;
      });
    });

    it('should create all equipment logs and quantities', () => {
      expect(results).to.have.property('plantAsset');
      expect(results).to.have.property('seedingLog');
      expect(results).to.have.property('seedApplicationActivityLog0');
      expect(results).to.have.property('seedApplicationDepthQuantity0');
      expect(results).to.have.property('seedApplicationSpeedQuantity0');
      expect(results).to.have.property('seedApplicationAreaQuantity0');
      expect(results).to.have.property('seedIncorporationActivityLog0');
      expect(results).to.have.property('seedIncorporationDepthQuantity0');
      expect(results).to.have.property('seedIncorporationSpeedQuantity0');
      expect(results).to.have.property('seedIncorporationAreaQuantity0');

      it('should NOT create a winter kill log', () => {
        expect(results).to.not.have.property('winterKillLog');
      });
    });

    // No application equipment
    describe('When no seed application equipment is provided', () => {
      let results = null;
      const form = {
        date: '1950-01-02',
        crops: ['BEAN'],
        location: 'ALF',
        beds: [],
        areaSeeden: 50,
        seedApplicationEquipment: [], // Empty for this test
        seedIncorporationEquipment: ['Rake'],
        seedApplicationDepth: 0,
        seedApplicationSpeed: 0,
        seedApplicationPasses: 1,
        seedIncorporationDepth: 8,
        seedIncorporationSpeed: 3,
        seedIncorporationPasses: 1,
        winterKill: false,
        winterKillDate: null,
        comment: 'A comment',
      };

      before(() => {
        cy.wrap(lib.submitForm(form), { timeout: 30000 }).then((res) => {
          results = res;
        });
      });

      it('should NOT create seed application records', () => {
        expect(results).to.not.have.property('seedApplicationActivityLog0');
        expect(results).to.not.have.property('seedApplicationDepthQuantity0');
        expect(results).to.not.have.property('seedApplicationSpeedQuantity0');
        expect(results).to.not.have.property('seedApplicationAreaQuantity0');
      });

      it('should still create seed incorporation records with correct details', () => {
        const log = results.seedIncorporationActivityLog0;
        expect(log.type).to.equal('log--activity');
        expect(log.relationships.equipment[0].id).to.equal(
          equipmentMap.get(form.seedIncorporationEquipment[0]).id
        );
        expect(results).to.have.property('seedIncorporationDepthQuantity0');
        expect(results).to.have.property('seedIncorporationSpeedQuantity0');
        expect(results).to.have.property('seedIncorporationAreaQuantity0');
      });
    });
  });

  // No incorporation equipment
  describe('When no seed incorporation equipment is provided', () => {
    let results = null;
    const form = {
      date: '1950-01-02',
      crops: ['BEAN'],
      location: 'ALF',
      beds: [],
      areaSeeden: 50,
      seedApplicationEquipment: ['Tractor'],
      seedIncorporationEquipment: [],
      seedApplicationPasses: 1,
      seedIncorporationPasses: 1,
      winterKill: false,
      winterKillDate: null,
      comment: 'A comment',
    };

    before(() => {
      cy.wrap(lib.submitForm(form), { timeout: 30000 }).then((res) => {
        results = res;
      });
    });

    it('should still create seed application records with correct details', () => {
      const log = results.seedApplicationActivityLog0;
      expect(log.type).to.equal('log--activity');
      expect(log.relationships.equipment[0].id).to.equal(
        equipmentMap.get(form.seedApplicationEquipment[0]).id
      );
      expect(results).to.have.property('seedApplicationDepthQuantity0');
    });

    it('should NOT create seed incorporation records', () => {
      expect(results).to.not.have.property('seedIncorporationActivityLog0');
      expect(results).to.not.have.property('seedIncorporationDepthQuantity0');
    });
  });
});

// No equipment at all
describe('Submission without equipment', () => {
  let results = null;
  const form = {
    date: '1950-01-02',
    crops: ['BEAN', 'CARROT'],
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    areaSeeded: 50,
    seedApplicationEquipment: [],
    seedIncorporationEquipment: [],
    seedApplicationDepth: 6,
    seedApplicationSpeed: 5,
    seedApplicationPasses: 3,
    seedIncorporationDepth: 8,
    seedIncorporationSpeed: 3,
    seedIncorporationPasses: 3,
    winterKill: true,
    winterKillDate: '1950-12-31',
    comment: 'No equipment test',
  };

  before(() => {
    const timeout = { timeout: 30000 };
    cy.wrap(farmosUtil.getEquipmentNameToAssetMap(), timeout)
      .then(() => cy.wrap(lib.submitForm(form), timeout))
      .then((res) => {
        results = res;
      });
  });

  it('Check the plant asset', () => {
    expect(results.plantAsset.type).to.equal('asset--plant');
  });

  it('Check the main seeding log', () => {
    expect(results.seedingLog.type).to.equal('log--seeding');
  });

  it('should NOT create any seed application logs', () => {
    expect(results).to.not.have.property('seedApplicationActivityLog0');
  });

  it('should NOT create any seed incorporation logs', () => {
    expect(results).to.not.have.property('seedIncorporationActivityLog0');
  });
});
