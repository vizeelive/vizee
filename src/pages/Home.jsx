import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import useAuth from '../hooks/useAuth';

import { isMobile } from 'react-device-detect';

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
    events {
      id
      name
      start
      photo
      preview
      type
      price
      end
      location
      location_pos
      account {
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
      type
      price
      end
      location
      location_pos
      account {
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
      type
      price
      end
      account {
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
      }
    ) {
      id
      name
      start
      photo
      preview
      type
      price
      end
      account {
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

// const Hero = styled.div`
//   margin: 100px;
// `;

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
  const events = searchData?.events || data.events;

  // const onChange = () => {};

  // const contentStyle = {
  //   height: "160px",
  //   color: "#fff",
  //   lineHeight: "160px",
  //   textAlign: "center",
  //   background: "#364d79",
  // };

  return (
    <React.Fragment>
      {!isMobile && <Map events={events} />}

          <MainContent>
            {/* <Hero>
        <h1>
          An event platform for accounts, creators, and educators. Go ahead,
          your audience is waiting.
        </h1>
      </Hero> */}
            {user && showModal && <FinishSignup setShowModal={setShowModal} />}
            {/* <Divider /> */}
            {/* <Tag color="magenta">Live Now!</Tag><br /> */}
            {/* <Carousel afterChange={onChange}>
        <div>
          <img src="https://dam-media.s3.amazonaws.com/0b/7631c4ad0a400ba9fe5da4d2cdbc01/Damian-Marley-and-Third-World-2019-billboard-1548-1024x677.jpg" alt="thangs" />
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel> */}
            <Tabs defaultActiveKey="Music">
              {categories.map((category) => {
                // @TODO use view count once we have pagination here
                let count = events.filter((e) => e.category.id === category.id);
                if (!count.length) return null;
                return (
                  <TabPane tab={category.name} key={category.name}>
                    {/* <Title>{category.name}</Title> */}
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
