import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

import {
  Statistic,
  Row,
  Col,
  Button,
  Divider,
  Table,
  Tabs,
  Typography
} from 'antd';
const { Title } = Typography;

const ACCOUNT_REPORT = gql`
  query AccountReport($username: String!) {
    account_report(where: { username: { _eq: $username } }) {
      events
      favorites
      id
      username
      name
      revenue
      subscriptions
      views
      account {
        events {
          id
          name
        }
      }
    }
  }
`;

export default function Dashboard() {
  let { id, username } = useParams();

  const { loading, error, data } = useQuery(ACCOUNT_REPORT, {
    fetchPolicy: 'cache-and-network',
    variables: { username }
  });

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const account = data?.account_report?.[0];

  console.log({ account });

  return (
    <React.Fragment>
      <Title>{account.name}</Title>

      <Row gutter={16}>
        <Col span={4}>
          <Statistic title="Revenue" value={account.revenue} precision={2} />
        </Col>
        <Col span={4}>
          <Statistic title="Views" value={account.views} />
        </Col>
        <Col span={4}>
          <Statistic title="Favorites" value={account.favorites} />
        </Col>
        <Col span={4}>
          <Statistic title="Subscriptions" value={account.subscriptions} />
        </Col>
        <Col span={4}>
          <Statistic title="Events" value={account.events} />
        </Col>
      </Row>

      <Divider />
    </React.Fragment>
  );
}
