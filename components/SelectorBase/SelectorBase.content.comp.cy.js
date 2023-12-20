import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';

describe('Test the default SelectorBase content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check all of the data-cy elements exist', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-group"]').should('exist');
        cy.get('[data-cy="selector-label"]').should('have.text', 'TheLabel:');
        cy.get('[data-cy="selector-required"]').should('not.exist');
        cy.get('[data-cy="selector-input"]').should('exist');
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 6);
        cy.get('[data-cy="selector-option-0"]').should('have.value', '');
        cy.get('[data-cy="selector-option-1"]').should('have.value', 'One');
        cy.get('[data-cy="selector-option-5"]').should('have.value', 'Five');
        cy.get('[data-cy="selector-add-button"]').should('not.exist');
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'contain.text',
          'Invalid feedback text.'
        );
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'not.be.visible'
        );
      });
  });

  it('Test required prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-group"]').should('exist');
        cy.get('[data-cy="selector-label"]').should('have.text', 'TheLabel:');
        cy.get('[data-cy="selector-required"]').should('exist');
        cy.get('[data-cy="selector-input"]').should('exist');
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 6);
        cy.get('[data-cy="selector-option-0"]').should('have.value', '');
        cy.get('[data-cy="selector-option-1"]').should('have.value', 'One');
        cy.get('[data-cy="selector-option-5"]').should('have.value', 'Five');
        cy.get('[data-cy="selector-add-button"]').should('not.exist');
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'contain.text',
          'Invalid feedback text.'
        );
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'not.be.visible'
        );
      });
  });

  it('Test selected prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        selected: 'Three',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should('have.value', 'Three');
      });
  });

  it('Test addOptionUrl prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        addOptionUrl: 'add/option/url',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
        cy.get('[data-cy="selector-add-button"]')
          .should('have.attr', 'href')
          .then((href) => href)
          .should('eq', 'add/option/url');
      });
  });

  it('Test showValidityStyling prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should('have.class', 'is-invalid');
      });
  });
});
