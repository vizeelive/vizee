import React, { Suspense } from 'react';
import { Switch, Route, useParams } from 'react-router-dom';
import { Layout } from 'antd';
import styled from 'styled-components';
import { gql, useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import useAuth from '../hooks/useAuth';
import AccountMenu from '../components/AccountMenu';
import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

const Home = React.lazy(() => import('./Account/Home'));
const Subscriptions = React.lazy(() => import('./Account/Subscriptions'));
const Settings = React.lazy(() => import('./Settings'));
const AddEvent = React.lazy(() => import('./AddEvent'));
const ViewEvent = React.lazy(() => import('./ViewEvent'));
const Events = React.lazy(() => import('./Events'));
const Dashboard = React.lazy(() => import('./Dashboard'));
const Traffic = React.lazy(() => import('./Account/Traffic'));
const Calendar = React.lazy(() => import('./Calendar'));
const Users = React.lazy(() => import('./Users'));

const { Content } = Layout;

const Sider = styled(Layout.Sider)`
  height: 100vh;
  position: fixed;
  left: 0;
  z-index: 5;

  .ant-layout-sider-zero-width-trigger {
    top: 24px;
    box-shadow: inset 4px 0 2px -2px rgba(0, 0, 0, 0.05);
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
    accounts(where: { username: { _eq: $username } }) {
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
  query GetAccountByUsername($username: String!, $user_id: String!) {
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
    accounts(where: { username: { _eq: $username } }) {
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
    accounts(where: { username: { _eq: $username } }) {
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

  Cookies.set('username', username);

  let query;
  let variables;
  if (user?.isAdmin) {
    query = GET_ACCOUNT_AUTH_ADMIN;
    variables = { username };
  } else if (user) {
    query = GET_ACCOUNT_AUTH;
    variables = { username, user_id: user?.sub };
  } else {
    query = GET_ACCOUNT_UNAUTH;
    variables = { username };
  }

  // @TODO would probably be better to use named actions rather than variables queries in order to track which one gets called, or give them different query names above
  const { loading, error, data, refetch } = useQuery(query, {
    variables
  });

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
          <Sider breakpoint="lg" collapsedWidth="0" width={200} theme="light">
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
              padding: 24,
              margin: 0,
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
                  path="/:username/manage/events/add"
                  exact
                  render={() => (
                    <AddEvent redirect={`/${username}/manage/events`} />
                  )}
                />
                <Route
                  path="/:username/manage/subscriptions/:id"
                  exact
                  render={() => <Subscriptions />}
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
