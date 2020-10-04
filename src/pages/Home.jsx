import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import useAuth from "../hooks/useAuth";

import FinishSignup from "../components/FinishSignup";
import Events from "../components/Events";

import { Tabs, Input } from "antd";

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
  query MyQuery {
    events {
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
    categories {
      id
      name
    }
  }
`;

const SEARCH_EVENTS = gql`
  query SearchEvents($q: String!) {
    events(where: { name: { _ilike: $q } }) {
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
    categories {
      id
      name
    }
  }
`;

const MainContent = styled.div`
  padding: 20px;
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

  const [searchEvents, { data: searchData }] = useLazyQuery(SEARCH_EVENTS);

  useEffect(() => {
    if (data) {
      if (!data?.users_by_pk?.first_name || !data?.users_by_pk?.first_name) {
        setShowModal(true);
      }
    }
  }, [data]);

  if (loading) return "Loading...";
  if (error) return "Error.";

  const search = async (val) => {
    searchEvents({ variables: { q: `%${val}%` } });
  };

  const categories = data?.categories;
  const events = searchData?.events || data.events;

  return (
    <MainContent>
      {/* <Hero>
        <h1>
          An event platform for accounts, creators, and educators. Go ahead,
          your audience is waiting.
        </h1>
      </Hero> */}
      <Input
        placeholder="Search"
        onChange={(e) => search(e.currentTarget.value)}
      />
      {user && showModal && <FinishSignup setShowModal={setShowModal} />}
      <Tabs defaultActiveKey="Music">
        {categories.map((category) => {
          // @TODO use view count once we have pagination here
          let count = events.filter((e) => e.category.id === category.id);
          if (!count.length) return null;
          return (
            <TabPane tab={category.name} key={category.name}>
              <h1>{category.name}</h1>
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
  );
}
