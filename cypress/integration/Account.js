describe('AccountPage', () => {
  describe('Anonymous', () => {
    it('should pass the happy path', () => {
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('GetAccount', { fixture: 'GetAccount' });
      cy.visit('/creator');
      cy.get('[data-test-id=account-name').should('exist');
      cy.get('[data-test-id=account-bio').should('exist');
      cy.get('[data-test-id=share-button').should('exist');
      cy.get('[data-test-id=events').should('exist');
      cy.get('[data-test-id=links').should('exist');
    });
  });
  describe('User', () => {
    it('should pass the happy path', () => {
      cy.setCookie('test_role', 'user');
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('GetAccount', { fixture: 'GetAccount' });
      cy.graphql('FinishSignup', { fixture: 'FinishSignup' });
      cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
      cy.graphql('GetAccountByUsername', { fixture: 'GetAccountByUsername' });
      cy.visit('/mau5trap/manage');
      cy.get('[data-test-id=account-menu').should('exist');
      cy.get('[data-test-id=link-create-event').should('exist');
      cy.get('[data-test-id=account-name').should('exist');
      cy.get('[data-test-id=account-bio').should('exist');
      cy.get('[data-test-id=share-button').should('exist');
      cy.get('[data-test-id=events').should('exist');
      cy.get('[data-test-id=links').should('exist');
    });
  });
  describe('Admin', () => {
    it('should pass the happy path', () => {
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('GetAccount', { fixture: 'GetAccount' });
      cy.graphql('FinishSignup', { fixture: 'FinishSignup' });
      cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
      cy.graphql('AdminGetAccountByUsername', {
        fixture: 'AdminGetAccountByUsername'
      });
      cy.setCookie('test_role', 'admin');
      cy.visit('/mau5trap/manage');
      cy.get('[data-test-id=account-menu').should('exist');
      cy.get('[data-test-id=link-create-event').should('exist');
      cy.get('[data-test-id=account-name').should('exist');
      cy.get('[data-test-id=account-bio').should('exist');
      cy.get('[data-test-id=share-button').should('exist');
      cy.get('[data-test-id=events').should('exist');
      cy.get('[data-test-id=links').should('exist');
    });
  });
});
