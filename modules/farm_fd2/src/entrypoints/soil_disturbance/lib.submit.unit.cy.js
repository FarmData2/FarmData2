import { lib } from './lib';
import { lib as directSeedingLib } from '../direct_seeding/lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Test the Soil Disturbance lib submission', () => {
  let directSeedingBroccoli = {
    seedingDate: '1950-01-02',
    cropName: 'BROCCOLI',
    locationName: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    bedFeet: 100,
    rowsPerBed: '3',
    bedWidth: 60,
    equipment: ['Tractor'],
    depth: 6,
    speed: 5,
    comment: 'A comment',
  };

  let directSeedingBean = {
    seedingDate: '1950-01-02',
    cropName: 'BEAN',
    locationName: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    bedFeet: 100,
    rowsPerBed: '3',
    bedWidth: 60,
    equipment: ['Tractor'],
    depth: 6,
    speed: 5,
    comment: 'A comment',
  };

  let form = {
    date: '1950-01-02',
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    termination: true,
    terminatedPlants: [],
    equipment: ['Tractor', 'Rake'],
    depth: 5,
    speed: 6,
    passes: 2,
    area: 100,
    comment: 'A comment',
  };

  let results = null;
  let cropMap = null;
  before(() => {
    cy.wrap(farmosUtil.getCropNameToTermMap()).then((map) => {
      cropMap = map;
    });
    cy.wrap(directSeedingLib.submitForm(directSeedingBroccoli), {
      timeout: 10000,
    })
      .then((resultsBroccoli) => {
        form.terminatedPlants.push(resultsBroccoli.plantAsset.id);
        // console.log(results.plantAsset.id);
        // console.log(farmosUtil.getPlantAssets('ALF', ['ALF-1', 'ALF-3']));
        return cy.wrap(directSeedingLib.submitForm(directSeedingBean), {
          timeout: 10000,
        });
      })
      .then((resultsBean) => {
        form.terminatedPlants.push(resultsBean.plantAsset.id);
        // console.log(results2.plantAsset.id);
        // console.log(farmosUtil.getPlantAssets('ALF', ['ALF-1', 'ALF-3']));
        //console.log(form);
        return cy.wrap(lib.submitForm(form), { timeout: 10000 });
      })
      .then((submitted) => {
        results = submitted;
        //console.log(results);
      });
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check archived asset--plant(s)', () => {
    expect(results.archivedPlants).to.have.length(2);
    // check BROCCOLI
    expect(results.archivedPlants[0].id).to.equal(form.terminatedPlants[0]);
    expect(results.archivedPlants[0].type).to.equal('asset--plant');
    expect(results.archivedPlants[0].attributes.name).to.equal(
      directSeedingBroccoli.seedingDate + '_' + directSeedingBroccoli.cropName
    );
    expect(results.archivedPlants[0].attributes.status).to.equal('archived');
    expect(results.archivedPlants[0].relationships.plant_type[0].id).to.equal(
      cropMap.get(directSeedingBroccoli.cropName).id
    );
    // check BEAN
    expect(results.archivedPlants[1].id).to.equal(form.terminatedPlants[1]);
    expect(results.archivedPlants[1].type).to.equal('asset--plant');
    expect(results.archivedPlants[1].attributes.name).to.equal(
      directSeedingBean.seedingDate + '_' + directSeedingBean.cropName
    );
    expect(results.archivedPlants[1].attributes.status).to.equal('archived');
    expect(results.archivedPlants[1].relationships.plant_type[0].id).to.equal(
      cropMap.get(directSeedingBean.cropName).id
    );
  });
});
