import React from 'react';
import { Layout, Typography } from 'antd';
import styled from 'styled-components';
import { gql, useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

import Mapper from '../services/mapper';
import Events from '../components/Events';

import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

const { Title } = Typography;

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

const MainContent = styled.div`
  margin: ${({ isAdmin }) => (isAdmin ? '0' : '20px')};
  min-height: calc(100vh - 64px);
`;

const Tickets = (props) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');
  const { loading, error, data, refetch } = useQuery(MY_TRANSACTIONS, {
    variables: { user_id: user.id }
  });

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  let events = Mapper(data?.transactions.map((t) => t.event));

  return (
    <Layout>
      <MainContent isAdmin={isAdmin}>
        <div style={{ marginTop: '20px', height: '800px' }}>
          <Title>My Tickets</Title>
          <Events events={events} refetch={refetch} />
        </div>
      </MainContent>
    </Layout>
  );
};

export default Tickets;
