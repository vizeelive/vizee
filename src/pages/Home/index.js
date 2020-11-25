import React, { useState, useEffect } from 'react';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import useAuth from '../../hooks/useAuth';
import { isMobile } from 'react-device-detect';

import Mapper from '../../services/mapper';
import HomeView from './view';

const GET_EVENTS_AUTH = gql`
  query GetHomeData($id: String!) {
    users_by_pk(id: $id) {
      id
      first_name
      last_name
    }
    events(where: { account: { stripe_data: { _is_null: false } } }) {
      id
      name
      start
      photo
      preview
      thumb
      type
      price
      end
      location
      location_pos
      published
      account {
        id
        name
        username
        photo
        users {
          user {
            id
          }
        }
      }
      category {
        id
        name
      }
      transactions {
        id
      }
      favorites {
        id
      }
    }
    categories {
      id
      name
    }
  }
`;

const GET_EVENTS_UNAUTH = gql`
  query AnonGetEvents {
    events {
      id
      name
      start
      photo
      preview
      thumb
      type
      price
      end
      location
      location_pos
      account {
        id
        name
        username
        photo
      }
      category {
        id
      }
    }
    categories {
      id
      name
    }
  }
`;

const SEARCH_EVENTS_UNAUTH = gql`
  query SearchEvents($q: String!) {
    events(
      where: {
        _or: [{ account: { name: { _ilike: $q } } }, { name: { _ilike: $q } }]
      }
    ) {
      id
      name
      start
      photo
      preview
      thumb
      type
      price
      end
      account {
        id
        name
        username
        photo
      }
      category {
        id
      }
    }
  }
`;

const SEARCH_EVENTS_AUTH = gql`
  query SearchEvents($q: String!) {
    events(
      where: {
        _or: [{ account: { name: { _ilike: $q } } }, { name: { _ilike: $q } }]
        _and: { account: { stripe_data: { _is_null: false } } }
      }
    ) {
      id
      name
      start
      photo
      preview
      thumb
      type
      price
      end
      location
      account {
        id
        name
        username
        photo
      }
      category {
        id
        name
      }
      transactions {
        id
      }
      favorites {
        id
      }
    }
  }
`;

export default function Home() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const { loading, error, data, refetch } = useQuery(
    user ? GET_EVENTS_AUTH : GET_EVENTS_UNAUTH,
    { variables: { id: user?.sub } }
  );

  const [searchEvents, { data: searchData }] = useLazyQuery(
    user ? SEARCH_EVENTS_AUTH : SEARCH_EVENTS_UNAUTH
  );

  useEffect(() => {
    if (data) {
      if (!data?.users_by_pk?.first_name || !data?.users_by_pk?.first_name) {
        setShowModal(true);
      }
    }
  }, [data]);

  let categories, events;
  if (data) {
    categories = data?.categories;
    events = Mapper(searchData?.events || data.events);
  }

  const search = async (val) => {
    searchEvents({ variables: { q: `%${val}%` } });
  };

  const props = {
    error,
    loading,
    categories,
    events,
    search,
    isMobile,
    searchData,
    refetch,
    showModal
  };

  return <HomeView {...props} />;
}