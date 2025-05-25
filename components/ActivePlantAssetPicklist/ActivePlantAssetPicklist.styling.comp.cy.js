import ActivePlantAssetPicklist from '@comps/ActivePlantAssetPicklist/ActivePlantAssetPicklist.vue';

describe('Test the ActivePlantAssetPicklist component styling', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  /*
   * There are 8 possibilities for styling...
   *
   * required   showValidityStyling    picked     Tested by Test
   * false      false                  false     1. Not Required, not showing, not picked
   * false      false                  true      2. Not Required, not showing, picked
   * false      true                   false     3. Not Required, showing, not picked
   * false      true                   true      4. Not Required, showing, picked
   * true       false                  false     5. Required, not showing, not picked
   * true       false                  true      6. Required, not showing, picked
   * true       true                   false     7. Required, showing, not picked
   * true       true                   true      8. Required, showing, picked
   */

  it('1. Not Required, not showing, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('2. Not Required, not showing, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-checkbox-0"]').invoke('click');
        cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');

        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('3. Not Required, showing, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should('have.class', 'is-valid');
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('4. Not Required, showing, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-checkbox-0"]').invoke('click');
        cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');

        cy.get('[data-cy="picklist-table"]').should('have.class', 'is-valid');
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('5. Required, not showing, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('6. Required, not showing, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-checkbox-0"]').invoke('click');
        cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');

        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('7. Required, showing, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="picklist-table"]').should('have.class', 'is-invalid');
        cy.get('[data-cy="picklist-invalid-feedback"]')
          .should('exist')
          .should('have.text', 'At least one row must be selected.');
      });
  });

  it('8. Required, showing, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-checkbox-0"]').invoke('click');
        cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');

        cy.get('[data-cy="picklist-table"]').should('have.class', 'is-valid');
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });
});
