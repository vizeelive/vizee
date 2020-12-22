import React from 'react';
import styled from 'styled-components';
import { Tabs, Input } from 'antd';

// import Map from '../components/Map';
import Events from 'components/Events';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';
import 'animate.css';

import { SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

export default function HomeView(props) {
  const {
    user,
    loading,
    error,
    categories,
    events,
    refetch,
    search,
    onLogin
  } = props;

  if (loading) {
    return (
      <Centered height="calc(100vh - 184px)">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error.';

  const MainContent = styled.main`
    padding: 0 20px 20px;
    min-height: calc(100vh - 64px);
  `;

  return (
    <React.Fragment>
      {/* {!isMobile && <Map events={events} />} */}
      <div className="relative bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-black sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
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
              <div className="sm:text-center lg:text-left">
                <h1 className="text-5xl tracking-tight font-sans font-extrabold text-gray-100 sm:text-6xl md:text-7xl">
                  <span className="block">Premium</span>{' '}
                  <span className="block text-pink-600">video network</span>
                </h1>
                <p className="mt-3 text-lg text-gray-500 font-sans sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-5 md:text-2xl lg:mx-0">
                  Sell videos.{' '}
                  <span className="text-gray-200 font-semibold">
                    Earn up to 90% of every dollar.
                  </span>
                </p>
                <div className="mt-5 xs:mt-12 xs:flex xs:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    {!user && (
                      <button
                        type="button"
                        onClick={onLogin}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 md:text-lg md:px-10 lg:text-xl"
                      >
                        Get Started
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </header>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <video
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://vizee-media.s3.amazonaws.com/layers.mp4"
            autoPlay
            playsInline
            muted
            loop
          />
        </div>
      </div>

      <MainContent>
        <Tabs defaultActiveKey="Music">
          {categories.map((category) => {
            // @TODO use view count once we have pagination here
            let count = events.filter((e) => e.category.id === category.id);
            if (!count.length) return null;
            return (
              <TabPane tab={category.name} key={category.name}>
                <Input
                  placeholder="Search"
                  onChange={(e) => search(e.currentTarget.value)}
                  style={{ maxWidth: '40rem', marginBottom: '20px' }}
                  prefix={<SearchOutlined />}
                  size="large"
                />
                <Events
                  events={events}
                  category={category.id}
                  refetch={refetch}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </MainContent>
    </React.Fragment>
  );
}
