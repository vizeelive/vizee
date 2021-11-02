describe('Settings', () => {
  beforeEach(() => {
    cy.globalIntercepts();
  });
  describe('Anonymous', () => {
    it('should pass happy path', () => {
      cy.visit(
        '/cosmic/manage/settings/cc54e7a2-e398-4eda-9807-877bf3536dbb/account'
      );
      cy.get('[data-test-id=account-settings]').should('not.exist');
    });
  });
  describe('User', () => {
    it('should pass happy path', () => {
      cy.login('jeff@loiselles.com');
      cy.visit(
        '/cosmic/manage/settings/cc54e7a2-e398-4eda-9807-877bf3536dbb/account'
      );
      cy.get('[data-test-id=account-settings]').should('exist');
    });
  });
  describe('Admin', () => {
    it('should pass happy path', () => {
      cy.login('jeff@viz.ee');
      cy.visit(
        '/cosmic/manage/settings/cc54e7a2-e398-4eda-9807-877bf3536dbb/account'
      );
      cy.get('[data-test-id=account-settings]').should('exist');
    });
  });
});
