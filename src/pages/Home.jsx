import React from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import useAuth from "../hooks/useAuth";

import Events from "../components/Events";

import { Tabs } from "antd";

const { TabPane } = Tabs;

const GET_EVENTS_AUTH = gql`
  query MyQuery {
    events {
      id
      name
      start
      photo
      preview
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
  const { loading, error, data, refetch } = useQuery(
    user ? GET_EVENTS_AUTH : GET_EVENTS_UNAUTH
  );

  if (loading) return "Loading...";
  if (error) return "Error.";

  const callback = () => {};

  const categories = data?.categories;

  return (
    <MainContent>
      {/* <Hero>
        <h1>
          An event platform for accounts, creators, and educators. Go ahead,
          your audience is waiting.
        </h1>
      </Hero> */}
      <Tabs defaultActiveKey="Music" onChange={callback}>
        {categories.map((category) => {
          return (
            <TabPane tab={category.name} key={category.name}>
              <h1>{category.name}</h1>
              <Events
                events={data.events}
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
