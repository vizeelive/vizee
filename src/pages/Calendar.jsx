import React from 'react';
import moment from 'moment';
import { Layout, Alert, Typography } from 'antd';
import styled from 'styled-components';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { gql, useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const { Title } = Typography;

const localizer = momentLocalizer(moment);

const GET_EVENTS = gql`
  query MyQuery {
    events {
      id
      name
      start
      end
      price
      account {
        name
      }
    }
  }
`;

const GET_FAVORITE_EVENTS = gql`
  query GetFavoriteEvents($user_id: uuid!) {
    favorite_events(where: { user_id: { _eq: $user_id } }) {
      id
      name
      start
      end
    }
  }
`;

const MainContent = styled.div`
  margin: ${({ isAdmin }) => isAdmin ? '0' : '20px'};
  min-height: calc(100vh - 64px);
`;

const Cal = (props) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');

  let query;
  let options;
  if (props.favorite) {
    query = GET_FAVORITE_EVENTS;
    options = { variables: { user_id: user.id } };
  } else {
    query = GET_EVENTS;
    options = {};
  }
  const { loading, error, data } = useQuery(query, options);

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  let events = data?.favorite_events || data?.events;

  events = events.map((event) => {
    return {
      id: event.id,
      title: event.name,
      start: event.start,
      end: event.end
    };
  });

  return (
    <Layout>
      <MainContent isAdmin={isAdmin}>
        <Alert
          message="How The Calendar Works"
          description="Events will appear on the calendar when you favorite events, or purchase access to events. It's so easy!"
          type="info"
          showIcon
        />
        <div style={{ marginTop: '20px', height: '800px' }}>
          <Title>Calendar</Title>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
          />
        </div>
      </MainContent>
    </Layout>
  );
};

export default Cal;
