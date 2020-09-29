import React from "react";
import { Switch, Route } from "react-router-dom";
import { Link, useParams, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";

import { gql, useQuery } from "@apollo/client";

import Home from "./Account/Home";
import Calendar from "./Calendar";
import Account from "./Account";
import useAuth from "../hooks/useAuth";

import {
  UserOutlined,
  CalendarOutlined,
  LogoutOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

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

const GET_ACCOUNT_AUTH = gql`
  query GetAccountByUsername($username: String!, $user_id: String!) {
    myaccounts: accounts(where: { created_by: { _eq: $user_id } }) {
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

export default function Event() {
  const location = useLocation();
  let { username } = useParams();
  const { user, logout } = useAuth();
  const { loading, error, data, refetch } = useQuery(
    user ? GET_ACCOUNT_AUTH : GET_ACCOUNT_UNAUTH,
    {
      fetchPolicy: "cache-and-network",
      variables: { username, user_id: user.sub },
    }
  );

  if (loading) return "Loading...";
  if (error) return "Error";

  const account = data?.accounts[0];
  const isMyAccount = user && user.sub === account.created_by;

  return (
    <React.Fragment>
      <Layout>
        {isMyAccount ? (
          <Sider width={200} className="site-layout-background">
            <Menu>
              <SubMenu key="accounts" icon={<UserOutlined />} title="Accounts">
                {data.myaccounts.map((account) => (
                  <Menu.Item key={`/${account.username}`}>
                    <Link to={`/${account.username}`}>{account.name}</Link>
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
              <Menu.Item
                key="3"
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
            <Route path="/:username/calendar" exact component={Calendar} />
            <Route path="/:username" exact>< Home account={account} refetch={refetch} /></Route>
          </Switch>
        </Layout>
      </Layout>
    </React.Fragment>
  );
}
