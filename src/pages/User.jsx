import React from "react";
import { Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { gql, useQuery } from "@apollo/client";

import Home from "./Home";
import Calendar from "./Calendar";
import CreateAccount from "./CreateAccount";
import Account from "./Account";
import Event from "./Event";
import useAuth from "../hooks/useAuth";

import {
  LayoutGrid
} from '../components/styled/layout';

import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

const { Header } = Layout;

const GET_ACCOUNTS = gql`
  query MyAccounts($id: String) {
    accounts(where: { created_by: { _eq: $id } }) {
      id
      name
      username
    }
  }
`;

export default function User() {
  const { user, logout, loginWithRedirect } = useAuth();

  const { loading, error, data } = useQuery(GET_ACCOUNTS, {
    variables: { id: user?.sub },
  });

  if (loading) {
    return (
      <Centered height="full">
        <Spinner />
      </Centered>
    );
  }

  if (error) return "Error";

  const account = data.accounts[0];

  return (
    <LayoutGrid>
      <Header>
        <Link to="/" style={{ float: "left", paddingRight: "40px" }}>
          <img src="/favicon.ico" alt="Muse" width="20px" />
        </Link>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          {user?.isAdmin && (
            <Menu.Item key="/admin">
              <Link to="/admin">Admin</Link>
            </Menu.Item>
          )}
          {user && (
            <Menu.Item key="/calendar">
              <Link to="/calendar">Calendar</Link>
            </Menu.Item>
          )}
          {user && account && (
            <Menu.Item key={`/${account.username}`}>
              <Link to={`/${account.username}`}>Account</Link>
            </Menu.Item>
          )}
          {user && (
            <Menu.Item key="/account">
              <Link to="/account">Create Profile</Link>
            </Menu.Item>
          )}
          {!user && (
            <Menu.Item key="/login" onClick={() => loginWithRedirect()}>
              Login
            </Menu.Item>
          )}
          {user && (
            <Menu.Item
              key="/logout"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </Menu.Item>
          )}
        </Menu>
      </Header>
      <Switch>
        <Route path="/events/:id" exact component={Event} />
        <Route path="/calendar" exact>
          <Calendar favorite="true" />
        </Route>
        <Route path="/account" exact component={CreateAccount} />
        <Route path="/:username" component={Account} />
        <Route path="/" component={Home} />
      </Switch>
    </LayoutGrid>
  );
}
