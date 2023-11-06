import * as farmosUtil from './farmosUtil.js';

describe('Test the addParent function', () => {
  var farm = null;
  before(() => {
    cy.wrap(
      farmosUtil
        .getFarmOSInstance('http://farmos', 'farm', 'admin', 'admin')
        .then((newFarm) => {
          farm = newFarm;
        })
    );
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Add parent to object w/o relationships.parent', () => {
    const quantity = farm.asset.create({ type: 'quantity--standard' });
    const parent = farm.asset.create({ type: 'quantity--standard' });

    let error = false;
    try {
      farmosUtil.addParentRelationship(quantity, parent.id);
    } catch (e) {
      error = e instanceof ReferenceError;
    }

    expect(error).to.be.true;
  });

  it('Add 1 parent to object with relationships.parent', () => {
    const field = farm.asset.create({ type: 'asset--land' });
    const bed = farm.asset.create({ type: 'asset--land' });

    const obj = farmosUtil.addParentRelationship(
      bed,
      field.id,
      field.attributes.type
    );

    expect(obj).to.equal(bed);
    expect(obj.relationships.parent.length).to.equal(1);
    expect(obj.relationships.parent[0].id).to.equal(field.id);
  });

  it('Add 2 parents to object with relationships.parent', () => {
    const field = farm.asset.create({ type: 'asset--land' });
    const greenhouse = farm.asset.create({ type: 'asset--structure' });
    const bed = farm.asset.create({ type: 'asset--land' });

    const obj1 = farmosUtil.addParentRelationship(bed, field.id, field.type);
    const obj2 = farmosUtil.addParentRelationship(
      bed,
      greenhouse.id,
      greenhouse.type
    );

    expect(obj1).to.equal(bed);
    expect(obj2).to.equal(obj1);

    expect(bed.relationships.parent.length).to.equal(2);

    expect(bed.relationships.parent[0].id).to.equal(field.id);
    expect(bed.relationships.parent[1].id).to.equal(greenhouse.id);
  });
});
