describe('Home', () => {
  describe('Anonymous', () => {
    it('should render the homepage', () => {
      cy.visit('/');
      cy.get('[data-test-id=get-started').should('exist');
      cy.get('[data-test-id=menu-login').should('exist');
      cy.get('[data-test-id=menu-profile').should('not.exist');
      cy.get('[data-test-id=menu-admin').should('not.exist');
      cy.get('[data-test-id=menu-tickets').should('not.exist');
      cy.get('[data-test-id=event-card').should('exist');
    });
  });
  describe('User', () => {
    before(() => {
      cy.login();
    });
    it('should render the homepage', () => {
      cy.visit('/');
      cy.get('[data-test-id=get-started').should('not.exist');
      cy.get('[data-test-id=menu-login').should('not.exist');
      cy.get('[data-test-id=menu-profile').should('exist');
    });
  });
  describe('Admin', () => {
    before(() => {
      cy.login('admin');
    });
    it('should render the homepage', () => {
      cy.visit('/');
      cy.get('[data-test-id=get-started').should('not.exist');
      cy.get('[data-test-id=menu-login').should('not.exist');
      cy.get('[data-test-id=menu-profile').should('exist');
    });
  });
});
