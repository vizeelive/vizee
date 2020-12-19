import React from 'react';
import PropTypes from 'prop-types';
import Menu from './Menu';
import Footer from '../Footer';

function Layout(props) {
  const { user, account, hasTickets, onLogin, onLogout, children } = props;

  return (
    <div className="h-screen flex flex-col bg-black pt-16">
      <header className="fixed top-0 inset-x-0 z-40">
        <Menu
          user={user}
          account={account}
          hasTickets={hasTickets}
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
  hasTickets: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default Layout;
