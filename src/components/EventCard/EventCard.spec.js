import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';

import EventCard from './index';
import Mapper from '../../services/mapper';

jest.mock('moment', () => () => ({
  format: () => 'October 22nd 4:19 pm',
  isBetween: () => true
}));

let event;
let user;

describe('EventCard', () => {
  beforeEach(() => {
    user = {
      sub: 'auth0|5f882bfe4361420078ecdcc0',
      isAdmin: false
    };
    event = Mapper({
      __typename: 'events',
      id: '6a6ec6d1-93cc-4b71-9e0e-845253ab0dbd',
      name: 'Live',
      start: '2020-10-22T21:19:47.865+00:00',
      photo:
        'https://dam-media.s3.amazonaws.com/dd/e2b1b7e7924e77a73f27b198b5dfc1/1.jpg',
      preview: null,
      type: 'live',
      price: '$0.00',
      end: '2020-10-22T21:19:47.865+00:00',
      location: null,
      location_pos: null,
      published: true,
      account: {
        __typename: 'accounts',
        id: 'c5fcd960-19eb-4e4f-88d8-d75224e89e83',
        name: 'Trey Anastasio Band',
        username: 'treyanastasio',
        photo:
          'https://dam-media.s3.amazonaws.com/d8/f20511775243f5b07698c05276ced9/39_Original.png',
        users: [
          {
            __typename: 'accounts_users',
            user: {
              __typename: 'users',
              id: 'auth0|5f882bfe4361420078ecdcc0'
            }
          },
          {
            __typename: 'accounts_users',
            user: {
              __typename: 'users',
              id: 'auth0|5f8838b47119bc007640b4af'
            }
          },
          {
            __typename: 'accounts_users',
            user: {
              __typename: 'users',
              id: 'google-oauth2|112768500105429624141'
            }
          }
        ]
      },
      category: {
        __typename: 'categories',
        id: '06a15dcd-03cb-4dcd-b052-b9d8a84212cc',
        name: 'Music'
      },
      access: [{}],
      favorites: [
        {
          __typename: 'favorites',
          id: 'c6e23e10-9b5a-4671-851c-62d5f531584e'
        }
      ]
    });
  });
  describe('as anonymous', () => {
    it('should not render unpublished', () => {
      event.published = false;
      render(
        <Router>
          <EventCard user={null} event={event} />
        </Router>
      );
      expect(screen.queryByText('Unpublished')).not.toBeInTheDocument();
    });
  });
  describe('as an admin', () => {
    it('should render an edit button', () => {
      user.isAdmin = true;
      render(
        <Router>
          <EventCard user={user} event={event} />
        </Router>
      );
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
  });
  describe('as a user', () => {
    it('should render a card', () => {
      render(
        <Router>
          <EventCard user={user} event={event} />
        </Router>
      );
      expect(screen.getByText('Live')).toBeInTheDocument();
      expect(screen.getByText('October 22nd 4:19 pm')).toBeInTheDocument();
      expect(screen.getByText('Trey Anastasio Band')).toBeInTheDocument();
      expect(screen.getByAltText('Trey Anastasio Band')).toBeInTheDocument();

      expect(screen.getByTestId('favorite')).toBeInTheDocument();

      // tags
      expect(screen.getByText('LIVE NOW')).toBeInTheDocument();
      // expect(screen.getByText('Broadcast')).toBeInTheDocument();
      // expect(screen.getByText('Purchased')).toBeInTheDocument();
      // expect(screen.getByText('Free!')).toBeInTheDocument();

      userEvent.click(screen.getByText('Live'));
    });
    // it('should render Video tag', () => {
    //   event.type = 'video';
    //   render(
    //     <Router>
    //       <EventCard user={user} event={event} />
    //     </Router>
    //   );
    //   expect(screen.getByText('Video')).toBeInTheDocument();
    // });
    // it('should render unpublished', () => {
    //   event.published = false;
    //   render(
    //     <Router>
    //       <EventCard user={user} event={event} />
    //     </Router>
    //   );
    //   expect(screen.getByText('Unpublished')).toBeInTheDocument();
    // });
  });
});
