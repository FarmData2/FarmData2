import * as farmosUtil from './farmosUtil.js';

describe('Test the addOwner function', () => {
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

  it('Add owner to object w/o relationships.owner', () => {
    const quantity = farm.log.create({ type: 'quantity--standard' });

    let error = false;
    try {
      // Not necessary to use a real id here.
      farmosUtil.addOwnerRelationship(quantity, 99);
    } catch (e) {
      error = e instanceof ReferenceError;
    }

    expect(error).to.be.true;
  });

  it('Add 1 owner to object with relationships.owner', () => {
    const field = farm.asset.create({ type: 'asset--land' });
    const obj = farmosUtil.addOwnerRelationship(field, 99);

    expect(obj).to.equal(field);
    expect(obj.relationships.owner.length).to.equal(1);
    expect(obj.relationships.owner[0].id).to.equal(99);
  });

  it('Add 2 owners to object with relationships.owner', async () => {
    const field = farm.asset.create({ type: 'asset--land' });
    const obj1 = farmosUtil.addOwnerRelationship(field, 99);
    const obj2 = farmosUtil.addOwnerRelationship(field, 100);

    expect(obj1).to.equal(field);
    expect(obj2).to.equal(obj1);

    expect(field.relationships.owner.length).to.equal(2);

    expect(field.relationships.owner[0].id).to.equal(99);
    expect(field.relationships.owner[1].id).to.equal(100);
  });
});
