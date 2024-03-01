import BedPicker from '@comps/BedPicker/BedPicker.vue';

describe('Test the default BedPicker content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check content with a greenhouse', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(BedPicker, {
      props: {
        onReady: readySpy,
        location: 'CHUAU',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="bed-picker"]').should('be.visible');
        cy.get('[data-cy="picker-label"]').should('have.text', 'Beds:');
        cy.get('[data-cy="picker-options"]')
          .children()
          .should('have.length', 5);
        cy.get('[data-cy="picker-options"]')
          .children()
          .eq(0)
          .should('have.text', 'CHUAU-1')
          .should('not.be.checked');
        cy.get('[data-cy="picker-options"]')
          .children()
          .eq(4)
          .should('have.text', 'CHUAU-5')
          .should('not.be.checked');
      });
  });

  it('Check content with a field', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(BedPicker, {
      props: {
        onReady: readySpy,
        location: 'ALF',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="bed-picker"]').should('be.visible');
        cy.get('[data-cy="picker-options"]')
          .children()
          .should('have.length', 4);
        cy.get('[data-cy="picker-options"]')
          .children()
          .eq(0)
          .should('have.text', 'ALF-1')
          .should('not.be.checked');
        cy.get('[data-cy="picker-options"]')
          .children()
          .eq(3)
          .should('have.text', 'ALF-4')
          .should('not.be.checked');
        cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('Check required prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(BedPicker, {
      props: {
        onReady: readySpy,
        location: 'ALF',
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-required"]').should('be.visible');
      });
  });

  it('Check showValidityStyling prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(BedPicker, {
      props: {
        onReady: readySpy,
        location: 'ALF',
        required: true,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-invalid-feedback"]').should('be.visible');
      });
  });

  it('Check picked prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(BedPicker, {
      props: {
        onReady: readySpy,
        location: 'ALF',
        required: true,
        picked: ['ALF-1', 'ALF-3'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('be.checked');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(1)
          .should('not.be.checked');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(2)
          .should('be.checked');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(3)
          .should('not.be.checked');
      });
  });

  it('Check hidden if no beds in location', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(BedPicker, {
      props: {
        onReady: readySpy,
        location: 'B',
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="bed-picker"]').should('not.be.visible');
      });
  });
});
