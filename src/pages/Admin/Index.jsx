import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Layout } from 'antd';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import AddAccount from '../AddAccount';
import AddEvent from '../Account/AddEvent';
import Accounts from '../Admin/Accounts';
import Calendar from '../Calendar';
import Events from '../Events';

import Header from '../../components/Header';
import AdminMenu from '../../components/AdminMenu';
import { Centered } from '../../components/styled/common';
import Spinner from '../../components/ui/Spinner';
import Footer from '../../components/Footer';

import useBreakpoint from '../../hooks/useBreakpoint';

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
  padding: 0 24px 24px;
  min-height: calc(100vh - 64px);

  @media (min-width: 992px) {
    margin-left: 200px;
  }
`;

const GET_ACCOUNTS_AUTH = gql`
  query MyAccounts($user_id: uuid!) {
    accounts_users(where: { user_id: { _eq: $user_id } }) {
      account {
        id
        name
        username
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
  }
`;

export default function Admin() {
  const { user, logout, loginWithRedirect } = useAuth();
  const [collapsed, setCollapsed] = useState(true);
  const isLargeScreen = useBreakpoint('lg');

  useEffect(() => {
    setCollapsed(!isLargeScreen);
  }, [isLargeScreen]);

  const { loading, error, data } = useQuery(GET_ACCOUNTS_AUTH, {
    variables: { user_id: user?.id }
  });

  if (loading) {
    return (
      <Centered height="full">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const account = data?.accounts_users?.[0]?.account || data?.accounts;
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
      <Layout style={{ marginTop: 64 }}>
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
          <AdminMenu />
        </Sider>
        <SiderLayout>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
          >
            <Switch>
              <Route path="/admin" exact>
                <Events admin={true} />
              </Route>
              <Route path="/admin/accounts" exact>
                <Accounts />
              </Route>
              <Route path="/admin/events" exact>
                <Events admin={true} />
              </Route>
              <Route path="/admin/calendar" exact component={Calendar} />
              <Route path="/admin/events/add" exact>
                <AddEvent redirect={`/admin/events`} />
              </Route>
              <Route path="/admin/events/edit/:id" exact component={AddEvent} />
              <Route path="/admin/accounts/add" exact component={AddAccount} />
              <Route
                path="/admin/accounts/edit/:id"
                exact
                component={AddAccount}
              />
            </Switch>
          </Content>
          <Footer />
        </SiderLayout>
      </Layout>
    </Layout>
  );
}
