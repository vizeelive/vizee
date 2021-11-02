import React from 'react';
import { Layout, Typography } from 'antd';
import styled from 'styled-components';

import Events from 'components/Events';
import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

const { Title } = Typography;

export default function TicketsView(props) {
  const { isAdmin, events, refetch, loading, error } = props;

  const MainContent = styled.div`
    margin: ${({ isAdmin }) => (isAdmin ? '0' : '20px')};
    min-height: calc(100vh - 64px);
  `;

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  return (
    <Layout>
      <MainContent isAdmin={isAdmin}>
        <div style={{ marginTop: '20px', height: '800px' }}>
          <Title>My Subscriptions</Title>
          <Events events={events} refetch={refetch} />
        </div>
      </MainContent>
    </Layout>
  );
}
