import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Statistic,
  Row,
  Col,
  Button,
  Divider,
  Table,
  Tabs,
  message
} from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import useAuth from 'hooks/useAuth';

import { gql, useQuery, useMutation } from '@apollo/client';

import { CalendarOutlined } from '@ant-design/icons';

import ShareButton from '../../components/ShareButton';
import TrafficMap from '../../components/TrafficMap';
import { Centered } from '../../components/styled/common';
import Spinner from '../../components/ui/Spinner';

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

const INSERT_CODES = gql`
  mutation GenerateCodes($objects: [access_codes_insert_input!]!) {
    insert_access_codes(objects: $objects) {
      affected_rows
    }
  }
`;

const WATCH_EVENT_REPORT = gql`
  query EventReport($id: uuid!) {
    events_report(where: { id: { _eq: $id } }) {
      id
      type
      name
      start
      end
      price
      photo
      preview
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
      access_codes {
        id
        recipient {
          email
        }
        created
      }
      transaction {
        id
        price
        email
        created
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
  const { user } = useAuth();

  const { loading, error, data } = useQuery(GET_EVENT_AUTH, {
    variables: { id }
  });

  const [insertCodes] = useMutation(INSERT_CODES);

  const {
    loading: eventLoading,
    data: eventData,
    refetch
  } = useQuery(WATCH_EVENT_REPORT, { variables: { id } });

  if (loading || eventLoading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const handleGenerateCodes = async () => {
    try {
      await insertCodes({
        variables: {
          objects: [
            {
              event_id: id,
              price: '$0',
              ...(user?.isAdmin ? { created_by: user.id } : null)
            }
          ]
        }
      });
      refetch();
    } catch (e) {
      message.error('An error occurred');
      throw e;
    }
  };

  const event = { ...eventData?.events_report[0] };
  const views = event?.view;
  const view_report = data?.view_report;

  const columns = [
    {
      title: 'Date',
      dataIndex: 'created'
    },
    {
      title: 'First Name',
      dataIndex: 'first_name'
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name'
    },
    {
      title: 'Email',
      dataIndex: 'email'
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
      email: t.email,
      first_name: t?.user?.first_name,
      last_name: t?.user?.last_name,
      city: t?.user?.city,
      country: t?.user?.country,
      created: moment(t?.created).format('llll')
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

  const codeColumns = [
    {
      title: 'Code',
      dataIndex: 'id'
    },
    {
      title: 'Recipient',
      dataIndex: 'recipient'
    }
  ];

  const codeData = event.access_codes.map((code) => {
    return {
      id: code.id,
      recipient: code?.recipient?.email || 'Unclaimed'
    };
  });

  const origin = process.env.REACT_APP_DOMAIN || window.location.origin;

  return (
    <article className="min-h-page">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Menu>
          <ShareButton url={`${origin}/${username}/${event.id}`} />
          <Button type="primary" size="large">
            <Link to={`/${username}/manage/events/edit/${event.id}`}>
              Edit Event
            </Link>
          </Button>
        </Menu>
        <h2>
          <Link to={`/events/${event.id}`} className="text-2xl">
            {event.name}
          </Link>
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
          {/* {user.isAdmin && (
            <TabPane tab="Access Codes" key="codes">
              <Button onClick={handleGenerateCodes}>Generate Code</Button>
              <br />
              <br />
              <Table rowKey="id" columns={codeColumns} dataSource={codeData} />
            </TabPane>
          )} */}
        </Tabs>
      </div>
    </article>
  );
}
