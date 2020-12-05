import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import { isMobile } from 'react-device-detect';

const StyledMenu = styled(Menu)`
  &.ant-menu-dark {
    float: right;
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
  const { user, account, hasTickets, onLogin, onLogout } = props;

  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  const username = Cookies.get('username') || account?.username;
  const logoutText = !isMobile && user ? `(${user?.name})` : '';

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
        <Menu.Item data-test-id="menu-admin" key="/admin">
          <Link to="/admin">Admin</Link>
        </Menu.Item>
      )}
      {hasTickets && (
        <Menu.Item data-test-id="menu-tickets" key="/tickets">
          <Link to="/tickets">My Tickets</Link>
        </Menu.Item>
      )}
      {/* {user && (
        <Menu.Item key="/calendar">
          <Link to="/calendar">Calendar</Link>
        </Menu.Item>
      )} */}
      {!process.env.REACT_APP_NETWORK && user && user.isAdmin && (
        <Menu.Item data-test-id="menu-account" key={`/${username}/manage`}>
          <Link to={`/${username}/manage`}>Account</Link>
        </Menu.Item>
      )}
      {!process.env.REACT_APP_NETWORK && user && !user.isAdmin && account && (
        <Menu.Item data-test-id="menu-account" key={`/${username}/manage`}>
          <Link to={`/${username}/manage`}>Account</Link>
        </Menu.Item>
      )}
      {!process.env.REACT_APP_NETWORK && user && !user.isAdmin && !account && (
        <Menu.Item data-test-id="menu-account" key="/account">
          <Link to="/account">Create Account</Link>
        </Menu.Item>
      )}
      <Menu.Item
        data-test-id="menu-help"
        key="/help"
        onClick={(e) => window.$chatwoot.toggle()}
      >
        Help
      </Menu.Item>
      {!user && (
        <Menu.Item data-test-id="menu-login" key="/" onClick={() => onLogin()}>
          Sign In
        </Menu.Item>
      )}
      {user && (
        <Menu.Item
          data-test-id="menu-logout"
          key="/logout"
          onClick={() => onLogout({ returnTo: window.location.origin })}
        >
          Logout {logoutText}
        </Menu.Item>
      )}
    </StyledMenu>
  );
}

MainMenu.propTypes = {
  user: PropTypes.object,
  account: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  hasTickets: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default MainMenu;
