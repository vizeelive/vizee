import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import styled from 'styled-components';

import Logo from '../components/Logo';
import MainMenu from '../components/MainMenu';

const StyledHeader = styled(Layout.Header)`
  padding-left: 0;
  
  .logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    width: calc(2rem + 40px);
    float: left;
  }
`;

function Header(props) {
  const {
    user,
    account,
    onLogin,
    onLogout
  } = props;

  return (
    <StyledHeader>
      <Link to="/" className="logo">
        <Logo size={2} />
      </Link>
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

export default Header

