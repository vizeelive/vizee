import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import styled from 'styled-components';

const StyledMenu = styled(Menu)`
  &.ant-menu-dark {
    &.ant-menu-horizontal {
      & > .ant-menu-item {
        &:not(.ant-menu-item-selected) {
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
      }
    }
  }
`;

function MainMenu(props) {
  const { user, account, onLogin, onLogout } = props;

  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  useEffect(() => {
    const { pathname } = location;
    if (pathname === '/' || pathname === '/account') {
      setCurrent(pathname);
    }
  }, [location]);

  return (
    <StyledMenu
      theme="dark"
      mode="horizontal"
      onClick={(e) => setCurrent(e.key)}
      selectedKeys={[current]}
    >
      {user?.isAdmin && (
        <Menu.Item key="/admin">
          <Link to="/admin">Admin</Link>
        </Menu.Item>
      )}
      {user && (
        <Menu.Item key="/tickets">
          <Link to="/tickets">My Tickets</Link>
        </Menu.Item>
      )}
      {/* {user && (
        <Menu.Item key="/calendar">
          <Link to="/calendar">Calendar</Link>
        </Menu.Item>
      )} */}
      {user && account && (
        <Menu.Item key={`/${account.username}`}>
          <Link to={`/${account.username}`}>Account</Link>
        </Menu.Item>
      )}
      {user && !account && (
        <Menu.Item key="/account">
          <Link to="/account">Create Account</Link>
        </Menu.Item>
      )}
      {!user && (
        <Menu.Item key="/login" onClick={() => onLogin()}>
          Login
        </Menu.Item>
      )}
      {user && (
        <Menu.Item
          key="/logout"
          onClick={() => onLogout({ returnTo: window.location.origin })}
        >
          Logout ({`${user.email}`})
        </Menu.Item>
      )}
    </StyledMenu>
  );
}

MainMenu.propTypes = {
  user: PropTypes.object,
  account: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default MainMenu;
