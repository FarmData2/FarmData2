import * as farmosUtil from './farmosUtil.js';

describe('Test the plant asset functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  const op1 = {
    name: 'op1',
    create: async () => {
      return { status: 'op1 success', id: '1', attributes: { name: 'op1' } };
    },
    delete: async () => {},
  };

  const op2 = {
    name: 'op2',
    create: async () => {
      return { status: 'op2 success', id: '2', attributes: { name: 'op2' } };
    },
    delete: async () => {},
  };

  const badOp = {
    name: 'badOp',
    create: async () => {
      throw new Error('badOp error');
    },
    delete: async () => {},
  };

  const badDelete = {
    name: 'badDelete',
    create: async () => {
      return {
        status: 'badDelete success',
        id: '3',
        attributes: { name: 'badDelete' },
      };
    },
    delete: async () => {
      throw new Error('badDelete error');
    },
  };

  it('Successful transaction', () => {
    const ops = [op1, op2];

    cy.wrap(farmosUtil.runTransaction(ops)).as('result');

    cy.get('@result').then((result) => {
      expect(result.op1.status).to.equal('op1 success');
      expect(result.op2.status).to.equal('op2 success');
    });
  });

  it('Failed transaction with successful deletes', () => {
    const ops = [op1, op2, badOp];

    cy.wrap(
      farmosUtil
        .runTransaction(ops)
        .then(() => {
          throw new Error('Transaction should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Error running transaction.');
          expect(error.result.op1).to.be.null;
          expect(error.result.op2).to.be.null;
        })
    );
  });

  it('Failed transaction with failed deletes', () => {
    const ops = [op1, badDelete, op2, badOp];

    cy.wrap(
      farmosUtil
        .runTransaction(ops)
        .then(() => {
          throw new Error('Transaction should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.contain('Error running transaction.');
          expect(error.result.op1).to.be.null;
          expect(error.result.badDelete).not.to.be.null;
          expect(error.result.badDelete.attributes.name).to.equal('badDelete');
          expect(error.result.op2).to.be.null;
          expect(error.result.badOp).to.be.null;
        })
    );
  });

  it('Successful transaction in farmOS', () => {
    const formData = {
      cropName: 'ARUGULA',
      comment: 'test comment',
    };
    const assetName = 'test asset';

    const createPlantAsset = {
      name: 'createPlantAsset',
      create: async () => {
        return await farmosUtil.createPlantAsset(
          assetName,
          formData.cropName,
          formData.comment
        );
      },
      delete: async (uuid) => {
        await farmosUtil.deletePlantAsset(uuid);
      },
    };

    const ops = [op1, createPlantAsset, op2];

    cy.wrap(farmosUtil.runTransaction(ops)).as('result');

    cy.get('@result').then((result) => {
      expect(result.createPlantAsset.attributes.name).to.equal(assetName);
    });
  });

  it('Failed transaction in farmOS', () => {
    const formData = {
      cropName: 'WATERMELON',
      comment: 'test comment',
    };
    const assetName = 'test asset';

    const createPlantAsset = {
      name: 'createPlantAsset',
      create: async () => {
        return await farmosUtil.createPlantAsset(
          assetName,
          formData.cropName,
          formData.comment
        );
      },
      delete: async (uuid) => {
        await farmosUtil.deletePlantAsset(uuid);
      },
    };

    const ops = [op1, createPlantAsset, badOp];

    farmosUtil
      .runTransaction(ops)
      .then(() => {
        throw new Error('Transaction should have failed.');
      })
      .catch((error) => {
        expect(error.message).to.equal('Error running transaction.');
        expect(error.result.op1).to.be.null;
        expect(error.result.createPlantAsset).to.be.null;
        expect(error.result.badOp).to.be.null;
      });
  });
});
