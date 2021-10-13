import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';
import EventCard from './EventCard';
import TagCloud from './TagCloud';
import { useHistory, useLocation } from 'react-router-dom';
import { Modal } from 'antd';


function useQueryParam(param) {
  return new URLSearchParams(useLocation().search).get(`${param}`);
}

const CREATE_FAVORITE = gql`
  mutation CreateFavorite($object: favorites_insert_input!) {
    insert_favorites_one(object: $object) {
      id
      event_id
    }
  }
`;


function isEventAFilteredTagged(tagFilters, event) {
  return tagFilters.find(tagFilter => {
    return event.tags.find((tag) => {
      return tagFilter === tag
    });
  });
}


export default function Events({
  availableTags,
  showTags,
  setShowTags = () => void 0,
  category,
  events: eventsFromQuery = [],
  refetch
}) {
  const { user } = useAuth();
  const [createFavorite] = useMutation(CREATE_FAVORITE);
  const filteredTagsFromQueryParams = useQueryParam('c');
  const history = useHistory();

  const tagFilters = filteredTagsFromQueryParams
    ? filteredTagsFromQueryParams
        .split(',')
        .map((tag) => tag.replaceAll('-', ' '))
    : [];

  const handleTagChange = (newTag, allTags) => {
    history.replace(`?c=${allTags.join(',').replaceAll(' ', '-')}`);
  };

  const handleFavorite = async (e, event) => {
    // e.preventDefault();
    await createFavorite({
      variables: {
        object: {
          event_id: event.id,
          account_id: event.account.id
        }
      }
    });
    refetch();
  };

  let events;
  if (category) {
    events = eventsFromQuery.filter((event) => {
      return event.category.id === category;
    });
  } else {
    events = eventsFromQuery;
  }

  if (tagFilters.length) {
    events = events.filter((event) => {
      return isEventAFilteredTagged(tagFilters, event);
    });
  }

  // let pastEvents = [];
  // let currentEvents = [];

  events.sort((a, b) => {
    if (new Date(a.start) > new Date(b.start)) {
      return -1;
    }
    if (new Date(a.start) < new Date(b.start)) {
      return 1;
    }
    return 0;
  });

  // events.forEach((event) => {
  //   if (!event.hasStarted() || event.isAvailable()) {
  //     currentEvents.push(event);
  //   } else {
  //     pastEvents.push(event);
  //   }
  // });

  return (
    <React.Fragment>
      <Modal
        className="events__category-modal"
        title={
          <>
            <header>Keyword Categories</header>
            {tagFilters.length > 0 && (
              <a onClick={() => handleTagChange('', [])}>clear all</a>
            )}
          </>
        }
        visible={showTags}
        footer={null}
        centered
        onCancel={() => setShowTags((showTagsCurrent) => !showTagsCurrent)}
      >
        <TagCloud
          selectedTags={tagFilters}
          availableTags={availableTags}
          onTagSelected={handleTagChange}
        />
      </Modal>

      {/* {currentEvents.length ? (
        <React.Fragment>
          <h1 className="text-2xl mt-6">Upcoming Events</h1>
          <div className="event-grid mt-2" data-test-id="events">
            {currentEvents.map((event) => (
              <EventCard
                refetch={refetch}
                key={event.id}
                event={event}
                user={user}
                onFavoriteClick={(e) =>
                  event?.favorites?.length ? () => {} : handleFavorite(e, event)
                }
              />
            ))}
          </div>
        </React.Fragment>
      ) : null} */}

      {events.length ? (
        <React.Fragment>
          {/* <h1 className="text-2xl mt-8">Event Catalog</h1> */}
          <div className="event-grid mt-2" data-test-id="events">
            {events.map((event) => (
              <EventCard
                refetch={refetch}
                key={event.id}
                event={event}
                user={user}
                onFavoriteClick={(e) =>
                  event?.favorites?.length ? () => {} : handleFavorite(e, event)
                }
              />
            ))}
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
}

Events.propTypes = {
  refetch: PropTypes.func.isRequired,
  category: PropTypes.string,
  events: PropTypes.array.isRequired,
  showTags: PropTypes.bool,
  setShowTags: PropTypes.func,
};
