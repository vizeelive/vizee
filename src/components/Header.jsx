import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import styled from 'styled-components';

import Logo from '../components/Logo';
import MainMenu from '../components/MainMenu';
import useBreakpoint from '../hooks/useBreakpoint';

const StyledHeader = styled(Layout.Header)`
  padding-left: 0;
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
  const { user, account, onLogin, onLogout } = props;
  const isLargeScreen = useBreakpoint( 'lg' );

  return (
    <StyledHeader>
      <LogoLink to="/">
        <Logo
          size={isLargeScreen ? 7.5 : 2.29}
          textColor="#fafafa"
          hasText={isLargeScreen}
        />
      </LogoLink>
      <MainMenu
        user={user}
        account={account}
        onLogin={onLogin}
        onLogout={onLogout}
      />
    </StyledHeader>
  );
}

Header.propTypes = {
  user: PropTypes.object,
  account: PropTypes.array,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default Header;