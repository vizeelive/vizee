describe('Affiliate', () => {
  beforeEach(() => {
    cy.globalIntercepts();
  });
  describe('Anonymous', () => {
    it('should pass happy path', () => {
      cy.visit('/cosmic/manage/affiliate');
      cy.get('[data-test-id=account-affiliate]').should('not.exist');
    });
  });
  describe('User', () => {
    it('should pass happy path', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/manage/affiliate');
      cy.get('[data-test-id=account-affiliate]').should('exist');
    });
  });
  describe('Admin', () => {
    it('should pass happy path', () => {
      cy.login('jeff@viz.ee');
      cy.visit('/cosmic/manage/affiliate');
      cy.get('[data-test-id=account-affiliate]').should('exist');
    });
  });
});
