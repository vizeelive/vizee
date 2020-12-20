import React from 'react';

export default function Footer({ className }) {
  return (
    <footer className={className}>
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <p className="text-center text-base text-gray-500 m-0">
          &copy; {`${new Date().getFullYear()} `}
          <a
            href="https://vizee.live"
            className="text-gray-500 hover:text-white transition-none"
          >
            <a href="https://www.vizee.live">Vizee</a>
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
