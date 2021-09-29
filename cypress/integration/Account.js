describe('AccountPage', () => {
  describe('Anonymous', () => {
    beforeEach(() => {
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('GetAccount', { fixture: 'GetAccount' });
    });
    it('should pass the happy path', () => {
      cy.visit('/creator');
      cy.get('[data-test-id=account-name').should('exist');
      cy.get('[data-test-id=account-bio').should('exist');
      cy.get('[data-test-id=share-button').should('exist');
      cy.get('[data-test-id=events').should('exist');
      // cy.get('[data-test-id=links').should('exist');
    });
    it('should show success modal after subcribe', () => {
      cy.visit('/creator?action=account.subscribe');
      cy.findByText("Congrats, you're subscribed!").should('exist');
      // cy.get('[data-test-id=links').should('exist');
    });
    it('should show success modal after purchase', () => {
      cy.visit('/creator?action=event.purchase');
      cy.findByText("Congrats, you're in!").should('exist');
      // cy.get('[data-test-id=links').should('exist');
    });
    it('should show buy/subscribe button when stripe is setup', () => {
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('FinishSignup', { fixture: 'FinishSignup' });
      cy.graphql('GetAccount', { fixture: 'GetAccount' });
      cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
      cy.graphql('GetAccountByUsername', {
        fixture: 'GetAccountByUsername'
      });
      cy.visit('/36bjkzqu7e');
      cy.get('[data-test-id=button-buy').should('exist');
    });
  });
  describe('User', () => {
    beforeEach(() => {
      cy.setCookie('test_role', 'user');
    });
    it('should pass the happy path', () => {
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('GetAccount', { fixture: 'GetAccount' });
      cy.graphql('FinishSignup', { fixture: 'FinishSignup' });
      cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
      cy.graphql('GetAccountByUsername', {
        fixture: 'GetAccountByUsername'
      });
      cy.visit('/36bjkzqu7e/manage');
      cy.get('[data-test-id=account-menu').should('exist');
      cy.get('[data-test-id=link-create-event').should('exist');
      cy.get('[data-test-id=account-name').should('exist');
      cy.get('[data-test-id=account-bio').should('exist');
      cy.get('[data-test-id=share-button').should('exist');
      cy.get('[data-test-id=events').should('exist');
      // cy.get('[data-test-id=links').should('exist');
    });
    it('should show subscribe button when not already subscribed', () => {
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('FinishSignup', { fixture: 'FinishSignup' });
      cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
      cy.graphql('GetAccountByUsername', {
        fixture: 'GetAccountByUsername'
      });
      cy.fixture('GetAccount').then((fixture) => {
        fixture.accounts[0].access = [];
        cy.graphql('GetAccount', fixture);
      });
      cy.visit('/36bjkzqu7e/manage');
      cy.get('[data-test-id=button-buy').should('exist');
    });

    it('should not show subscribe button when already subscribed', () => {
      cy.graphql('Accounts', { fixture: 'Accounts' });
      cy.graphql('FinishSignup', { fixture: 'FinishSignup' });
      cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
      cy.graphql('GetAccountByUsername', {
        fixture: 'GetAccountByUsername'
      });
      cy.fixture('GetAccount').then((fixture) => {
        fixture.accounts[0].access = [{ id: 'a1b2c3', __typename: 'access' }];
        cy.graphql('GetAccount', fixture);
      });
      cy.visit('/36bjkzqu7e');
      cy.get('[data-test-id=button-buy').should('not.exist');
    });
  });
  // describe.skip('Admin', () => {
  //   beforeEach(() => {
  //     cy.setCookie('test_role', 'admin');
  //   });
  //   it('should pass the happy path', () => {
  //     cy.graphql('Accounts', { fixture: 'Accounts' });
  //     cy.graphql('FinishSignup', { fixture: 'FinishSignup' });
  //     cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
  //     cy.graphql('AdminGetAccountByUsername', {
  //       fixture: 'AdminGetAccountByUsername'
  //     });
  //     cy.visit('/mau5trap/manage');
  //     cy.get('[data-test-id=account-menu').should('exist');
  //     cy.get('[data-test-id=link-create-event').should('exist');
  //     cy.get('[data-test-id=account-name').should('exist');
  //     cy.get('[data-test-id=account-bio').should('exist');
  //     cy.get('[data-test-id=share-button').should('exist');
  //     cy.get('[data-test-id=events').should('exist');
  //     cy.get('[data-test-id=links').should('exist');
  //   });
  //   it('should show products if shopify is set up', () => {
  //     cy.graphql('Accounts', { fixture: 'Accounts' });
  //     cy.graphql('FinishSignup', { fixture: 'FinishSignup' });
  //     cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
  //     cy.graphql('AdminGetAccountByUsername', {
  //       fixture: 'AdminGetAccountByUsername'
  //     });
  //     cy.fixture('GetAccount').then((fixture) => {
  //       fixture.accounts[0].shopify_domain = 'vizeelive.myshopify.com';
  //       cy.graphql('GetAccount', fixture);
  //     });
  //     cy.visit('/creator');
  //     cy.get('[data-test-id=account-products').should('exist');
  //   });
  // });
});
