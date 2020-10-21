import React from 'react';
import styled from 'styled-components';
import { gql, useMutation } from '@apollo/client';
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

  return (
    <Grid>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          user={user}
          onFavoriteClick={(e) =>
            event?.favorites?.length ? () => {} : handleFavorite(e, event)
          }
        />
      ))}
    </Grid>
  );
}
