describe('EventPage', () => {
  describe('Anonymous', () => {
    it('should pass happy path', () => {
      cy.graphql('AnonEventsReport', { fixture: 'AnonEventsReport' });
      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.findByRole('button', { name: /Buy Ticket/i }).should('exist');
      cy.findByRole('button', { name: /Share/i }).should('exist');
      cy.get('[data-test-id=event-name').should('not.be.empty');
      cy.get('[data-test-id=event-start').should('not.be.empty');
      cy.get('[data-test-id=account-name').should('not.be.empty');
      cy.get('[data-test-id=comments').should('not.be.empty');
    });
  });
});
