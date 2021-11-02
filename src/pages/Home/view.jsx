import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import cn from 'classnames';
// import CountUp from 'react-countup';

// import Map from '../components/Map';
import Hero from 'components/Hero';
import Events from 'components/Events';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';
import useDebounce from 'hooks/useDebounce';
import 'animate.css';

export default function HomeView(props) {
  const {
    user,
    loading,
    error,
    categories,
    allEvents,
    searchLoading,
    searchedEvents,
    refetch,
    search,
    onSignup
  } = props;

  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);

  // show search results or all events
  useEffect(() => {
    if (searchLoading) {
      return;
    }
    if (debouncedSearchText) {
      setEvents(searchedEvents);
    } else {
      setEvents(allEvents);
    }
  }, [allEvents, searchedEvents]);

  // set default active category (only runs once)
  useEffect(() => {
    if (categories && !selectedCategory?.length) {
      const defaultCategoryId = categories?.find((c) => c.name === 'Music')?.id;
      setSelectedCategory(defaultCategoryId);
    }
  }, [categories]);

  // run search query
  useEffect(() => {
    search(debouncedSearchText);
  }, [debouncedSearchText]);

  // when search text is cleared, active category may disappear from menu
  useEffect(() => {
    const noSelectedCategory =
      events.length > 0 &&
      !events.find((e) => e.category.id === selectedCategory);

    if (noSelectedCategory) {
      setSelectedCategory(events[0].category.id);
    }
  }, [events]);

  if (loading) {
    return (
      <Centered height="calc(100vh - 184px)">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error.';

  const handleSearchClick = () => {
    document.getElementById('search').focus();
  };

  const renderTabsMenu = () => (
    <div className="h-12">
      {events.length > 0 && (
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base text-gray-100 bg-gray-800 border-gray-700 focus:outline-none focus:ring-pink-600 focus:border-pink-600 sm:text-sm rounded-md font-sans"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          {categories.map((category) => {
            const count = events.filter((e) => e.category.id === category.id);
            if (!count.length) return null;
            return (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );

  const renderTabs = () => (
    <nav
      className="-mb-px flex space-x-8 max-w-full overflow-x-auto h-14"
      aria-label="Tabs"
    >
      {categories.map((category) => {
        const count = events.filter((e) => e.category.id === category.id);
        if (!count.length) return null;
        return (
          <a
            role="button"
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base transition-colors font-sans',
              {
                'border-pink-500 text-pink-600':
                  category.id === selectedCategory,
                'border-transparent text-gray-300 hover:text-gray-100 hover:border-gray-300':
                  category.id !== selectedCategory
              }
            )}
            aria-current={category.id === selectedCategory ? 'page' : 'false'}
            key={category.id}
          >
            {category.name}
          </a>
        );
      })}
    </nav>
  );

  return (
    <React.Fragment>
      <Helmet>
        <meta
          property="og:image"
          content={'https://vizee.imgix.net/vizee-meta.png?w=500'}
        />
        <meta property="og:title" content={'Vizee'} />
        <meta
          property="og:description"
          content={'The best way to sell your videos'}
        />
        <meta
          name="twitter:image"
          content={'https://vizee.imgix.net/vizee-meta.png?w=500'}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={'Vizee'} />
        <meta
          name="twitter:description"
          content={'The best way to sell your videos'}
        />
      </Helmet>

      <Hero user={user} onSignup={onSignup} />

      <div className="p-4 sm:p-6 lg:p-8 events-container">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a category
          </label>
          {renderTabsMenu()}
        </div>
        <div className="hidden sm:block mb-2">
          <div className="border-b border-gray-800">{renderTabs()}</div>
        </div>

        <div className="lg:flex lg:items-center lg:justify-between py-6 bg-black sticky shadow top-16 z-10">
          <div className="relative lg:max-w-2xl w-full">
            <input
              type="text"
              name="search"
              id="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search Media"
              className="lg:max-w-2xl block w-full shadow-sm text-gray-100 bg-black focus:ring-pink-600 focus:border-pink-600 border-gray-700 rounded-md px-14 py-3"
              autoComplete="off"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={handleSearchClick}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {debouncedSearchText.length > 0 && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
                onClick={() => setSearchText('')}
              >
                <svg
                  className="w-6 h-6 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="hidden lg:block text-gray-300 text-lg font-sans font-bold mb-0">
            Showing {events.length} media
          </p>
        </div>

        {events.length > 0 ? (
          <Events
            events={events}
            category={selectedCategory}
            refetch={refetch}
          />
        ) : (
          <p className="text-gray-500 text-2xl font-sans font-semibold text-center py-32">
            No events found!
          </p>
        )}
      </div>
    </React.Fragment>
  );
}
