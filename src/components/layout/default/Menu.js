import React, { useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import cn from 'classnames';
import useAuth from 'hooks/useAuth';
import Button from 'components/ui/Button';
import ProfileMenu from '../ProfileMenu';
import logo from '../../../svg/vizee-logo.svg';
import logoText from '../../../svg/vizee-logo-text.svg';
import cookie from 'js-cookie';

export default function Menu(props) {
  const { loginWithRedirect } = useAuth();
  const history = useHistory();
  const { user, creator, account, hasTickets, onLogin, onLogout } = props;
  const [isOpen, setIsOpen] = useState(false);

  const className = {
    default: {
      inactive:
        'px-3 py-2 rounded-md font-sans menu-item transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-850 focus:ring-primary',
      active: 'menu-active'
    },
    mobile: {
      inactive:
        'group flex items-center px-3 py-3 rounded-md font-sans menu-item transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-850 focus:ring-primary',
      active: 'menu-active'
    }
  };

  const handleClickHelp = () => {
    Intercom('show');
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const handleLogin = () => {
    loginWithRedirect({ returnTo: window.location.pathname });
  };

  return (
    <nav className="bg-gray-850 shadow-nav">
      <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={cn('h-6 w-6', {
                  hidden: isOpen,
                  block: !isOpen
                })}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
              <svg
                className={cn('h-6 w-6', {
                  hidden: !isOpen,
                  block: isOpen
                })}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                {!creator?.logo ? (
                  <React.Fragment>
                    <img
                      className="hidden sm:block lg:hidden h-7 w-auto"
                      src={logo}
                      alt="Vizee"
                    />
                    <img
                      className="block sm:hidden lg:block h-7 w-auto"
                      src={logoText}
                      alt="Vizee"
                    />
                  </React.Fragment>
                ) : (
                  <img className="h-12 w-auto" src={creator.logo} alt="logo" />
                )}
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {/* {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className={className.default.inactive}
                    data-test-id="menu-admin"
                  >
                    Admin
                  </Link>
                )} */}
                <NavLink
                  to="/"
                  exact
                  className={className.default.inactive}
                  activeClassName={className.default.active}
                >
                  Media
                </NavLink>

                {hasTickets && (
                  <NavLink
                    to="/tickets"
                    exact
                    className={className.default.inactive}
                    activeClassName={className.default.active}
                    data-test-id="menu-tickets"
                  >
                    My Subscriptions
                  </NavLink>
                )}

                {/* {user && (
                  <NavLink
                    to="/calendar"
                    exact
                    className={className.default.inactive}
                    activeClassName={className.default.active}
                  >
                    Calendar
                  </NavLink>
                )} */}

                <button
                  type="button"
                  className={className.default.inactive}
                  onClick={handleClickHelp}
                >
                  Help
                </button>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* @todo: NOTIFICATIONS */}
            {/* <button className="bg-gray-850 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-850 focus:ring-white">
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
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button> */}

            {user ? (
              <ProfileMenu
                user={user}
                creator={creator}
                account={account}
                onLogout={onLogout}
              />
            ) : (
              <Button
                onClick={handleLogin}
                type="primary"
                size="responsive"
                offset="gray-850"
                data-test-id="menu-login"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/*
        Mobile menu, toggle classes based on menu state.

        Menu open: "block", Menu closed: "hidden"
      */}
      <div
        className={cn('sm:hidden', {
          hidden: !isOpen,
          block: isOpen
        })}
      >
        <div className="flex-1 flex flex-col overflow-y-auto pt-1 pb-4">
          <div className="px-2 space-y-1">
            {/* {user?.isAdmin && (
              <Link to="/admin" className={className.mobile.inactive}>
                <svg
                  className="mr-3 h-6 w-6"
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Admin
              </Link>
            )} */}

            <NavLink
              to="/"
              exact
              className={className.mobile.inactive}
              activeClassName={className.mobile.active}
              onClick={() => setIsOpen(false)}
            >
              {/* Heroicon name: lightning-bolt */}
              <svg
                className="mr-3 h-6 w-6"
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Events
            </NavLink>

            {hasTickets && (
              <NavLink
                to="/tickets"
                exact
                className={className.mobile.inactive}
                activeClassName={className.mobile.active}
                onClick={() => setIsOpen(false)}
              >
                {/* Heroicon name: ticket */}
                <svg
                  className="mr-3 h-6 w-6"
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
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
                My Subscriptions
              </NavLink>
            )}

            {/* {user && (
              <NavLink
                to="/calendar"
                exact
                className={className.mobile.inactive}
                activeClassName={className.mobile.active}
                onClick={() => setIsOpen(false)}
              >
                <svg
                  className="mr-3 h-6 w-6"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Calendar
              </NavLink>
            )} */}

            <button
              type="button"
              className={`${className.mobile.inactive} block w-full text-left`}
              onClick={handleClickHelp}
            >
              {/* Heroicon name: question-mark-circle */}
              <svg
                className="mr-3 h-6 w-6"
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Help
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
