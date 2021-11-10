describe('AccountPage', () => {
  beforeEach(() => {
    cy.globalIntercepts();
  });
  it('should have proper meta tags', () => {
    cy.visit('/cosmic');
    cy.get('meta[property="og:image"]')
      .should('have.attr', 'content')
      .should('not.be.empty');
    cy.get('meta[property="og:title"]')
      .should('have.attr', 'content')
      .should('not.be.empty');
    cy.get('meta[property="og:description"]')
      .should('have.attr', 'content')
      .should('not.be.empty');
    cy.get('meta[name="twitter:image"]')
      .should('have.attr', 'content')
      .should('not.be.empty');
    cy.get('meta[name="twitter:title"]')
      .should('have.attr', 'content')
      .should('not.be.empty');
    cy.get('meta[name="twitter:description"]')
      .should('have.attr', 'content')
      .should('not.be.empty');
  });
  describe('Anonymous', () => {
    it('should load the page', () => {
      cy.visit('/cosmic');
      cy.gql({ events: { name: 'Cool' } });
      cy.get('[data-test-id=account-name').should('exist');
      cy.get('[data-test-id=account-bio').should('exist');
      // cy.get('[data-test-id=account-eventcount').should('exist');
      // cy.get('[data-test-id=account-supporterscount').should('exist');
      // cy.get('[data-test-id=account-viewcount').should('exist');
      cy.get('[data-test-id=share-button').should('exist');
      // cy.get('[data-test-id=events').should('exist');
      cy.get('[data-test-id=account-pricing').should('exist');
      // cy.get('[data-test-id=account-tags').should('exist');
    });
    it('should show success modal after subcribe', () => {
      cy.visit('/cosmic?action=account.subscribe');
      cy.findByText("Congrats, you're subscribed!").should('exist');
      // cy.get('[data-test-id=links').should('exist');
    });
    it('should show success modal after purchase', () => {
      cy.visit('/cosmic?action=event.purchase');
      cy.findByText("Congrats, you're in!").should('exist');
    });
  });
  describe('User', () => {
    it('should load the page', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic?tab=media');
      cy.gql({ events: { name: 'Cool' } });
      cy.get('[data-test-id=menu-profile').should('exist');
      cy.get('[data-test-id=link-create-event').should('exist');
      cy.get('[data-test-id=account-name').should('exist');
      cy.get('[data-test-id=account-bio').should('exist');
      cy.get('[data-test-id=share-button').should('exist');
      cy.get('[data-test-id=events').should('exist');
      cy.get('[data-test-id=account-pricing').should('exist');
      // cy.get('[data-test-id=account-tags').should('exist');
    });
    it('should also load the manage page', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/manage');
      cy.get('[data-test-id=account-menu').should('exist');
    });
  });
  describe('Admin', () => {
    it('should load the page', () => {
      cy.login('jeff@viz.ee');
      cy.visit('/cosmic?tab=media');
      cy.get('[data-test-id=menu-profile').should('exist');
      cy.get('[data-test-id=link-create-event').should('exist');
      cy.get('[data-test-id=account-name').should('exist');
      cy.get('[data-test-id=account-bio').should('exist');
      cy.get('[data-test-id=share-button').should('exist');
      cy.get('[data-test-id=events').should('exist');
      cy.get('[data-test-id=account-pricing').should('exist');
      // cy.get('[data-test-id=account-tags').should('exist');

      cy.visit('/cosmic/manage');
      cy.get('[data-test-id=account-menu').should('exist');
    });
  });
});
