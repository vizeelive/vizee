import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Statistic, Row, Col, Button, Divider, Table, Tabs } from 'antd';
import moment from 'moment';
import styled from 'styled-components';

import { gql, useQuery, useSubscription } from '@apollo/client';

import { CalendarOutlined } from '@ant-design/icons';

import ShareButton from '../components/ShareButton';
import TrafficMap from '../components/TrafficMap';
import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

const { TabPane } = Tabs;

// @TODO only let certain roles select revenue..
const GET_EVENT_AUTH = gql`
  query UserEventsReport($id: uuid!) {
    view_report(where: { event_id: { _eq: $id } }) {
      city
      count
      country
      event_id
      region
    }
  }
`;

const WATCH_EVENT_REPORT = gql`
  subscription WatchEventReport($id: uuid!) {
    events_report(where: { id: { _eq: $id } }) {
      id
      type
      name
      start
      end
      price
      photo
      preview
      video
      location
      description
      transactions
      favorites
      revenue
      views
      account {
        name
        username
        photo
      }
      transaction {
        id
        price
        user {
          first_name
          last_name
          city
          country
        }
      }
      view {
        id
        city
        region
        country
        timezone
        loc
      }
    }
  }
`;

const Menu = styled.div`
  float: right;
  button {
    margin-right: 10px;
  }
`;

export default function ViewEvent() {
  let { id, username } = useParams();

  const { loading, error, data } = useQuery(GET_EVENT_AUTH, {
    fetchPolicy: 'cache-and-network',
    variables: { id }
  });

  const {
    loading: eventLoading,
    data: eventData
  } = useSubscription(WATCH_EVENT_REPORT, { variables: { id } });

  if (loading || eventLoading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const event = { ...eventData?.events_report[0] };
  const views = event?.view;
  const view_report = data?.view_report;

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'first_name'
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name'
    },
    {
      title: 'City',
      dataIndex: 'city'
    },
    {
      title: 'Country',
      dataIndex: 'country'
    },
    {
      title: 'Price',
      dataIndex: 'price'
    }
  ];

  const transactionData = event.transaction.map((t) => {
    return {
      id: t.id,
      price: t.price,
      first_name: t.user.first_name,
      last_name: t.user.last_name,
      city: t.user.city,
      country: t.user.country
    };
  });

  const viewColumns = [
    {
      title: 'City',
      dataIndex: 'city'
    },
    {
      title: 'Region',
      dataIndex: 'region'
    },
    {
      title: 'Country',
      dataIndex: 'country'
    },
    {
      title: 'Visits',
      dataIndex: 'visits'
    }
  ];

  const viewData = view_report.map((v) => {
    return {
      id: Math.random(),
      city: v.city,
      country: v.country,
      region: v.region,
      visits: v.count
    };
  });

  return (
    <React.Fragment>
      <Menu>
        <ShareButton />
        <Button type="primary">
          <Link to={`/${username}/manage/events/edit/${event.id}`}>
            Edit Event
          </Link>
        </Button>
      </Menu>
      <h2>
        <Link to={`/events/${event.id}`}>{event.name}</Link>
      </h2>
      <div>
        <CalendarOutlined /> {moment(event.start).format('MMMM Do h:mm a')} -{' '}
        {moment(event.end).format('MMMM Do h:mm a')}
      </div>
      <div>
        <small>{event.location}</small>
      </div>
      <Divider />
      {/* <div>{event.description}</div> */}

      <Row gutter={16}>
        <Col span={4}>
          <Statistic
            title="Revenue"
            value={event.revenue || '$0'}
            precision={2}
          />
        </Col>
        <Col span={4}>
          <Statistic title="Tickets" value={event.transactions} />
        </Col>
        <Col span={4}>
          <Statistic title="Views" value={event.views || 0} />
        </Col>
        <Col span={4}>
          <Statistic title="Favorites" value={event.favorites} />
        </Col>
      </Row>

      <Divider />

      <Tabs>
        <TabPane tab="Traffic" key="traffic">
          {' '}
          <TrafficMap views={views} />
          <Table rowKey="id" columns={viewColumns} dataSource={viewData} />
        </TabPane>
        <TabPane tab="Transactions" key="account">
          <Table rowKey="id" columns={columns} dataSource={transactionData} />
        </TabPane>
        <TabPane tab="Access Codes" key="codes"></TabPane>
      </Tabs>
    </React.Fragment>
  );
}
