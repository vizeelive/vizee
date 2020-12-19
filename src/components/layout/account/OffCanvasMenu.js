import React, { useState, useEffect, useRef } from 'react';
import { Transition } from '@headlessui/react';
import cn from 'classnames';
import Menu from './Menu';

export default function OffCanvasMenu(props) {
  const { user, username, account, myAccounts, isOpen, onClose } = props;
  const [hideMenu, setHideMenu] = useState(!isOpen);
  const timerRef = useRef(null);

  useEffect(() => {
    const clearTimer = () => clearTimeout(timerRef.current);

    if (!isOpen) {
      timerRef.current = setTimeout(() => {
        setHideMenu(true);
      }, 300);
    } else {
      setHideMenu(false);
      clearTimer();
    }
  }, [isOpen]);

  return (
    <div
      className={cn('lg:hidden', {
        hidden: hideMenu
      })}
    >
      <div className="fixed inset-0 flex z-40">
        <Transition
          show={isOpen}
          className="fixed inset-0"
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="absolute inset-0 bg-gray-900 opacity-75"
            aria-hidden="true"
          />
        </Transition>

        <Transition
          show={isOpen}
          className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-850"
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className={cn(
                'ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none',
                {
                  'focus:ring-2 focus:ring-inset focus:ring-primary': isOpen,
                  'focus:ring-0 hidden': !isOpen
                }
              )}
              onClick={() => onClose()}
            >
              <span className="sr-only">Close sidebar</span>
              {/* Heroicon name: x */}
              <svg
                className="h-6 w-6 text-white"
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
          <Menu
            user={user}
            username={username}
            account={account}
            myAccounts={myAccounts}
          />
        </Transition>

        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>
    </div>
  );
}
