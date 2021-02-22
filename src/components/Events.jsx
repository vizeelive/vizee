import React from 'react';
import { gql, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';
import EventCard from './EventCard';

const CREATE_FAVORITE = gql`
  mutation CreateFavorite($object: favorites_insert_input!) {
    insert_favorites_one(object: $object) {
      id
      event_id
    }
  }
`;

export default function Events(props) {
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
    props.refetch();
  };

  let events;
  if (props.category) {
    events = props.events.filter((event) => {
      return event.category.id === props.category;
    });
  } else {
    events = props.events;
  }

  var pastEvents = [];
  var currentEvents = [];

  events.sort((a, b) => {
    if (new Date(a.start) > new Date(b.start)) {
      return -1;
    }
    if (new Date(a.start) < new Date(b.start)) {
      return 1;
    }
    return 0;
  });

  events.forEach((event) => {
    if (event.hasEnded()) {
      pastEvents.push(event);
    } else {
      currentEvents.push(event);
    }
  });

  return (
    <React.Fragment>
      <h1 class="text-2xl mt-3">Upcoming Events</h1>
      <div className="event-grid mt-2" data-test-id="events">
        {currentEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            user={user}
            onFavoriteClick={(e) =>
              event?.favorites?.length ? () => {} : handleFavorite(e, event)
            }
          />
        ))}
      </div>
      <h1 class="text-2xl mt-8">Event Catalog</h1>
      <div className="event-grid mt-2" data-test-id="events">
        {pastEvents.map((event) => (
          <EventCard
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
  );
}

Events.propTypes = {
  refetch: PropTypes.func.isRequired,
  category: PropTypes.string,
  events: PropTypes.array.isRequired
};
