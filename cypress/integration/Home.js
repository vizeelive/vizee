describe('HomePage', () => {
  describe('Anonymous', () => {
    it('should pass the happy path', () => {
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('AnonGetEvents', { fixture: 'AnonGetEvents' });
      cy.visit('/');
      // menu items
      cy.get('[data-test-id=menu-login').should('exist');
      cy.get('[data-test-id=menu-profile').should('not.exist');
      cy.get('[data-test-id=menu-admin').should('not.exist');
      cy.get('[data-test-id=menu-tickets').should('not.exist');
      cy.get('[data-test-id=event-card').should('exist');
    });
    // it('should not show event that are excluded from the network via (on_network)', () => {});
  });
  describe('User', () => {
    beforeEach(() => {
      cy.setCookie('test_role', 'user');
    });
    it('should pass the happy path', () => {
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('AnonGetEvents', { fixture: 'AnonGetEvents' });
      cy.graphql('FinishSignup', { fixture: 'FinishSignup' });
      cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
      cy.graphql('GetHomeData', { fixture: 'GetHomeData' });
      cy.visit('/');
      // menu items
      cy.get('[data-test-id=menu-login').should('not.exist');
      cy.get('[data-test-id=menu-profile').should('exist');
    });
    it('should show subscriptions when user has a stripe customer id', () => {
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('AnonGetEvents', { fixture: 'AnonGetEvents' });
      cy.graphql('FinishSignup', { fixture: 'FinishSignup' });
      cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
      cy.graphql('GetHomeData', { fixture: 'GetHomeData' });
      cy.visit('/');
      cy.get('[data-test-id=menu-profile').click();
      cy.get('[data-test-id=menu-subscriptions]').should(
        'have.attr',
        'href',
        'https://example.com/stripe'
      );
    });
  });
  describe('Admin', () => {
    before(() => {
      cy.setCookie('test_role', 'admin');
    });
    it('should pass the happy path', () => {
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('AnonGetEvents', { fixture: 'AnonGetEvents' });
      cy.graphql('FinishSignup', { fixture: 'FinishSignup' });
      cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
      cy.graphql('GetHomeData', { fixture: 'GetHomeData' });
      cy.visit('http://localhost:3000');
      // menu items
      cy.get('[data-test-id=menu-login').should('not.exist');
      cy.get('[data-test-id=menu-profile').should('exist');
    });
  });
});
