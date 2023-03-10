import React from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

import { VideoCameraOutlined } from '@ant-design/icons';

import { Typography, Popconfirm, Button, message, Table } from 'antd';

const { Title } = Typography;

const Header = styled.header`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin: 0;
    }
  }
`;

const Actions = styled.div`
  > * {
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
`;

const GET_EVENTS = gql`
  query GetEvents($username: String) {
    events(where: { account: { username: { _eq: $username } } }) {
      id
      type
      name
      start
      end
      price
      published
      account {
        name
        username
      }
    }
  }
`;

const DELETE_EVENT = gql`
  mutation DeleteEvent($id: uuid!) {
    delete_events_by_pk(id: $id) {
      id
    }
  }
`;

export default function Events(props) {
  let { username } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_EVENTS, {
    variables: {
      username
    }
  });

  const [deleteEvent] = useMutation(DELETE_EVENT);

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  let ui = {};
  if (props?.admin) {
    ui.addUrl = `/admin/events/add`;
    ui.editUrl = `/admin/events/edit`;
    ui.redirect = `/admin/events`;
  } else {
    ui.addUrl = `/${username}/manage/events/add`;
    ui.editUrl = `/${username}/manage/events/edit`;
    ui.redirect = `/${username}/manage/events`;
  }

  let tableData = data.events.map((event) => {
    return {
      ...event,
      username: event?.account?.username,
      account: event?.account?.name
    };
  });

  const handleDeleteEvent = async (event) => {
    try {
      await deleteEvent({ variables: { id: event.id } });
    } catch (e) {
      if (e.message.includes('Foreign key violation')) {
        message.error('Unable to delete due to dependent records');
      }
    }
    refetch();
  };

  const columns = [
    {
      title: 'Event Name',
      key: 'name',
      render: (event) => {
        return (
          <Link to={`/${event.username}/manage/events/${event.id}`}>
            {event.name}
          </Link>
        );
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Published',
      dataIndex: 'published',
      key: 'published'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Start',
      key: 'Start',
      render: (event) => moment(event.start).format('MMMM Do h:mm a')
    },
    {
      title: 'End',
      key: 'end',
      render: (event) => moment(event.end).format('MMMM Do h:mm a')
    },
    {
      title: 'Actions',
      key: 'id',
      align: 'center',
      width: 180,
      render: (event) => {
        return (
          <Actions>
            <Link to={`${ui.editUrl}/${event.id}`}>
              <Button>Edit</Button>
            </Link>

            <Popconfirm
              title="Are you sure?"
              onConfirm={() => handleDeleteEvent(event)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Actions>
        );
      }
    }
  ];

  if (props.admin) {
    columns.unshift({
      title: 'Account Name',
      key: 'account',
      render: (event) => {
        return <Link to={`/${event.username}`}>{event.account}</Link>;
      }
    });
  }

  return (
    <article className="min-h-page">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <Header>
          <Title>Events</Title>
          <Link to={ui.addUrl}>
            <Button icon={<VideoCameraOutlined />} type="primary" size="large">
              Create Event
            </Button>
          </Link>
        </Header>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={tableData}
          scroll={{ x: 1200 }}
        />
      </div>
    </article>
  );
}

Events.propTypes = {
  admin: PropTypes.bool
};
