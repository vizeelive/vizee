import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';

import {
  UserOutlined,
  CalendarOutlined,
  UserAddOutlined,
  ThunderboltOutlined,
  AreaChartOutlined,
  YoutubeOutlined,
  SettingOutlined
} from '@ant-design/icons';

import posthog from 'posthog-js';

function AccountMenu(props) {
  const { user, username, account, myAccounts } = props;

  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  return (
    <div data-test-id="account-menu">
      <Menu>
        <Menu.SubMenu key="accounts" icon={<UserOutlined />} title="Accounts">
          {myAccounts.map((account) => (
            <Menu.Item key={`/${account.username}/manage`}>
              <Link to={`/${account.username}/manage`}>{account.name}</Link>
            </Menu.Item>
          ))}
          <Menu.Item key="/account">
            <Link to="/account">Create Account</Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
      <Menu
        mode="inline"
        onClick={(e) => setCurrent(e.key)}
        selectedKeys={[current]}
      >
        <Menu.Item key={`/${username}/manage`} icon={<YoutubeOutlined />}>
          <Link to={`/${username}/manage`}>Profile</Link>
        </Menu.Item>
        <Menu.Item
          key={`/${username}/manage/dashboard`}
          icon={<AreaChartOutlined />}
        >
          <Link to={`/${username}/manage/dashboard`}>Dashboard</Link>
        </Menu.Item>
        {posthog.isFeatureEnabled('dev') && (
          <Menu.Item
            key={`/${username}/manage/calendar`}
            icon={<CalendarOutlined />}
          >
            <Link to={`/${username}/manage/calendar`}>Calendar</Link>
          </Menu.Item>
        )}
        <Menu.Item
          key={`/${username}/manage/events`}
          icon={<ThunderboltOutlined />}
        >
          <Link to={`/${username}/manage/events`}>Events </Link>
        </Menu.Item>
        {(user.isAdmin || account.created_by === user.sub) && (
          <Menu.Item
            key={`/${username}/manage/users`}
            icon={<UserAddOutlined />}
          >
            <Link to={`/${username}/manage/users`}>Users </Link>
          </Menu.Item>
        )}
        {/* <Menu.Item
          key={`/${username}/reports`}
          icon={<AreaChartOutlined />}
        >
          <Link to={`/${username}/reports`}>Reports</Link>
        </Menu.Item> */}
        <Menu.Item
          key={`/${username}/manage/settings`}
          icon={<SettingOutlined />}
        >
          <Link to={`/${username}/manage/settings/${account.id}/account`}>
            Settings
          </Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

AccountMenu.propTypes = {
  user: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  account: PropTypes.object.isRequired,
  myAccounts: PropTypes.array.isRequired
};

export default AccountMenu;
