import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Badge, Menu } from 'antd';

import {
  UserOutlined,
  CalendarOutlined,
  UserAddOutlined,
  ThunderboltOutlined,
  // AreaChartOutlined,
  YoutubeOutlined,
  SettingOutlined
} from '@ant-design/icons';

import posthog from 'posthog-js';

function AccountMenu(props) {
  const { user, username, account, myAccounts, eventCount, userCount } = props;

  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  return (
    <React.Fragment>
      <Menu>
        <Menu.SubMenu key="accounts" icon={<UserOutlined />} title="Accounts">
          {myAccounts.map((account) => (
            <Menu.Item key={`/${account.username}`}>
              <Link to={`/${account.username}`}>{account.name}</Link>
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
        <Menu.Item key={`/${username}`} icon={<YoutubeOutlined />}>
          <Link to={`/${username}`}>Profile</Link>
        </Menu.Item>
        {posthog.isFeatureEnabled('dev') && (
          <Menu.Item key={`/${username}/calendar`} icon={<CalendarOutlined />}>
            <Link to={`/${username}/calendar`}>Calendar</Link>
          </Menu.Item>
        )}
        <Menu.Item key={`/${username}/events`} icon={<ThunderboltOutlined />}>
          <Link to={`/${username}/events`}>
            Events <Badge count={eventCount} />
          </Link>
        </Menu.Item>
        {(user.isAdmin || account.created_by === user.sub) && (
          <Menu.Item key={`/${username}/users`} icon={<UserAddOutlined />}>
            <Link to={`/${username}/users`}>
              Users <Badge count={userCount} />
            </Link>
          </Menu.Item>
        )}
        {/* <Menu.Item
          key={`/${username}/reports`}
          icon={<AreaChartOutlined />}
        >
          <Link to={`/${username}/reports`}>Reports</Link>
        </Menu.Item> */}
        <Menu.Item key={`/${username}/settings`} icon={<SettingOutlined />}>
          <Link to={`/${username}/settings/${account.id}`}>Settings</Link>
        </Menu.Item>
      </Menu>
    </React.Fragment>
  );
}

AccountMenu.propTypes = {
  user: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  account: PropTypes.object.isRequired,
  myAccounts: PropTypes.array.isRequired,
  eventCount: PropTypes.number,
  userCount: PropTypes.number
};

export default AccountMenu;
