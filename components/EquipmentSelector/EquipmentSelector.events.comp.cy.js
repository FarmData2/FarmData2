import EquipmentSelector from '@comps/EquipmentSelector/EquipmentSelector.vue';

describe('Test the EquipmentSelector component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "valid" when equipment selector has been created', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits "update:selected" when selection is changed', () => {
    expect(true).to.equal(false);
  });

  it('"update:selected" payload is array of all selected values', () => {
    expect(true).to.equal(false);
  });

  it('Emits "error" if loading equipment fails', () => {
    expect(true).to.equal(false);
  });
});
