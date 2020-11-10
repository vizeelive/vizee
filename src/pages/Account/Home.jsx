import React from 'react';
import { Button, Layout, Typography } from 'antd';
import styled from 'styled-components';
import Events from '../../components/Events';
import { Link, useParams, useLocation } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet';

import { Centered } from '../../components/styled/common';
import Spinner from '../../components/ui/Spinner';
import SubscribeButton from '../../components/SubscribeButton';
import useAuth from '../../hooks/useAuth';

import Mapper from '../../services/mapper';

import {
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

const MainContent = styled(Content)`
  padding: 20px;
  img {
    margin-bottom: 1rem;
  }
`;

const EventsContainer = styled.div`
  margin-top: 20px;
`;

const Social = styled.div`
  float: right;
  margin-right: 10px;
`;

const AccountDescription = styled.p`
  margin-top: 20px;
  max-width: 40rem;
`;

export const GET_ACCOUNT_ANON = gql`
  query GetAccount($username: String!) {
    accounts(where: { username: { _eq: $username } }) {
      id
      name
      photo
      username
      description
      subscriptions {
        id
      }
      events {
        id
        location
        name
        photo
        start
        account {
          name
          username
          photo
        }
        favorites {
          id
        }
      }
    }
    subscriptions_aggregate(
      where: { account: { username: { _eq: $username } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const GET_ACCOUNT_USER = gql`
  query GetAccount($username: String!, $user_id: String!) {
    myaccounts: accounts_users(
      order_by: { account: { name: asc } }
      where: { user_id: { _eq: $user_id } }
    ) {
      account {
        id
        name
        username
        subscriptions {
          id
        }
      }
    }
    accounts(where: { username: { _eq: $username } }) {
      id
      name
      photo
      username
      description
      subscriptions {
        id
      }
      events {
        id
        location
        name
        photo
        start
        account {
          name
          username
          photo
        }
        favorites {
          id
        }
      }
    }
    subscriptions_aggregate(
      where: { account: { username: { _eq: $username } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default function Home() {
  const location = useLocation();
  const { username } = useParams();
  const { user } = useAuth();

  const { loading, error, data, refetch } = useQuery(
    user ? GET_ACCOUNT_USER : GET_ACCOUNT_ANON,
    {
      variables: user ? { username, user_id: user.sub } : { username }
    }
  );

  if (loading) {
    return (
      <Centered height="full">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const account = Mapper(data?.accounts?.[0]);
  const subscribers = data?.subscriptions_aggregate?.aggregate?.count;
  const isMyAccount = !!data?.myaccounts?.filter(
    (acc) => acc.account.username === username
  ).length;

  return (
    <React.Fragment>
      <Helmet>
        <meta property="og:image" content={account.photo} />
        <meta property="og:title" content={`${account.name}`} />
        <meta property="og:description" content={account.description} />
      </Helmet>
      <img
        style={{ objectFit: 'cover', height: '17vh' }}
        src={account.photo}
        alt={account.name}
        width="100%"
      />
      <MainContent>
        {(user.isAdmin || isMyAccount) && (
          <Link
            to={`/${username}/manage/events/add`}
            style={{ float: 'right' }}
          >
            <Button icon={<VideoCameraOutlined />} type="primary" size="large">
              Create Event
            </Button>
          </Link>
        )}
        {account.instagram && (
          <Social>
            <a href={`https://instagram.com/${account.instagram}`}>
              <InstagramOutlined />
              {account.instagram}
            </a>
          </Social>
        )}
        {account.twitter && (
          <Social>
            <a href={`https://twitter.com/${account.twitter}`}>
              <TwitterOutlined /> {account.twitter}
            </a>
          </Social>
        )}
        {account.facebook && (
          <Social>
            <a href={`https://facebook.com/${account.facebook}`}>
              <FacebookOutlined /> {account.facebook}
            </a>
          </Social>
        )}

        <div style={{ float: 'right' }}>
          {user && !user.isAdmin && (
            <SubscribeButton
              account_id={account.id}
              subscription_id={account?.subscriptions?.[0]?.id}
            />
          )}
          {isMyAccount && !location.pathname.includes('manage') && (
            <Link to={`/${account.username}/manage`}>
              <Button size="large">Manage</Button>
            </Link>
          )}
        </div>

        <Title style={{ lineHeight: 0, marginTop: '0.5em' }}>
          {account.name}
        </Title>
        <div>{subscribers} subscribers</div>

        <AccountDescription>{account.description}</AccountDescription>

        <EventsContainer>
          {account.events.length ? <Title level={3}>Events</Title> : null}
          <Events events={account.events} refetch={refetch} />
        </EventsContainer>
      </MainContent>
    </React.Fragment>
  );
}
