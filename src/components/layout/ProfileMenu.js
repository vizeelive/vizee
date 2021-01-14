import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import Cookies from 'js-cookie';
import useOnClickOutside from '../../hooks/useOnClickOutside';

export default function ProfileMenu(props) {
  const { user, creator, account, onLogout } = props;

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleCloseMenu = useCallback(
    (e) => {
      if (buttonRef.current.contains(e.target)) {
        return;
      }
      setIsOpen(false);
    },
    [setIsOpen]
  );

  useOnClickOutside(menuRef, handleCloseMenu);

  const location = useLocation();
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const username = Cookies.get('username') || account?.username;
  const isNetwork = !creator;

  let photo =
    user.picture ||
    `https://avatars.dicebear.com/api/initials/${user.email}.svg`;

  return (
    <div className="ml-3 relative">
      <div data-test-id="menu-profile">
        <button
          ref={buttonRef}
          className="max-w-xs bg-gray-900 rounded-full flex items-center text-sm shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500"
          id="user-menu"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="true"
        >
          <img className="h-8 w-8 rounded-full" src={photo} alt={user.email} />
        </button>
      </div>

      <Transition
        show={isOpen}
        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black-20"
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu"
      >
        <div ref={menuRef}>
          {account && isNetwork && (
            <Link
              to={`/${username}/manage`}
              className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white-5 transition-none"
              role="menuitem"
            >
              My Account
            </Link>
          )}
          {account && isNetwork && (
            <Link
              to={`/account`}
              className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white-5 transition-none"
              role="menuitem"
            >
              Create new account
            </Link>
          )}
          {account && (
            <a
              data-test-id="menu-subscriptions"
              href={user.portalUrl}
              className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white-5 transition-none"
              role="menuitem"
            >
              Subscriptions
            </a>
          )}
          {account && isNetwork && (
            <Link
              to={`/${username}/manage/settings/${account.id}/account`}
              className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white-5 transition-none"
              role="menuitem"
            >
              Settings
            </Link>
          )}
          <button
            data-test-id="menu-logout"
            type="button"
            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white-5 transition-none"
            role="menuitem"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </Transition>
    </div>
  );
}
