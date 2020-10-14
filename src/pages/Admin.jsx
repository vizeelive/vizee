import {
  CalendarOutlined,
  LogoutOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useState, useEffect } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import styled from 'styled-components';

import Logo from '../components/Logo';

import useAuth from "../hooks/useAuth";
import AddAccount from "./AddAccount";
import AddEvent from "./AddEvent";
import Accounts from "./Accounts";
import Calendar from "./Calendar";
import Events from "./Events";

import useBreakpoint from '../hooks/useBreakpoint';

const { Content, Sider } = Layout;

const Header = styled(Layout.Header)`
	height: 64px;
	padding: 0;
	color: rgba(0, 0, 0, 0.85);
	line-height: 64px;
	background: #001529;
	display: flex;
	align-items: center;
	justify-content: flex-start;

	.logo {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 64px;
		padding: 0 20px;
	}
`;

export default function Admin() {
  const { logout } = useAuth();
  const location = useLocation();

  const isLargeScreen = useBreakpoint('lg');
  const [collapsed, setCollapsed] = useState(!isLargeScreen);

  useEffect(() => {
    setCollapsed(!isLargeScreen);
  }, [isLargeScreen]);

  return (
    <Layout>
      <Header className="header">
				<Link to="/" className="logo">
					<Logo size={2} />
				</Link>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(collapse) => setCollapsed(collapse)}
          width={200}
          className="site-layout-background"
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={location.pathname}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            theme="dark"
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
        <Layout style={{ padding: "0 24px 24px", minHeight: "calc(100vh - 64px)" }}>
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
