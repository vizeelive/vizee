import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import useAuth from '../hooks/useAuth';

import { isMobile } from 'react-device-detect';

import Mapper from '../services/mapper';

import FinishSignup from '../components/FinishSignup';
import Map from '../components/Map';
import Events from '../components/Events';
import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

import { SearchOutlined } from '@ant-design/icons';

import { Tabs, Input } from 'antd';

const { TabPane } = Tabs;

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

const MainContent = styled.main`
  padding: 0 20px 20px;
  min-height: calc(100vh - 64px);
`;

const HeroText = styled.div`
  position: relative;
  bottom: 14vh;
  color: white;
  font-size: 30px;
  font-weight: 800;
  text-align: center;
  opacity: 0.8;
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

  if (loading) {
    return (
      <Centered height="calc(100vh - 64px)">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error.';

  const search = async (val) => {
    searchEvents({ variables: { q: `%${val}%` } });
  };

  const categories = data?.categories;
  const events = Mapper(searchData?.events || data.events);

  return (
    <React.Fragment>
      {/* {!isMobile && <Map events={events} />} */}
      {!isMobile && (
        <div style={{ height: '300px' }}>
          <video
            src="https://dam-media.s3.amazonaws.com/concert.mp4"
            width="100%"
            height="300px"
            autoPlay
            muted
            loop
            style={{ objectFit: 'cover' }}
          />
          <HeroText>
            Premium Video Network.
            <br />
            Sell tickets. Earn up to 90% of every dollar.
          </HeroText>
        </div>
      )}

      <MainContent>
        {user && showModal && <FinishSignup setShowModal={setShowModal} />}
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
