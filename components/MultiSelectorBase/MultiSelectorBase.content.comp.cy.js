import MultiSelectorBase from '@comps/MultiSelectorBase/MultiSelectorBase.vue';

describe('Test the default MultiSelectorBase content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check the first dropdown element', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-1"]').should('exist');
        cy.get('[data-cy="selector-2"]').should('not.exist');
      });
  });

  it('Check default props', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-required"]').should('not.exist');
        cy.get('[data-cy="selector-label"]').should('have.text', '1:');
        cy.get('[data-cy="selector-input"]').should('have.value', null);
        cy.get('[data-cy="selector-delete-button"]').should('not.exist');
        cy.get('[data-cy="selector-add-button"]').should('not.exist');
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-invalid'
        );
      });
  });

  it('Check optional/non-default prop values', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        required: true,
        selected: ['one'],
        options: ['one', 'two', 'three'],
        popupUrl: '',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-1"]').should('exist');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-add-button"]')
          .should('not.exist');

        cy.get('[data-cy="selector-2"]').should('exist');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-add-button"]')
          .should('exist');

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-required"]')
          .should('exist');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-required"]')
          .should('not.exist');

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'one');
      });
  });

  it('Check required prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        required: true,
        onReady: readySpy,
        selected: [],
        options: ['one', 'two', 'three', 'four'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // no items => required and no delete
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-required"]')
          .should('exist');
        // one item => required and no delete
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .select('one');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-required"]')
          .should('exist');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-required"]')
          .should('not.exist');
        // two items => not required and delete
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-input"]')
          .select('two');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .should('exist');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-required"]')
          .should('not.exist');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-delete-button"]')
          .should('exist');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-required"]')
          .should('not.exist');
      });
  });

  it('Check showValidityStyling prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        required: true,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should('have.class', 'is-invalid');
      });
  });
});
