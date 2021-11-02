describe.skip('Traffic', () => {
  beforeEach(() => {
    cy.globalIntercepts();
  });
  describe('Anonymous', () => {
    it('should pass happy path', () => {
      cy.visit('/cosmic/manage/traffic/cc54e7a2-e398-4eda-9807-877bf3536dbb');
      cy.get('[data-test-id=account-traffic]').should('not.exist');
    });
  });
  describe('User', () => {
    it('should pass happy path', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/manage/traffic/cc54e7a2-e398-4eda-9807-877bf3536dbb');
      cy.get('[data-test-id=account-traffic]').should('exist');
    });
  });
  describe('Admin', () => {
    it('should pass happy path', () => {
      cy.login('jeff@viz.ee');
      cy.visit('/cosmic/manage/traffic/cc54e7a2-e398-4eda-9807-877bf3536dbb');
      cy.get('[data-test-id=account-traffic]').should('exist');
    });
  });
});
