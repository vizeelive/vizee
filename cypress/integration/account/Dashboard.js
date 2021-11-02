describe('Dashboard', () => {
  beforeEach(() => {
    cy.globalIntercepts();
  });
  describe('Anonymous', () => {
    it('should pass happy path', () => {
      cy.visit('/cosmic/manage/dashboard');
      cy.get('[data-test-id=account-dashboard]').should('not.exist');
    });
  });
  describe('User', () => {
    it('should pass happy path', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/manage/dashboard');
      cy.get('[data-test-id=account-dashboard]').should('exist');
    });
  });
  describe('Admin', () => {
    it('should pass happy path', () => {
      cy.login('jeff@viz.ee');
      cy.visit('/cosmic/manage/dashboard');
      cy.get('[data-test-id=account-dashboard]').should('exist');
    });
  });
});
