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
          expect(error.message).to.contain('Error running transaction.');
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
          expect(error.message).to.contain(
            'Delete the following logs or assets:'
          );
          expect(error.message).to.contain('badDelete');
        })
    );
  });
});
