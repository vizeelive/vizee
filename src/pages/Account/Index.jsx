import React, { useState, useEffect, Suspense } from 'react';
import { Switch, Route, useParams, useHistory } from 'react-router-dom';
import { Layout } from 'antd';
import styled from 'styled-components';
import { gql, useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import useAuth from 'hooks/useAuth';
import AccountMenu from 'components/AccountMenu';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

import useBreakpoint from 'hooks/useBreakpoint';

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

const { Content } = Layout;

const Sider = styled(Layout.Sider)`
  height: 100vh;
  position: fixed;
  left: 0;
  z-index: 5;

  .ant-layout-sider-zero-width-trigger {
    top: 24px;
    line-height: 34px;
  }
`;

const SiderLayout = styled(Layout)`
  min-height: calc(100vh - 64px);

  @media (min-width: 992px) {
    margin-left: 200px;
  }
`;

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
  const { user } = useAuth();
  const history = useHistory();

  const [collapsed, setCollapsed] = useState(true);
  const isLargeScreen = useBreakpoint('lg');

  useEffect(() => {
    setCollapsed(!isLargeScreen);
  }, [isLargeScreen]);

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

  // @TODO find by pk, no need for [0]
  const account = data?.account?.[0].account || data?.accounts[0];
  const isMyAccount =
    user?.isAdmin ||
    !!data?.myaccounts?.filter(
      (acc) => acc.account.username === account.username
    ).length;
  const myAccounts = data?.myaccounts?.[0]?.account
    ? data.myaccounts.map((acc) => acc.account)
    : data.myaccounts;

  return (
    <React.Fragment>
      <Layout>
        {isMyAccount ? (
          <Sider
            breakpoint="lg"
            collapsed={collapsed}
            collapsedWidth="0"
            theme="dark"
            onCollapse={(collapsed, type) => {
              if (type === 'clickTrigger') {
                setCollapsed(collapsed);
              }
            }}
          >
            <AccountMenu
              user={user}
              username={username}
              account={account}
              myAccounts={myAccounts}
            />
          </Sider>
        ) : null}
        <SiderLayout>
          <Content
            className="site-layout-background"
            style={{
              margin: 0,
              padding: '20px',
              minHeight: 280
            }}
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
                <Route
                  path="/:username/manage/events"
                  exact
                  component={Events}
                />
                <Route
                  path="/:username/manage/links/:id"
                  exact
                  component={Links}
                />
                <Route
                  path="/:username/manage/products/:id"
                  exact
                  component={Products}
                />
                <Route
                  path="/:username/manage/events/add"
                  exact
                  render={() => (
                    <AddEvent redirect={`/${username}/manage/events`} />
                  )}
                />
                <Route
                  path="/:username/manage/events/:id"
                  exact
                  component={ViewEvent}
                />
                <Route
                  path="/:username/manage/events/edit/:id"
                  exact
                  render={() => (
                    <AddEvent redirect={`/${username}/manage/events`} />
                  )}
                />
                <Route
                  path="/:username/manage/settings/:id/:tab/:status?"
                  component={Settings}
                />
                <Route
                  path="/:username/manage/calendar"
                  exact
                  component={Calendar}
                />
                <Route
                  path="/:username/manage"
                  exact
                  render={() => <Home account={account} refetch={refetch} />}
                />
              </Switch>
            </Suspense>
          </Content>
        </SiderLayout>
      </Layout>
    </React.Fragment>
  );
}
