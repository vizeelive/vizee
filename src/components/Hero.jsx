import React from 'react';
import { Link } from 'react-router-dom';
import ReactRotatingText from 'react-rotating-text';

export default function Hero(props) {
  const { user, onSignup } = props;

  return (
    <div className="relative bg-black overflow-hidden">
      <div>
        <div className="hero-container relative z-10 pb-8 bg-black sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-black transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <nav
              className="relative flex items-center justify-between sm:h-10 lg:justify-start"
              aria-label="Global"
            >
              <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                <div className="flex items-center justify-between w-full md:w-auto"></div>
              </div>
            </nav>
          </div>

          <header className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-24">
            <div className="text-center lg:text-left">
              <h1 className="font-sans text-5xl tracking-tight font-extrabold text-gray-100 sm:text-7xl md:text-8xl lg:text-7xl 2xl:text-8xl">
                <span className="block">Premium</span>{' '}
                <span className="block text-pink-600">
                  <ReactRotatingText
                    items={[
                      'video network',
                      'livestreaming',
                      'money maker',
                      'engagement',
                      'coolness'
                    ]}
                  />
                </span>
              </h1>
              <p className="mt-3 text-lg text-gray-500 font-sans sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-5 md:text-2xl lg:mx-0 2xl:text-3xl 2xl:max-w-full">
                Sell your content.{' '}
                <span className="text-gray-200 font-semibold">
                  Earn up to 80% of every dollar.
                </span>
              </p>
              {!user && (
                <div className="mt-5 xs:mt-12 xs:flex xs:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      data-test-id="get-started"
                      type="button"
                      onClick={onSignup}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 md:text-lg md:px-10 lg:text-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              )}
            </div>
          </header>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <Link to="/layers">
          <video
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://vizee-media.s3.amazonaws.com/layers.mp4"
            autoPlay
            playsInline
            muted
            loop
          />
        </Link>
      </div>
    </div>
  );
}
