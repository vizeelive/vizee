import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import styled from 'styled-components';

import Logo from '../components/Logo';
import MainMenu from '../components/MainMenu';
import useBreakpoint from '../hooks/useBreakpoint';

const StyledHeader = styled(Layout.Header)`
  position: fixed;
  z-index: 1000;
  width: 100%;
  padding: 0;
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 0 20px;
  float: left;
`;

function Header(props) {
  const { user, account, hasTickets, onLogin, onLogout } = props;
  const isLargeScreen = useBreakpoint('lg');

  return (
    <StyledHeader>
      <LogoLink to="/">
        { process.env.REACT_APP_ACCOUNT === 'vizee' ? (
        <Logo
          size={isLargeScreen ? 7.5 : 2.29}
          textColor="#fafafa"
          hasText={isLargeScreen}
        />
        ) : null }
      </LogoLink>
      <MainMenu
        user={user}
        hasTickets={hasTickets}
        account={account}
        onLogin={onLogin}
        onLogout={onLogout}
      />
    </StyledHeader>
  );
}

Header.propTypes = {
  user: PropTypes.object,
  account: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  hasTickets: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default Header;
