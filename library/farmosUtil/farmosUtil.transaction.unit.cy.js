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
    do: async () => {
      return { status: 'op1 success', id: '1', attributes: { name: 'op1' } };
    },
    undo: async () => {},
  };

  const op2 = {
    name: 'op2',
    do: async (results) => {
      return {
        status: 'op2 success',
        id: '2',
        attributes: { name: 'op2' },
        prior: results.op1.attributes.name,
      };
    },
    undo: async () => {},
  };

  const badOp = {
    name: 'badOp',
    do: async () => {
      throw new Error('badOp error');
    },
    undo: async () => {},
  };

  const badDelete = {
    name: 'badDelete',
    do: async () => {
      return {
        status: 'badDelete success',
        id: '3',
        attributes: { name: 'badDelete' },
      };
    },
    undo: async () => {
      throw new Error('badDelete error');
    },
  };

  it('Successful transaction', () => {
    const ops = [op1, op2];

    cy.wrap(farmosUtil.runTransaction(ops)).as('result');

    cy.get('@result').then((result) => {
      expect(result.op1.status).to.equal('op1 success');
      expect(result.op2.status).to.equal('op2 success');
      expect(result.op2.prior).to.equal('op1');
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
          expect(error.results.op1).to.be.null;
          expect(error.results.op2).to.be.null;
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
          expect(error.results.op1).to.be.null;
          expect(error.results.badDelete).not.to.be.null;
          expect(error.results.badDelete.attributes.name).to.equal('badDelete');
          expect(error.results.op2).to.be.null;
          expect(error.results.badOp).to.be.null;
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
      do: async () => {
        return await farmosUtil.createPlantAsset(
          assetName,
          formData.cropName,
          formData.comment
        );
      },
      undo: async (uuid) => {
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
      do: async () => {
        return await farmosUtil.createPlantAsset(
          assetName,
          formData.cropName,
          formData.comment
        );
      },
      undo: async (uuid) => {
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
        expect(error.results.op1).to.be.null;
        expect(error.results.createPlantAsset).to.be.null;
        expect(error.results.badOp).to.be.null;
      });
  });
});
