import React from "react";
import { Switch, Route } from "react-router-dom";
import { Link, useParams, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";

import { gql, useQuery } from "@apollo/client";

import Home from "./Account/Home";
import Calendar from "./Calendar";
import Users from "./Users";
import useAuth from "../hooks/useAuth";

import {
  UserOutlined,
  CalendarOutlined,
  LogoutOutlined,
  VideoCameraOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import { Centered } from "../components/styled/common";
import Spinner from "../components/ui/Spinner";

const { SubMenu } = Menu;
const { Sider } = Layout;

const GET_ACCOUNT_UNAUTH = gql`
  query GetAccountByUsername($username: String!) {
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
    myaccounts: accounts_users(order_by: {name: asc}, where: { user_id: { _eq: $user_id } }) {
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
  query GetAccountByUsername($username: String!) {
    myaccounts: accounts(order_by: {name: asc}) {
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
  const location = useLocation();
  let { username } = useParams();
  const { user, logout } = useAuth();

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

  const { loading, error, data, refetch } = useQuery(query, {
    fetchPolicy: "cache-and-network",
    variables,
  });

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return "Error";

  // @TODO find by pk, no need for [0]
  const account = data?.account?.[0].account || data?.accounts[0];
  const isMyAccount = user?.isAdmin || data?.myaccounts?.filter(
    (acc) => acc.account.username === account.username
  );
  const myAccounts = data?.myaccounts?.[0]?.account ? data.myaccounts.map(acc => acc.account) : data.myaccounts;

  return (
    <React.Fragment>
      <Layout>
        {isMyAccount ? (
          <Sider width={200} className="site-layout-background">
            <Menu>
              <SubMenu key="accounts" icon={<UserOutlined />} title="Accounts">
                {myAccounts.map((account) => (
                  <Menu.Item key={`/${account.username}`}>
                    <Link to={`/${account.username}`}>
                      {account.name}
                    </Link>
                  </Menu.Item>
                ))}
                <Menu.Item key="/account">
                  <Link to="/account">Create Account</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
            <Menu
              mode="inline"
              defaultSelectedKeys={location.pathname}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item key={`/${username}`} icon={<VideoCameraOutlined />}>
                <Link to={`/${username}`}>Profile</Link>
              </Menu.Item>
              <Menu.Item
                key={`/${username}/calendar`}
                icon={<CalendarOutlined />}
              >
                <Link to={`/${username}/calendar`}>Calendar</Link>
              </Menu.Item>
              {(user.isAdmin || account.created_by === user.sub) && (
                <Menu.Item
                  key={`/${username}/users`}
                  icon={<UserAddOutlined />}
                >
                  <Link to={`/${username}/users`}>Users</Link>
                </Menu.Item>
              )}
              <Menu.Item
                key="/logout"
                icon={<LogoutOutlined />}
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Logout
              </Menu.Item>
            </Menu>
          </Sider>
        ) : null}
        <Layout>
          <Switch>
            <Route path="/:username/users" exact component={Users} />
            <Route path="/:username/calendar" exact component={Calendar} />
            <Route path="/:username" exact>
              <Home account={account} refetch={refetch} />
            </Route>
          </Switch>
        </Layout>
      </Layout>
    </React.Fragment>
  );
}
