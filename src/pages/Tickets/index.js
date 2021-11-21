import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

import TicketsView from './view';
import Mapper from 'services/mapper';

const MY_TRANSACTIONS = gql`
  query MySubscriptionsPage($user_id: uuid!) {
    users_by_pk(id: $user_id) {
      id
      access {
        id
        account {
          id
          name
          username
          photo
        }
        event {
          id
          name
          thumb
          photo
          account {
            id
            name
            username
            photo
          }
        }
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

  let purchases = Mapper(data?.users_by_pk?.access)?.map((access) => {
    let url;
    if (access.account) {
      url = `/${access.account.username}`;
    } else {
      url = `/${access.event.account.username}/${access.event.id}`;
    }
    return {
      url,
      id: access.id,
      account: access.account?.name || access.event?.account?.name,
      cover: access.account ? access.account.cover() : access.event.cover(),
      name: access.account ? access.account.name : access.event.name
    };
  });

  return (
    <TicketsView
      isAdmin={isAdmin}
      purchases={purchases}
      refetch={refetch}
      loading={loading}
      error={error}
    />
  );
};

export default Tickets;
