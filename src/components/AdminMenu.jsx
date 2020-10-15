import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import {
  CalendarOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

function AdminMenu() {
  const { pathname } = useLocation();
  const [current, setCurrent] = useState(
    pathname === '/admin' ? '/admin/events' : pathname
  );

  return (
    <Menu
      mode="inline"
      onClick={(e) => setCurrent(e.key)}
      selectedKeys={[current]}
      style={{ height: '100%', borderRight: 0 }}
    >
      <Menu.Item key="/admin/events" icon={<VideoCameraOutlined />}>
        <Link to={'/admin/events'}>Events</Link>
      </Menu.Item>
      <Menu.Item key="/admin/calendar" icon={<CalendarOutlined />}>
        <Link to={'/admin/calendar'}>Calendar</Link>
      </Menu.Item>
      <Menu.Item key="/admin/accounts" icon={<UserOutlined />}>
        <Link to={'/admin/accounts'}>Accounts</Link>
      </Menu.Item>
    </Menu>
  );
}

export default AdminMenu;
