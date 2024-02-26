import PickerBase from '@comps/PickerBase/PickerBase.vue';

describe('Test the PickerBase component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "valid" true on creation if not required.', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits "valid" false on creation if required.', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        required: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Emits "update:picked" when picked options are changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updateSpy,
        required: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-options"]').find('input').eq(0).check();
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', ['Option 1']);

        cy.get('[data-cy="picker-options"]').find('input').eq(1).check();
        cy.get('@updateSpy').should('have.been.calledTwice');
        cy.get('@updateSpy').should('have.been.calledWith', [
          'Option 1',
          'Option 2',
        ]);

        cy.get('[data-cy="picker-options"]').find('input').eq(0).uncheck();
        cy.get('@updateSpy').should('have.been.calledThrice');
        cy.get('@updateSpy').should('have.been.calledWith', ['Option 2']);
      });
  });

  it('Emits "update:picked" when "All" button is clicked', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updateSpy,
        required: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-all-button"]').click();
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', [
          'Option 1',
          'Option 2',
          'Option 3',
          'Option 4',
        ]);
      });
  });

  it('Emits "update:valid" true when becomes valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        required: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
        cy.get('[data-cy="picker-options"]').find('input').eq(0).check();
        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits "update:valid" false when becomes invalid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        required: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: ['Option 1'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
        cy.get('[data-cy="picker-options"]').find('input').eq(0).uncheck();
        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Does not emit "update:valid" if not change in validity', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        required: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: ['Option 1'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);

        cy.get('[data-cy="picker-options"]').find('input').eq(1).check();
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('[data-cy="picker-options"]').find('input').eq(1).uncheck();
        cy.get('@validSpy').should('have.been.calledOnce');

        cy.get('[data-cy="picker-options"]').find('input').eq(0).uncheck();
        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });
});
