import {
  CalendarOutlined,
  LogoutOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import AddAccount from "./AddAccount";
import AddEvent from "./AddEvent";
import Accounts from "./Accounts";
import Calendar from "./Calendar";
import Events from "./Events";

const { Header, Content, Sider } = Layout;

export default function Admin() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <Layout>
      <Header className="header">
        <div className="logo">
          <Link to="/">
            {" "}
            <img width="20" src="/favicon.ico" alt="Vizee" />
          </Link>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={location.pathname}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item key="/admin/events" icon={<VideoCameraOutlined />}>
              <Link to={"/admin/events"}>Events</Link>
            </Menu.Item>
            <Menu.Item key="/admin/calendar" icon={<CalendarOutlined />}>
              <Link to={"/admin/calendar"}>Calendar</Link>
            </Menu.Item>
            <Menu.Item key="/admin/accounts" icon={<UserOutlined />}>
              <Link to={"/admin/accounts"}>Accounts</Link>
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
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
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
        </Layout>
      </Layout>
    </Layout>
  );
}
