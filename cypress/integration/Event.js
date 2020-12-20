describe('EventPage', () => {
  describe('Anonymous', () => {
    it('should pass happy path', () => {
      cy.graphql('AnonEventsReport', { fixture: 'AnonEventsReport' });
      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.findByRole('button', { name: /Buy Ticket/i }).should('exist');
      cy.findByRole('button', { name: /Share/i }).should('exist');
      cy.get('[data-test-id=event-name').should('not.be.empty');
      cy.get('[data-test-id=event-start').should('not.be.empty');
      cy.get('[data-test-id=account-name').should('not.be.empty');
      cy.get('[data-test-id=comments').should('not.be.empty');
    });
  });
  describe('User', () => {
    beforeEach(() => {
      cy.setCookie('test_role', 'user');
      cy.graphql('MyAccounts', { fixture: 'MyAccounts' });
    });
    it('should pass happy path', () => {
      cy.graphql('UserEventsReport', { fixture: 'UserEventsReport' });
      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.findByRole('button', { name: /Buy Ticket/i }).should('exist');
      cy.findByRole('button', { name: /Follow/i }).should('exist');
      cy.findByRole('button', { name: /Share/i }).should('exist');
      cy.get('[data-test-id=event-name').should('not.be.empty');
      cy.get('[data-test-id=event-start').should('not.be.empty');
      cy.get('[data-test-id=account-name').should('not.be.empty');
      cy.get('[data-test-id=comments').should('not.be.empty');
    });
    it('should be able to see LIVE NOW tag', () => {
      cy.fixture('UserEventsReport').then((fixture) => {
        fixture.events_report[0].start = new Date();
        fixture.events_report[0].end = new Date(
          new Date().getTime() + 5 * 24 * 60 * 60 * 1000
        );
        cy.graphql('UserEventsReport', fixture);
      });
      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.findByText('LIVE NOW').should('exist');
    });
    it('should be able to see video preview', () => {
      cy.fixture('UserEventsReport').then((fixture) => {
        fixture.events_report[0].preview = 'https://example.com/video.mp4';
        cy.graphql('UserEventsReport', fixture);
      });

      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.findByText('PREVIEW').should('exist');
      cy.get('[data-test-id=event-preview-video').should('exist');
    });
    it('should be able to see image preview', () => {
      cy.fixture('UserEventsReport').then((fixture) => {
        delete fixture.events_report[0].preview;
        cy.graphql('UserEventsReport', fixture);
      });

      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.findByText('PREVIEW').should('exist');
      cy.get('[data-test-id=event-preview-image').should('exist');
    });
    it('should see buy button when has no access', () => {
      cy.graphql('UserEventsReport', { fixture: 'UserEventsReport' });
      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.findByRole('button', { name: /Buy Ticket/i }).should('exist');
    });
    it('should not see buy button when has full account access', () => {
      cy.fixture('UserEventsReport').then((fixture) => {
        fixture.events_report[0].account.access = [{ id: 'a1b2c3' }];
        cy.graphql('UserEventsReport', fixture);
      });
      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.findByRole('button', { name: /Buy Ticket/i }).should('not.exist');
    });
    it('should not see buy button when has event access', () => {
      cy.fixture('UserEventsReport').then((fixture) => {
        fixture.events_report[0].access = [{ id: 'a1b2c3' }];
        cy.graphql('UserEventsReport', fixture);
      });
      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.findByRole('button', { name: /Buy Ticket/i }).should('not.exist');
    });
    it('should see live video when has access', () => {
      cy.fixture('UserEventsReport').then((fixture) => {
        fixture.events_report[0].type = 'live';
        fixture.events_report[0].access = [{ id: 'a1b2c3' }];
        fixture.events_report[0].start = new Date();
        fixture.events_report[0].end = new Date(
          new Date().getTime() + 5 * 24 * 60 * 60 * 1000
        );
        cy.graphql('UserEventsReport', fixture);
      });
      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.get('[data-test-id=event-video-live').should('exist');
    });
    it('should see conference when has access', () => {
      cy.fixture('UserEventsReport').then((fixture) => {
        fixture.events_report[0].type = 'conference';
        fixture.events_report[0].access = [{ id: 'a1b2c3' }];
        fixture.events_report[0].start = new Date();
        fixture.events_report[0].end = new Date(
          new Date().getTime() + 5 * 24 * 60 * 60 * 1000
        );
        cy.graphql('UserEventsReport', fixture);
      });
      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.get('[data-test-id=event-video-conference').should('exist');
    });
    it('should see prerecorded video when has access', () => {
      cy.fixture('UserEventsReport').then((fixture) => {
        fixture.events_report[0].type = 'video';
        fixture.events_report[0].access = [{ id: 'a1b2c3' }];
        fixture.events_report[0].start = new Date();
        fixture.events_report[0].end = new Date(
          new Date().getTime() + 5 * 24 * 60 * 60 * 1000
        );
        cy.graphql('UserEventsReport', fixture);
      });
      cy.visit('http://localhost:3000/creator/a1b2c3');
      cy.get('[data-test-id=event-video-vod').should('exist');
    });
    // should see countdown timer
  });
  // describe('Creator', () => {
  //   it('should pass happy path', () => {
  //     cy.graphql('AnonEventsReport', { fixture: 'AnonEventsReport' });
  //     cy.visit('http://localhost:3000/creator/a1b2c3');
  //     cy.findByRole('button', { name: /Buy Ticket/i }).should('exist');
  //     cy.findByRole('button', { name: /Share/i }).should('exist');
  //     cy.get('[data-test-id=event-name').should('not.be.empty');
  //     cy.get('[data-test-id=event-start').should('not.be.empty');
  //     cy.get('[data-test-id=account-name').should('not.be.empty');
  //     cy.get('[data-test-id=comments').should('not.be.empty');
  //   });
  // });
  // describe('Admin', () => {
  //   it('should pass happy path', () => {
  //     cy.graphql('AnonEventsReport', { fixture: 'AnonEventsReport' });
  //     cy.visit('http://localhost:3000/creator/a1b2c3');
  //     cy.findByRole('button', { name: /Buy Ticket/i }).should('exist');
  //     cy.findByRole('button', { name: /Share/i }).should('exist');
  //     cy.get('[data-test-id=event-name').should('not.be.empty');
  //     cy.get('[data-test-id=event-start').should('not.be.empty');
  //     cy.get('[data-test-id=account-name').should('not.be.empty');
  //     cy.get('[data-test-id=comments').should('not.be.empty');
  //   });
  // });
});
