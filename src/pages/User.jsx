import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import Cookies from 'js-cookie';

import Home from './Home/index';
import AccountHome from './Account/Home';
import Tickets from './Tickets';
import Calendar from './Calendar';
import CreateAccount from './CreateAccount';
import Account from './Account/Index';
import Event from './Event';
import useAuth from 'hooks/useAuth';

import Header from 'components/Header';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';
import Footer from 'components/Footer';

const UserContent = styled.div`
  margin-top: 64px;
`;

const GET_ACCOUNTS_UNAUTH = gql`
  query Accounts {
    accounts {
      id
      name
      username
    }
  }
`;

const GET_ACCOUNTS_AUTH = gql`
  query MyAccounts($user_id: uuid!) {
    hello {
      message
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
  const { user, logout, loginWithRedirect } = useAuth();

  const { loading, error, data } = useQuery(
    user ? GET_ACCOUNTS_AUTH : GET_ACCOUNTS_UNAUTH,
    {
      variables: { user_id: user?.id }
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

  const handleLogout = () => {
    Cookies.remove('username');
    logout();
  };

  // if user, pick first account she has access to
  let account = data?.accounts_users?.[0]?.account;

  // if admin, set to the first account we find
  if (!account && user?.isAdmin) {
    account = data?.accounts?.[0];
  }

  const hasTickets = !!data?.transactions?.length;

  return (
    <Layout>
      <Header
        user={user}
        account={account}
        hasTickets={hasTickets}
        onLogin={() =>
          loginWithRedirect({
            appState: {
              returnTo: window.location.href
            }
          })
        }
        onLogout={handleLogout}
      />
      <UserContent>
        <Switch>
          <Route path="/tickets" exact component={Tickets} />
          <Route path="/calendar" exact>
            <Calendar favorite="true" />
          </Route>
          <Route path="/account" exact component={CreateAccount} />
          <Route path="/:username" exact>
            <AccountHome />
          </Route>
          <Route path="/:username/manage" component={Account} />
          <Route path="/:username/:id/:status?" exact component={Event} />
          {process.env.REACT_APP_ACCOUNT === 'vizee' ? (
            <Route path="/">
              <Home />
            </Route>
          ) : (
              <Route path="/">
                <AccountHome username="deadmau5" />
              </Route>
            )}
        </Switch>
      </UserContent>
      <Footer />
    </Layout>
  );
}
