describe('Pricing', () => {
  beforeEach(() => {
    cy.globalIntercepts();
  });
  describe('Anonymous', () => {
    it('should pass happy path', () => {
      cy.visit('/cosmic/manage/products/cc54e7a2-e398-4eda-9807-877bf3536dbb');
      cy.get('[data-test-id=account-products]').should('not.exist');
    });
  });
  describe('User', () => {
    it('should pass happy path', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/manage/products/cc54e7a2-e398-4eda-9807-877bf3536dbb');
      cy.get('[data-test-id=account-products]').should('exist');
    });
  });
  describe('Admin', () => {
    it('should pass happy path', () => {
      cy.login('jeff@viz.ee');
      cy.visit('/cosmic/manage/products/cc54e7a2-e398-4eda-9807-877bf3536dbb');
      cy.get('[data-test-id=account-products]').should('exist');
    });
  });
});
