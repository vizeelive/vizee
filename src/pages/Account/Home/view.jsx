import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { Button, Typography } from 'antd';
import Microlink from '@microlink/react';
import styled from 'styled-components';
import Events from 'components/Events';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';
import ShareButton from 'components/ShareButton';
import FollowButton from 'components/FollowButton';
import Linkify from 'react-linkify';

import {
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const MicrolinkCard = styled.div`
  max-width: 300px;

  .microlink_card {
    background-color: black;
    color: white;
    border: 01px solid #303030;
    margin-bottom: 10px;
  }
`;

const Header = styled.header`
  margin-bottom: 1rem;

  h1 {
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 992px) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  & > * {
    margin-bottom: 1rem;
    margin-right: 0.75rem;
  }

  @media (min-width: 992px) {
    flex-direction: row-reverse;
    padding-left: 2rem;

    & > * {
      margin-right: 0;
      margin-left: 0.75rem;
    }
  }
`;

const SocialList = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0 0.75rem;
`;

const Social = styled.li`
  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

const EventsContainer = styled.div``;

const AccountDescription = styled.p`
  margin-bottom: 20px;
  max-width: 40rem;
`;

export default function HomeView(props) {
  const {
    account,
    user,
    isMyAccount,
    username,
    error,
    loading,
    followers,
    shareUrl,
    location,
    refetch
  } = props;

  if (loading) {
    return (
      <Centered height="full">
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  return (
    <React.Fragment>
      <Helmet>
        <meta property="og:image" content={account.photo} />
        <meta property="og:title" content={`${account.name}`} />
        <meta property="og:description" content={account.description} />
        <meta name="twitter:image" content={account.photo} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${account.name}`} />
        <meta name="twitter:description" content={account.description} />
      </Helmet>
      <article className="min-h-page">
        {account.photo && (
          <img
            style={{
              objectFit: 'cover',
              objectPosition: 'top'
              // maxHeight: '20vh'
            }}
            src={account.photo}
            // src={`https://vizee.imgix.net/${accountPhoto}?fit=fill&fill=blur&w=${
            //   window.innerWidth
            // }&h=${window.innerHeight * 0.4}`}
            alt={account.name}
            width="100%"
          />
        )}
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <Header>
            <div>
              {process.env.REACT_APP_ACCOUNT === 'vizee' && (
                <Title>{account.name}</Title>
              )}
              {followers.length >= 10 && (
                <p>{`${followers} follower${
                  followers.length !== 1 ? 's' : ''
                }`}</p>
              )}
            </div>
            <ActionsContainer>
              {(user?.isAdmin || isMyAccount) && (
                <Link
                  to={`/${username}/manage/events/add`}
                  data-test-id="link-create-event"
                >
                  <Button
                    icon={<VideoCameraOutlined />}
                    type="primary"
                    size="large"
                  >
                    Create Event
                  </Button>
                </Link>
              )}

              {user && !user.isAdmin && (
                <FollowButton
                  account_id={account.id}
                  follower_id={account?.followers?.[0]?.id}
                />
              )}

              <ShareButton url={shareUrl} />

              {(user?.isAdmin || isMyAccount) &&
                !location.pathname.includes('manage') && (
                  <Link to={`/${account.username}/manage`}>
                    <Button size="large">Manage</Button>
                  </Link>
                )}

              <SocialList>
                {account.facebook && (
                  <Social>
                    <a
                      href={account.facebook}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <FacebookOutlined /> {account.facebook.split('/').pop()}
                    </a>
                  </Social>
                )}
                {account.twitter && (
                  <Social>
                    <a
                      href={account.twitter}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <TwitterOutlined /> {account.twitter.split('/').pop()}
                    </a>
                  </Social>
                )}
                {account.instagram && (
                  <Social>
                    <a
                      href={account.instagram}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <InstagramOutlined />
                      {account.instagram.split('/').pop()}
                    </a>
                  </Social>
                )}
              </SocialList>
            </ActionsContainer>
          </Header>

          {account.description && (
            <AccountDescription>
              <Title level={3}>Bio</Title>
              <Linkify>{account.description}</Linkify>
            </AccountDescription>
          )}

          <EventsContainer>
            {account.events.length ? <Title level={3}>Events</Title> : null}
            <Events events={account.events} refetch={refetch} />
          </EventsContainer>
          <br />

          {account.links.length ? (
            <React.Fragment>
              <Title level={3}>Links</Title>
              {account.links.map((link) => (
                <MicrolinkCard>
                  <Microlink url={link.link} />
                </MicrolinkCard>
                // <LinkCard>
                //   <a href={link.link}>{link.name}</a>
                // </LinkCard>
              ))}
            </React.Fragment>
          ) : null}
        </div>
      </article>
    </React.Fragment>
  );
}
