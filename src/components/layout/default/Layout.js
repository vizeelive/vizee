import React from 'react';
import PropTypes from 'prop-types';
import Menu from './Menu';
import Footer from '../Footer';

function Layout(props) {
  const {
    user,
    creator,
    account,
    tickets,
    onLogin,
    onLogout,
    children
  } = props;

  return (
    <div className="max-w-7xl h-screen flex flex-col bg-black pt-16 3xl:container 3xl:mx-auto">
      <header className="w-full fixed top-0 z-40" style={{ maxWidth: 1280 }}>
        <Menu
          user={user}
          creator={creator}
          account={account}
          tickets={tickets}
          onLogin={onLogin}
          onLogout={onLogout}
        />
      </header>

      <main className="flex-grow">{children}</main>

      <Footer className="flex-none" />
    </div>
  );
}

Layout.propTypes = {
  user: PropTypes.object,
  account: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  tickets: PropTypes.array,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default Layout;
