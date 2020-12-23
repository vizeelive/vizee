import React, { Suspense } from 'react';
import { Switch, Route, useParams, useHistory } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import useAuth from 'hooks/useAuth';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

// const AddEvent = React.lazy(() => import('./AddEvent'));
// const Calendar = React.lazy(() => import('../Calendar'));
// const Dashboard = React.lazy(() => import('./Dashboard'));
// const Events = React.lazy(() => import('../Events'));
// const Home = React.lazy(() => import('./Home'));
// const Links = React.lazy(() => import('../Account/Links'));
// const Subscriptions = React.lazy(() => import('./Subscriptions'));
// const Settings = React.lazy(() => import('./Settings'));
// const Traffic = React.lazy(() => import('./Traffic'));
// const Users = React.lazy(() => import('../Account/Users'));
// const ViewEvent = React.lazy(() => import('./ViewEvent'));

import AddEvent from 'pages/Account/AddEvent';
import Calendar from 'pages/Calendar';
import Dashboard from 'pages/Account/Dashboard';
import Events from 'pages/Events';
import Home from 'pages/Account/Home';
import Links from 'pages/Account/Links';
import Products from 'pages/Account/Products';
import Settings from 'pages/Account/Settings';
import Traffic from 'pages/Account/Traffic';
import Users from 'pages/Account/Users';
import ViewEvent from 'pages/Account/ViewEvent';

import AccountLayout from 'components/layout/account/Layout';

const GET_ACCOUNT_UNAUTH = gql`
  query AnonGetAccountByUsername($username: String!) {
    accounts(where: { username: { _ilike: $username } }) {
      id
      name
      username
      photo
      instagram
      twitter
      facebook
      created_by
      events {
        id
        name
        photo
        preview
        start
        end
        account {
          name
          photo
          username
        }
        category {
          id
        }
      }
    }
  }
`;

// @TODO KEEP THE OUTPUT SCHEMAS THE SAME
const GET_ACCOUNT_AUTH = gql`
  query GetAccountByUsername($username: String!, $user_id: uuid!) {
    myaccounts: accounts_users(
      order_by: { account: { name: asc } }
      where: { user_id: { _eq: $user_id } }
    ) {
      account {
        id
        name
        username
      }
    }
    getStripeCustomerPortalUrl {
      url
    }
    accounts(where: { username: { _ilike: $username } }) {
      id
      name
      username
      description
      photo
      instagram
      twitter
      facebook
      created_by
      umami_id
      events {
        id
        name
        photo
        preview
        start
        end
        account {
          name
          photo
          username
        }
        category {
          id
        }
        transactions {
          id
        }
      }
    }
  }
`;

const GET_ACCOUNT_AUTH_ADMIN = gql`
  query AdminGetAccountByUsername($username: String!) {
    myaccounts: accounts(order_by: { name: asc }) {
      id
      name
      username
    }
    getStripeCustomerPortalUrl {
      url
    }
    accounts(where: { username: { _ilike: $username } }) {
      id
      name
      username
      description
      photo
      instagram
      twitter
      facebook
      created_by
      umami_id
      events {
        id
        name
        photo
        preview
        start
        end
        account {
          name
          photo
          username
        }
        category {
          id
        }
        transactions {
          id
        }
      }
    }
  }
`;

export default function Account() {
  const { username } = useParams();
  const { user, logout } = useAuth();
  const history = useHistory();

  Cookies.set('username', username);

  let query;
  let variables;
  if (user?.isAdmin) {
    query = GET_ACCOUNT_AUTH_ADMIN;
    variables = { username };
  } else if (user) {
    query = GET_ACCOUNT_AUTH;
    variables = { username, user_id: user?.id };
  } else {
    query = GET_ACCOUNT_UNAUTH;
    variables = { username };
  }

  // @TODO would probably be better to use named actions rather than variables queries in order to track which one gets called, or give them different query names above
  const { loading, error, data, refetch } = useQuery(query, {
    variables
  });

  // if username cookie references bad record, remove, and redirect
  if (data && !data?.accounts?.[0]) {
    Cookies.remove('username');
    history.push('/');
    return null;
  }

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const handleLogout = () => {
    Cookies.remove('username');
    logout();
  };

  if (user) {
    user.portalUrl = data?.getStripeCustomerPortalUrl?.url;
  }

  // @TODO find by pk, no need for [0]
  const account = data?.account?.[0].account || data?.accounts[0];
  const myAccounts = data?.myaccounts?.[0]?.account
    ? data.myaccounts.map((acc) => acc.account)
    : data.myaccounts;

  return (
    <AccountLayout
      user={user}
      username={username}
      account={account}
      myAccounts={myAccounts}
      onLogout={handleLogout}
    >
      <Suspense fallback={Spinner}>
        <Switch>
          <Route
            path="/:username/manage/dashboard"
            exact
            component={Dashboard}
          />
          <Route
            path="/:username/manage/traffic/:id/:website"
            exact
            component={Traffic}
          />
          <Route path="/:username/manage/users" exact component={Users} />
          <Route path="/:username/manage/events" exact component={Events} />
          <Route path="/:username/manage/links/:id" exact component={Links} />
          <Route
            path="/:username/manage/products/:id"
            exact
            component={Products}
          />
          <Route
            path="/:username/manage/events/add"
            exact
            render={() => <AddEvent redirect={`/${username}/manage`} />}
          />
          <Route
            path="/:username/manage/events/:id"
            exact
            component={ViewEvent}
          />
          <Route
            path="/:username/manage/events/edit/:id"
            exact
            render={() => <AddEvent redirect={`/${username}/manage`} />}
          />
          <Route
            path="/:username/manage/settings/:id/:tab/:status?"
            component={Settings}
          />
          <Route path="/:username/manage/calendar" exact component={Calendar} />
          <Route
            path="/:username/manage"
            exact
            render={() => <Home account={account} refetch={refetch} />}
          />
        </Switch>
      </Suspense>
    </AccountLayout>
  );
}
