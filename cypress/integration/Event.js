describe('EventPage', () => {
  beforeEach(() => {
    cy.globalIntercepts();
  });
  describe('Anonymous', () => {
    it('should pass happy path', () => {
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.findByRole('button', { name: /Buy Ticket/i }).should('exist');
      cy.findByRole('button', { name: /Share/i }).should('exist');
      cy.get('[data-test-id=event-name').should('not.be.empty');
      cy.get('[data-test-id=event-start').should('not.be.empty');
      cy.get('[data-test-id=event-description').should('not.be.empty');
      cy.get('[data-test-id=event-views').should('not.be.empty');
      cy.get('[data-test-id=event-location').should('not.be.empty');
      cy.get('[data-test-id=account-name').should('not.be.empty');
      // cy.get('[data-test-id=comments').should('not.be.empty');
    });
  });
  describe('User', () => {
    it('should pass happy path', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.findByRole('button', { name: /Buy Ticket/i }).should('exist');
      cy.findByRole('button', { name: /Share/i }).should('exist');
      cy.get('[data-test-id=event-name').should('not.be.empty');
      cy.get('[data-test-id=event-start').should('not.be.empty');
      cy.get('[data-test-id=event-description').should('not.be.empty');
      cy.get('[data-test-id=event-views').should('not.be.empty');
      cy.get('[data-test-id=event-location').should('not.be.empty');
      cy.get('[data-test-id=account-name').should('not.be.empty');
      cy.get('[data-test-id=comments').should('not.be.empty');
    });
    it('should see countdown timer when event is in future', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.gql({
        events_report: {
          start: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
          end: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000)
        }
      });
      cy.get('[data-test-id=event-countdown').should('exist');
    });
    it('should be able to see STREAM STARTING tag when live event inside time window', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.gql({
        events_report: {
          type: 'live',
          start: new Date(),
          end: new Date().getTime() + 6 * 24 * 60 * 60 * 1000
        }
      });
      cy.findByText('Stream Starting...').should('exist');
    });
    it('should be able to see STREAM ENDED tag when live event has ended and there is no recording', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.gql({
        events_report: {
          type: 'live',
          stream_type: 'ivs_fast',
          status: 'completed',
          start: new Date(),
          end: new Date().getTime() + 6 * 24 * 60 * 60 * 1000
        }
      });
      cy.findByText('Stream Ended').should('exist');
    });
    it('should see Start Stream when event is broadcast', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.gql({
        events_report: {
          type: 'live',
          start: new Date().getTime() + 5 * 24 * 60 * 60 * 1000,
          end: new Date().getTime() + 6 * 24 * 60 * 60 * 1000
        }
      });
      cy.findByRole('button', { name: /Start Live Stream/i }).should('exist');
    });
    it('should be able to see account photo when no event photo/video is available', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.gql({
        events_report: {
          photo: null,
          preview: null
        }
      });
      cy.get('[data-test-id=event-preview-image').should('be.visible');
    });
    it('should be able to see video preview over photo preview', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.gql({
        events_report: {
          preview: 'https://example.com/video.mp4'
        }
      });
      cy.findByText('Preview').should('exist');
      cy.get('[data-test-id=event-preview-video').should('exist');
    });
    it('should be able to see event image preview when there is no video preview', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.gql({
        events_report: {
          preview: null,
          account: {
            photo: null
          }
        }
      });
      cy.get('[data-test-id=event-preview-image').should('exist');
    });
    it('should see prerecorded video when has access', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.gql({
        events_report: {
          type: 'video',
          access: [{ id: 'a1b2c3' }],
          start: new Date(),
          end: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
          account: {
            photo: null
          }
        }
      });
      cy.get('[data-test-id=event-video-vod').should('exist');
    });
    it('should see live video and comments when has access', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.gql({
        events_report: {
          type: 'live',
          stream_type: 'mux',
          access: [{ id: 'a1b2c3' }],
          start: new Date(),
          end: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
        }
      });
      cy.get('[data-test-id=event-video-live').should('exist');
      cy.get('[data-test-id=comments-editor').should('exist');
    });
    it('should see conference when has access', () => {
      cy.login('jeff@loiselles.com');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.gql({
        events_report: {
          type: 'conference',
          access: [{ id: 'a1b2c3' }],
          start: new Date(),
          end: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
        }
      });
      cy.get('[data-test-id=event-video-conference').should('exist');
    });
    // it.only('should be able to see AVAILABLE NOW tag when video event inside time window and is live or has recording', () => {
    //   cy.login('jeff@loiselles.com');
    //   cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
    //   cy.gql({
    //     events_report: {
    //       type: 'video',
    //       start: new Date().getTime(),
    //       end: new Date().getTime() + 6 * 24 * 60 * 60 * 1000
    //     }
    //   });
    //   cy.findByText('Available Now').should('exist');
    // });
  });
  describe('Admin', () => {
    it('should pass happy path', () => {
      cy.login('jeff@viz.ee');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.findByRole('button', { name: /Buy Ticket/i }).should('exist');
      cy.findByRole('button', { name: /Share/i }).should('exist');
      cy.get('[data-test-id=event-name').should('not.be.empty');
      cy.get('[data-test-id=event-start').should('not.be.empty');
      cy.get('[data-test-id=event-description').should('not.be.empty');
      cy.get('[data-test-id=event-views').should('not.be.empty');
      cy.get('[data-test-id=event-location').should('not.be.empty');
      cy.get('[data-test-id=account-name').should('not.be.empty');
      cy.get('[data-test-id=comments').should('not.be.empty');
    });
    it('should see Start Stream when event is broadcast', () => {
      cy.login('jeff@viz.ee');
      cy.visit('/cosmic/097d733d-9000-4db1-9db2-3ea7810e4a5e');
      cy.gql({
        events_report: {
          type: 'live',
          status: 'completed',
          start: new Date().getTime() + 5 * 24 * 60 * 60 * 1000,
          end: new Date().getTime() + 6 * 24 * 60 * 60 * 1000
        }
      });
      cy.findByRole('button', { name: /Start Live Stream/i }).should('exist');
    });
  });
});
//   describe('User', () => {
//     describe('Cover', () => {
//       it('should be able to see dummy cover photo when no event photo/video and account photo available', () => {
//         cy.fixture('UserEventsReport').then((fixture) => {
//           delete fixture.events_report[0].photo;
//           delete fixture.events_report[0].preview;
//           delete fixture.events_report[0].account.photo;
//           cy.graphql('UserEventsReport', fixture);
//         });
//         cy.visit('creator/d4312db8-4f09-431b-b8c2-47feb4b607d7');
//         cy.get('[data-test-id=event-preview-image').should('be.visible');
//         cy.get('[data-test-id=event-preview-image').should(
//           'have.attr',
//           'src',
//           'https://dummyimage.com/1216x684/000/fff.png&text=dfdsfdsf'
//         );
//       });
//     });
//     it('should see buy button when has no access', () => {
//       cy.fixture('UserEventsReport').then((fixture) => {
//         fixture.events_report[0].account.username = 'random';
//         cy.graphql('UserEventsReport', fixture);
//       });
//       cy.visit('creator/d4312db8-4f09-431b-b8c2-47feb4b607d7');
//       cy.findByRole('button', { name: /Buy Ticket/i }).should('exist');
//     });
//     it('should not see buy button when has full account access', () => {
//       cy.fixture('UserEventsReport').then((fixture) => {
//         fixture.events_report[0].account.access = [{ id: 'a1b2c3' }];
//         cy.graphql('UserEventsReport', fixture);
//       });
//       cy.visit('creator/d4312db8-4f09-431b-b8c2-47feb4b607d7');
//       cy.findByRole('button', { name: /Buy Ticket/i }).should('not.exist');
//     });
//     it('should not see buy button when has event access', () => {
//       cy.fixture('UserEventsReport').then((fixture) => {
//         fixture.events_report[0].access = [{ id: 'a1b2c3' }];
//         cy.graphql('UserEventsReport', fixture);
//       });
//       cy.visit('creator/d4312db8-4f09-431b-b8c2-47feb4b607d7');
//       cy.findByRole('button', { name: /Buy Ticket/i }).should('not.exist');
//     });
//   });
// });
