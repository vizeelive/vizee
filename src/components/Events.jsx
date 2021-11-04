import React from 'react';
import { gql, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';
import EventCard from './EventCard';
import { useHistory, useLocation } from 'react-router-dom';

const CREATE_FAVORITE = gql`
  mutation CreateFavorite($object: favorites_insert_input!) {
    insert_favorites_one(object: $object) {
      id
      event_id
    }
  }
`;

export default function Events({ events, refetch, selectCallback }) {
  const { user } = useAuth();
  const [createFavorite] = useMutation(CREATE_FAVORITE);

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
                selectCallback={selectCallback}
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
  selectCallback: PropTypes.func
};
