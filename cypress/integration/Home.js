describe('HomePage', () => {
  beforeEach(() => {
    cy.globalIntercepts();
  });
  describe('Anonymous', () => {
    it('should load', () => {
      cy.visit('/');
      cy.get('[data-test-id=menu-login').should('exist');
      cy.get('[data-test-id=menu-profile').should('not.exist');
      cy.get('[data-test-id=menu-admin').should('not.exist');
      cy.get('[data-test-id=menu-tickets').should('not.exist');
      cy.get('[data-test-id=event-card').should('exist');
    });
  });
  describe('User', () => {
    it('should load', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/');
      cy.get('[data-test-id=menu-login').should('not.exist');
      cy.get('[data-test-id=menu-profile').should('exist');
    });
    it('should show subscriptions when user has a stripe customer id', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/');
      cy.get('[data-test-id=menu-profile').click();
      cy.get('[data-test-id=menu-subscriptions]').should('have.attr', 'href');
    });
  });
  describe('Admin', () => {
    it('should load', () => {
      cy.login('jeff@viz.ee');
      cy.visit('/');
      cy.get('[data-test-id=menu-login').should('not.exist');
      cy.get('[data-test-id=menu-profile').should('exist');
    });
  });
});