import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Theme from '../../Theme';
import Mapper from '../../services/mapper';
import EventPage from './index';

// import useAffiliaute from '../../hooks/useAffiliate';
jest.mock('../../hooks/useAffiliate', () => {
    return {
      __esModule: true,
      default: () => {
          return {
            setAffiliateLoginUser: () => {},
            setAffiliateAccountId: () => {}
          };
      }
    };
});

// jest.mock('../components/FollowButton', () => {
//   return {
//     __esModule: true,
//     default: () => {
//       return <div>Follow</div>;
//     }
//   };
// });

// jest.mock('../components/Event/CommentsContainer', () => {
//   return {
//     __esModule: true,
//     default: () => {
//       return <div></div>;
//     }
//   };
// });

xdescribe('EventPage', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  });
  describe('Anonymous', () => {
    it('render event page with actions', () => {
      const loading = false;
      const error = false;
      const event = Mapper({
        __typename: 'events_report',
        id: 'b8a029c2-9d08-4abd-8a77-9fb6b3064b48',
        type: 'live',
        name: 'fdfdgd',
        start: '2020-10-22T21:38:41.825+00:00',
        end: '2020-10-22T21:38:41.825+00:00',
        price: '$1.00',
        photo: null,
        preview: null,
        video: null,
        description: null,
        transactions: 0,
        favorites: 0,
        views: 19,
        account: {
          __typename: 'accounts',
          id: '5758e4bc-83a2-4037-b7c9-e4978a6d2af2',
          name: 'Trombone Shorty',
          username: 'tromboneshorty',
          photo:
            'https://dam-media.s3.amazonaws.com/3c/dde14e247243daa247be2c969deff8/920x920.jpg',
          stripe_data: {}
        },
        transaction: []
      });
      const isMyAccount = false;
      const account = {};
      const user = null;
      const playerKey = 'a1b2c3';
      const videoJsOptions = {};
      const liveData = {};
      const handleBuy = () => {};
      const handleEdit = () => {};
      render(
        <Theme>
          <Router>
            <EventPage
              loading={loading}
              error={error}
              account={account}
              event={event}
              isMyAccount={isMyAccount}
              user={user}
              playerKey={playerKey}
              videoJsOptions={videoJsOptions}
              liveData={liveData}
              handleBuy={handleBuy}
              handleEdit={handleEdit}
            />
          </Router>
        </Theme>
      );
      expect(screen.queryByText('Share')).toBeInTheDocument();
      expect(screen.queryByText('Buy Ticket ($1.00)')).toBeInTheDocument();
      expect(screen.queryByText('Follow')).not.toBeInTheDocument();
    });
  });
  describe('User', () => {
    it('render event page with actions', () => {
      const loading = false;
      const error = false;
      const event = Mapper({
        __typename: 'events_report',
        id: 'b8a029c2-9d08-4abd-8a77-9fb6b3064b48',
        type: 'live',
        name: 'fdfdgd',
        start: '2020-10-22T21:38:41.825+00:00',
        end: '2020-10-22T21:38:41.825+00:00',
        price: '$1.00',
        photo: null,
        preview: null,
        video: null,
        description: null,
        transactions: 0,
        favorites: 0,
        views: 19,
        account: {
          __typename: 'accounts',
          id: '5758e4bc-83a2-4037-b7c9-e4978a6d2af2',
          name: 'Trombone Shorty',
          username: 'tromboneshorty',
          photo:
            'https://dam-media.s3.amazonaws.com/3c/dde14e247243daa247be2c969deff8/920x920.jpg',
          stripe_data: {}
        },
        transaction: []
      });
      const isMyAccount = false;
      const account = {};
      const user = {};
      const playerKey = 'a1b2c3';
      const videoJsOptions = {};
      const liveData = {};
      const handleBuy = () => {};
      const handleEdit = () => {};
      render(
        <Theme>
          <Router>
            <EventPage
              loading={loading}
              error={error}
              account={account}
              event={event}
              isMyAccount={isMyAccount}
              user={user}
              playerKey={playerKey}
              videoJsOptions={videoJsOptions}
              liveData={liveData}
              handleBuy={handleBuy}
              handleEdit={handleEdit}
            />
          </Router>
        </Theme>
      );
      expect(screen.queryByText('Share')).toBeInTheDocument();
      expect(screen.queryByText('Buy Ticket ($1.00)')).toBeInTheDocument();
      expect(screen.queryByText('Follow')).toBeInTheDocument();
    });
  });
  describe('Admin', () => {
    it('render event page with actions', () => {
      const loading = false;
      const error = false;
      const event = Mapper({
        __typename: 'events_report',
        id: 'b8a029c2-9d08-4abd-8a77-9fb6b3064b48',
        type: 'live',
        name: 'fdfdgd',
        start: '2020-10-22T21:38:41.825+00:00',
        end: '2020-10-22T21:38:41.825+00:00',
        price: '$1.00',
        photo: null,
        preview: null,
        video: null,
        description: null,
        transactions: 0,
        favorites: 0,
        views: 19,
        account: {
          __typename: 'accounts',
          id: '5758e4bc-83a2-4037-b7c9-e4978a6d2af2',
          name: 'Trombone Shorty',
          username: 'tromboneshorty',
          photo:
            'https://dam-media.s3.amazonaws.com/3c/dde14e247243daa247be2c969deff8/920x920.jpg',
          stripe_data: {}
        },
        transaction: []
      });
      const isMyAccount = false;
      const account = {};
      const user = {
        isAdmin: true
      };
      const playerKey = 'a1b2c3';
      const videoJsOptions = {};
      const liveData = {};
      const handleBuy = () => {};
      const handleEdit = () => {};
      render(
        <Theme>
          <Router>
            <EventPage
              loading={loading}
              error={error}
              account={account}
              event={event}
              isMyAccount={isMyAccount}
              user={user}
              playerKey={playerKey}
              videoJsOptions={videoJsOptions}
              liveData={liveData}
              handleBuy={handleBuy}
              handleEdit={handleEdit}
            />
          </Router>
        </Theme>
      );
      expect(screen.queryByText('Share')).toBeInTheDocument();
      expect(screen.queryByText('Follow')).not.toBeInTheDocument();
    });
  });
});
