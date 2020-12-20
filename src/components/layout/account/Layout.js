import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import OffCanvasMenu from './OffCanvasMenu';
import Menu from './Menu';
import ProfileMenu from '../ProfileMenu';
import Footer from '../Footer';
import logo from '../../../svg/vizee-logo.svg';

export default function Layout(props) {
  const { user, username, account, myAccounts, onLogout, children } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="h-screen flex overflow-hidden bg-black">
      <OffCanvasMenu
        user={user}
        username={username}
        account={account}
        myAccounts={myAccounts}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Sider (desktop) */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-850">
            <div className="flex-1 flex flex-col pt-5 pb-4">
              <Menu
                user={user}
                username={username}
                account={account}
                myAccounts={myAccounts}
              />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 overflow-auto focus:outline-none" tabIndex="0">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-gray-900 border-b border-gray-800 lg:border-none">
          <button
            type="button"
            className="px-4 border-r border-gray-800 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-600 lg:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            {/* Heroicon name: menu-alt-1 */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
            <div className="flex-1 flex items-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-400 hover:text-gray-200"
              >
                <svg
                  className="h-6 w-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <img className="h-5 w-auto mx-1" src={logo} alt="Vizee" />
                <span className="ml-1">Home</span>
              </Link>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* @todo: NOTIFICATIONS */}
              {/* <button className="bg-gray-900 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-600">
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button> */}

              <ProfileMenu user={user} account={account} onLogout={onLogout} />
            </div>
          </div>
        </div>

        <div className="flex-1 relative z-0 overflow-y-auto">
          <main>{children}</main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
