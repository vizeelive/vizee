import React from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import Home from './Home/index';
import CreateAccount from './CreateAccount';
import AccountHome from './Account/Home';
import Tickets from './Tickets';
import Calendar from './Calendar';
import Account from './Account/Index';
import Event from './Event';
import useAuth from 'hooks/useAuth';

import ErrorBoundary from 'components/ErrorBoundary';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

import DefaultLayout from 'components/layout/default/Layout';

const GET_ACCOUNTS_UNAUTH = gql`
  query Accounts($username: String) {
    creator: accounts(limit: 1, where: { username: { _ilike: $username } }) {
      id
      logo
    }
  }
`;

const GET_ACCOUNTS_AUTH = gql`
  query MyAccounts($user_id: uuid, $username: String) {
    hello {
      message
    }
    creator: accounts(limit: 1, where: { username: { _ilike: $username } }) {
      id
      logo
    }
    getStripeCustomerPortalUrl {
      url
    }
    accounts_users(where: { user_id: { _eq: $user_id } }) {
      account {
        id
        name
        username
        photo
        events {
          id
          name
          start
          location
          photo
          account {
            name
            username
            photo
          }
        }
      }
    }
    transactions(where: { user_id: { _eq: $user_id } }) {
      event {
        id
        account {
          name
          photo
          username
        }
        favorites {
          id
        }
        name
        photo
        preview
        price
        start
        type
        location
        description
      }
    }
    accounts(limit: 1) {
      id
      username
    }
  }
`;

export default function User() {
  const location = useLocation();
  const history = useHistory();
  const { user, logout, loginWithRedirect } = useAuth();

  let username;
  if (window.location.hostname.includes('.vizee.pro')) {
    username = window.location.hostname.split('.vizee.pro').shift();
  }

  const { loading, error, data } = useQuery(
    user ? GET_ACCOUNTS_AUTH : GET_ACCOUNTS_UNAUTH,
    {
      variables: { user_id: user?.id, username }
    }
  );

  if (loading) {
    return (
      <Centered height="full">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  if (user) {
    user.portalUrl = data?.getStripeCustomerPortalUrl?.url;
  }

  let account = data?.accounts_users?.[0]?.account;

  // if admin, set to the first account we find
  if (!account && user?.isAdmin) {
    account = data?.accounts?.[0];
  }

  // redirect user to account settings, if just signing up
  if (location.pathname === '/signup') {
    window.location.href = `/${account.username}/manage/settings/${account.id}/account`;
    return null;
  }

  // redirect user if not logged in
  if (location.pathname.includes('manage') && !user) {
    history.push('/');
  }

  const hasTickets = !!data?.transactions?.length;

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.href
      }
    });
  };

  const handleSignup = () => {
    loginWithRedirect({
      appState: {
        onboarding: true
      }
    });
  };

  const handleLogout = () => {
    Cookies.remove('username');
    logout({ returnTo: window.location.origin });
  };

  return (
    <ErrorBoundary>
      <Switch>
        <Route path="/:username/manage" component={Account} />
        <Route path="/">
          <DefaultLayout
            user={user}
            creator={data?.creator?.[0]}
            account={account}
            hasTickets={hasTickets}
            onLogin={handleLogin}
            onLogout={handleLogout}
          >
            <Switch>
              <Route path="/tickets" exact component={Tickets} />
              <Route path="/calendar" exact>
                <Calendar favorite="true" />
              </Route>
              <Route path="/account" exact component={CreateAccount} />
              <Route
                path="/:username/:userCode(\w{0,12})?"
                exact
                component={AccountHome}
              />
              <Route
                path="/:username/:id/:status(success)?/:userCode?"
                exact
                component={Event}
              />
              {!username ? (
                <Route path="/">
                  <Home onSignup={handleSignup} />
                </Route>
              ) : (
                <Route path="/">
                  <AccountHome
                    creator={data?.creator?.[0]}
                    username={username}
                  />
                </Route>
              )}
            </Switch>
          </DefaultLayout>
        </Route>
      </Switch>
    </ErrorBoundary>
  );
}
