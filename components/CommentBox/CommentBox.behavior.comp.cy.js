import CommentBox from '@comps/CommentBox/CommentBox.vue';

describe('Test the CommentBox behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check that the displayed text is trimmed after blur', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CommentBox, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.mount(CommentBox);
        cy.get('[data-cy="comment-input"]').type(
          '  \n \tThis is a\n\ttest comment.  \n  \t'
        );
        cy.get('[data-cy="comment-input"]').blur();
        cy.get('[data-cy="comment-input"]').should(
          'have.value',
          'This is a\n\ttest comment.'
        );
      });
  });

  it('Component reacts to changed comment prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CommentBox, {
      props: {
        comment: 'Test comment',
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="comment-input"]').should(
            'have.value',
            'Test comment'
          );

          wrapper.setProps({ comment: 'A different comment' });

          cy.get('[data-cy="comment-input"]').should(
            'have.value',
            'A different comment'
          );
        });
    });
  });
});
