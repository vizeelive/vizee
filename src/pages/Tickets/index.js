import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

import TicketsView from './view';
import Mapper from 'services/mapper';

const MY_TRANSACTIONS = gql`
  query MyTransactions($user_id: uuid!) {
    transactions(where: { user_id: { _eq: $user_id } }) {
      event {
        id
        account {
          name
          photo
          username
        }
        favorites {
          id
        }
        name
        photo
        preview
        price
        start
        type
        video
        location
        description
      }
    }
  }
`;

const Tickets = (props) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');
  const { loading, error, data, refetch } = useQuery(MY_TRANSACTIONS, {
    variables: { user_id: user.id }
  });

  let events = Mapper(data?.transactions.map((t) => t.event));

  return (
    <TicketsView
      isAdmin={isAdmin}
      events={events}
      refetch={refetch}
      loading={loading}
      error={error}
    />
  );
};

export default Tickets;
