describe('Home', () => {
  describe('Anonymous', () => {
    it('should pass the happy path', () => {
      cy.visit('http://localhost:3000');

      // menu items
      cy.get('[data-test-id=menu-login').should('exist');
      cy.get('[data-test-id=menu-logout').should('not.exist');
      cy.get('[data-test-id=menu-admin').should('not.exist');
      cy.get('[data-test-id=menu-tickets').should('not.exist');
      cy.get('[data-test-id=menu-account').should('not.exist');

      // navigate to event
      cy.get('[data-test-id=event-card').should('exist');
      cy.get('[data-test-id=event-card').first().click();
      cy.findByRole('button', { name: /Buy Ticket/i }).should('exist');
      cy.findByRole('button', { name: /Share/i }).should('exist');
      cy.get('[data-test-id=event-name').should('exist');
      cy.get('[data-test-id=event-start').should('exist');
      cy.get('[data-test-id=account-name').should('exist');
    });
  });
});
