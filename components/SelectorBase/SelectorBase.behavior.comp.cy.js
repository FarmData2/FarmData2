import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';

describe('Test the SelectorBase behaviors', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check options property updates when the array reference changes', () => {
    const initOpts = ['One', 'Two', 'Three'];
    const newOpts = ['A', 'B', 'C', 'D'];

    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: initOpts,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-option-1"]').should('have.value', 'One');
          wrapper.setProps({ options: newOpts });
          cy.get('[data-cy="selector-option-1"]').should('have.value', 'A');
          cy.get('[data-cy="selector-option-4"]').should('have.value', 'D');
        });
    });
  });

  it('Prop is a list of strings and objects', () => {
    const initOpts = [
      'One',
      'Two',
      'Three',
      { text: 'Four', value: 'Four', disabled: false },
      'Five',
    ];
    const newOpts = [
      'Six',
      { text: 'Seven', value: 'Seven', disabled: true },
      'Eight',
    ];

    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: initOpts,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-option-1"]').should('have.value', 'One');
          cy.get('[data-cy="selector-option-4"]').should('have.value', 'Four');
          cy.get('[data-cy="selector-option-5"]').should('have.value', 'Five');
          wrapper.setProps({ options: newOpts });
          cy.get('[data-cy="selector-option-1"]').should('have.value', 'Six');
          cy.get('[data-cy="selector-option-2"]').should('have.value', 'Seven');
          cy.get('[data-cy="selector-option-3"]').should('have.value', 'Eight');
        });
    });
  });

  it('Props reflect can be disabled/enabled through flag', () => {
    const initOpts = [
      { text: 'One', value: 'One', disabled: true },
      { text: 'Two', value: 'Two', disabled: false },
      'three',
    ];
    const newOpts = [
      { text: 'One', value: 'One', disabled: false },
      { text: 'Two', value: 'Two', disabled: true },
      'three',
    ];

    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: initOpts,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-option-1"]').should('be.disabled');
          cy.get('[data-cy="selector-option-2"]').should('be.enabled');
          cy.get('[data-cy="selector-option-3"]').should('be.enabled');
          wrapper.setProps({ options: newOpts });
          cy.get('[data-cy="selector-option-1"]').should('be.enabled');
          cy.get('[data-cy="selector-option-2"]').should('be.disabled');
          cy.get('[data-cy="selector-option-3"]').should('be.enabled');
        });
    });
  });

  it('Verify that `selected` prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ selected: 'Two' });
          cy.get('[data-cy="selector-input"]').should('have.value', 'Two');
        });
    });
  });

  it('showValidity prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        showValidStyling: false,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-input"]').should(
            'not.have.class',
            'is-valid'
          );
          cy.get('[data-cy="selector-input"]').should(
            'not.have.class',
            'is-invalid'
          );

          wrapper.setProps({ showValidityStyling: true });

          cy.get('[data-cy="selector-input"]').should(
            'have.class',
            'is-invalid'
          );
        });
    });
  });

  it('Delete clears selection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        selected: 'Two',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should('have.value', 'Two');
        cy.get('[data-cy="selector-delete-button"]').click();
        cy.get('[data-cy="selector-input"]').should('have.value', null);
      });
  });

  it('Clicking add button goes to the addUrl clicking closePopup closes popup', () => {
    const readySpy = cy.spy().as('readySpy');
    const addClickedSpy = cy.spy().as('addClickedSpy');

    // when mounting, set the popupUrl to '' to avoid errors when testing
    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onAddClicked: addClickedSpy,
        onReady: readySpy,
        popupUrl: '',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-overlay"]').should('not.exist');
        cy.get('[data-cy="selector-popup"]').should('not.exist');
        cy.get('[data-cy="selector-closePopup"]').should('not.exist');
        cy.get('[data-cy="selector-popupIframe"]').should('not.exist');

        cy.get('[data-cy="selector-add-button"]').should('exist');
        cy.get('[data-cy="selector-add-button"]').click();

        cy.get('[data-cy="selector-overlay"]').should('exist');
        cy.get('[data-cy="selector-popup"]').should('exist');
        cy.get('[data-cy="selector-closePopup"]').should('exist');
        cy.get('[data-cy="selector-popupIframe"]')
          .should('exist')
          .should('have.attr', 'src', '');

        cy.get('[data-cy="selector-closePopup"]').click();
        cy.get('@addClickedSpy').should('have.been.calledOnce');
        cy.get('[data-cy="selector-overlay"]').should('not.exist');
        cy.get('[data-cy="selector-popup"]').should('not.exist');
        cy.get('[data-cy="selector-closePopup"]').should('not.exist');
        cy.get('[data-cy="selector-popupIframe"]').should('not.exist');
      });
  });
  it('Clicking add button disables background elements and close enables them', () => {
    const readySpy = cy.spy().as('readySpy');

    // when mounting, set the popupUrl to '' to avoid errors when testing
    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
        popupUrl: '',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').click();

        cy.get('[data-cy="selector-popupIframe"]')
          .should('exist')
          .should('not.have.attr', 'aria-hidden', 'true')
          .should('not.have.attr', 'tabindex', '-1');

        cy.window().then((window) => {
          const body = window.document.getElementsByTagName('body')[0];
          expect(body.getAttribute('tabindex')).to.equal('-1');
          expect(body.getAttribute('aria-hidden')).to.equal('true');
        });

        cy.get('[data-cy="selector-closePopup"]').click();
        cy.get('[data-cy="selector-popupIframe"]').should('not.exist');

        cy.window().then((window) => {
          const body = window.document.getElementsByTagName('body')[0];
          expect(body.getAttribute('tabindex')).to.not.equal('-1');
          expect(body.getAttribute('aria-hidden')).to.not.equal('true');
        });
      });
  });
});
