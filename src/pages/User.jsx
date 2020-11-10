import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import Cookies from 'js-cookie';

import Home from './Home';
import AccountHome from './Account/Home';
import Tickets from './Tickets';
import Calendar from './Calendar';
import CreateAccount from './CreateAccount';
import Account from './Account';
import Event from './Event';
import useAuth from '../hooks/useAuth';

import Header from '../components/Header';
import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

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
  query MyAccounts($user_id: String) {
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
        video
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
      variables: { user_id: user?.sub }
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


  if (Cookies.get('redirect')) {
    let redirect = Cookies.get('redirect');
    Cookies.remove('redirect');
    window.location.href = redirect;
    return;
  }

  const account = data?.accounts?.[0] || data?.accounts_users?.[0]?.account;
  const hasTickets = !!data?.transactions?.length;

  return (
    <Layout>
      <Header
        user={user}
        account={account}
        hasTickets={hasTickets}
        onLogin={loginWithRedirect}
        onLogout={logout}
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
          <Route path="/:username/:id" exact component={Event} />
          <Route path="/" component={Home} />
        </Switch>
      </UserContent>
    </Layout>
  );
}
