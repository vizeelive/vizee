import config from '../config';
import React, { useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import { Helmet } from 'react-helmet';

import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';

import { loadStripe } from '@stripe/stripe-js';

import StartStreamButton from '../components/StartStreamButton';
import ShareButton from '../components/ShareButton';
import SubscribeButton from '../components/SubscribeButton';
import VideoPlayer from '../components/VideoPlayer';
import VideoConference from '../components/VideoConference';
import useAuth from '../hooks/useAuth';

import { Button, Typography, Tag, Row, Col } from 'antd';

import { SettingOutlined, TagOutlined } from '@ant-design/icons';

import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

const Content = styled.div`
  margin: 20px 20px 50px;
  min-height: calc(50vh - 64px);
  display: flex;
  justify-content: center;

  & > div {
    flex: 1 1 0;
    max-width: 960px;
  }
`;

const MainContent = styled.div`
  img,
  video {
    height: 30vh;
    object-fit: cover;
  }
`;

const EventName = styled.h1`
  margin-bottom: 0 !important;
`;

const EventDescription = styled.p`
  border-top: 1px solid ${({ theme }) => theme.colors.gray.light};
  margin-top: 1.5rem;
  padding-top: 1.5rem;
`;

const LiveTag = styled(Tag)`
  font-weight: 700;
  font-size: 18px;
  padding: 3px 7px;
  font-family: 'FoundersGrotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial;
`;

const Date = styled.time`
  display: inline-block;
  margin-bottom: 1rem;
`;

const ActionsContainer = styled.div`
  margin: 0.75rem 0;

  & > button,
  & > a {
    margin-bottom: 1rem;
    margin-right: 0.5rem;
  }

  @media (min-width: 992px) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;

    & > button,
    & > a {
      margin-left: 0.5rem;
      margin-right: 0;
    }
  }
`;

const EditButton = styled(Button)`
  margin-top: 0.5rem;
  float: none !important;
`;

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const GET_EVENT_UNAUTH = gql`
  query AnonEventsReport($id: uuid!) {
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
      favorites
      views
      account {
        id
        name
        username
        photo
        stripe_id
      }
    }
  }
`;

const GET_EVENT_AUTH = gql`
  query UserEventsReport($id: uuid!, $user_id: String!, $username: String!) {
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
      subscriptions {
        id
      }
    }
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
      description
      transactions
      favorites
      views
      account {
        id
        name
        username
        photo
        stripe_id
      }
      transaction {
        id
      }
    }
  }
`;

const WATCH_MUX = gql`
  subscription WatchEventLiveStatus($id: uuid!) {
    events_by_pk(id: $id) {
      mux_livestream
      mux_id
      status
    }
  }
`;

const TRACK_VIEW = gql`
  mutation TrackView($object: views_insert_input!) {
    insert_views_one(object: $object) {
      id
    }
  }
`;

export default function Event() {
  const { id, username } = useParams();

  const history = useHistory();

  const { user, loginWithRedirect } = useAuth();
  const [trackView] = useMutation(TRACK_VIEW);

  const variables = user ? { id, user_id: user?.sub, username } : { id };

  const { loading, error, data } = useQuery(
    user ? GET_EVENT_AUTH : GET_EVENT_UNAUTH,
    {
      variables
    }
  );

  const { data: liveData } = useSubscription(WATCH_MUX, {
    variables: { id }
  });

  const account = data?.accounts?.[0];
  const event = { ...data?.events_report?.[0] };
  const userId = user?.sub || null;
  const isMyAccount = !!data?.myaccounts?.filter(
    (acc) => acc.account.username === event.account.username
  ).length;

  const account_id = event?.account?.id;

  useEffect(() => {
    if (event?.id && !isMyAccount) {
      trackView({
        variables: {
          object: {
            created_by: userId,
            account_id: account_id,
            event_id: event.id,
            city: user?.geo.city,
            country: user?.geo.country,
            ip: user?.geo.ip,
            loc: user?.geo.loc,
            postal: user?.geo.postal,
            region: user?.geo.region,
            timezone: user?.geo.timezone
          }
        }
      });
    }
  }, [account_id, event.id, isMyAccount, trackView, user, userId]);

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const handleBuy = async () => {
    let ref = btoa(
      JSON.stringify({
        user_id: user.sub,
        account_id: event.account.id,
        event_id: event.id
      })
    );

    const stripe = await stripePromise;

    const response = await fetch(`${config.api}/stripe/session?ref=${ref}`, {
      method: 'GET'
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  const handleClick = user
    ? handleBuy
    : () => loginWithRedirect({ redirect_uri: window.location.href });

  let time = moment();
  let start = moment(event.start);
  let end = moment(event.end);
  let isFree = event.price === '$0.00';
  let isLive = time.isBetween(start, end);
  let isPurchased = event?.transaction?.length;
  let isConference = event.type === 'conference';
  let isBroadcast = event.type === 'live';
  let isVideo = event.type === 'video';

  const liveEvent = liveData?.events_by_pk;

  let canWatch;
  if (event.type === 'video') {
    canWatch = isMyAccount || (isLive && (isFree || isPurchased));
  } else {
    canWatch =
      (liveEvent?.status !== 'idle' && isMyAccount) ||
      (isLive && (isFree || isPurchased));
  }

  const handleEditClick = () => {
    history.push(`/admin/events/edit/${event.id}`);
  };

  let videoJsOptions = {
    autoplay: true,
    controls: true,
    aspectRatio: '16:9',
    sources: []
  };

  let playerKey = liveData?.mux_id;
  if (liveEvent?.status === 'live') {
    playerKey = Math.random();
    videoJsOptions = {
      autoplay: true,
      controls: true,
      aspectRatio: '16:9',
      sources: []
    };
    videoJsOptions.sources.push({
      src: `https://stream.mux.com/${liveEvent?.mux_livestream?.playback_ids?.[0]?.id}.m3u8`,
      type: 'audio/mpegURL'
    });
  } else if (liveEvent?.status === 'completed') {
    playerKey = Math.random();
    videoJsOptions = {
      autoplay: true,
      controls: true,
      aspectRatio: '16:9',
      sources: []
    };
    videoJsOptions.sources.push({
      src: `https://stream.mux.com/${liveEvent?.mux_livestream?.playback_ids?.[0]?.id}.m3u8`
    });
  } else {
   playerKey = Math.random();
   videoJsOptions = {
     autoplay: true,
     controls: true,
     aspectRatio: '16:9',
     sources: []
   };
   videoJsOptions.sources.push({
     src: event.video,
     type: 'video/mp4'
   });
  }

  return (
    <React.Fragment>
      <Helmet>
        <meta
          property="og:image"
          content={event?.photo || event?.account?.photo}
        />
        <meta
          property="og:title"
          content={`${event.name} - ${event.account.name}`}
        />
        <meta property="og:description" content={event.description} />
      </Helmet>
      <MainContent>
        {(() => {
          if (canWatch) {
            if (isBroadcast) {
              return (
                <VideoPlayer
                  key={playerKey}
                  {...videoJsOptions}
                  style={{ width: '100%' }}
                />
              );
            } else if (isConference) {
              return (
                <VideoConference
                  roomName={`${event.id}-23kjh23kjh232kj3h`}
                  user={user}
                />
              );
            } else {
              return (
                <VideoPlayer
                  key={playerKey}
                  {...videoJsOptions}
                  style={{ width: '100%' }}
                />
              );
            }
          } else {
            if (event.preview) {
              return (
                <video
                  src={event.preview}
                  width="100%"
                  autoPlay
                  muted
                  controls
                />
              );
            } else {
              return (
                <img
                  width="100%"
                  alt={event.name || event?.account?.name}
                  src={event.photo || event.account.photo}
                />
              );
            }
          }
        })()}
      </MainContent>
      <Content>
        <div>
          <Row>{isLive && <LiveTag color="#ee326e">LIVE NOW</LiveTag>} </Row>
          <Row>
            <EventName>{event.name}</EventName>
          </Row>
          <Row>
            <h2>
              <Link to={`/${event.account.username}`}>
                {event.account.name}
              </Link>
            </h2>
          </Row>
          <Row gutter={32}>
            <Col xs={24} lg={8}>
              <Date>{moment(event.start).format('MMMM Do h:mma')}</Date>
              <div>
                {event.views} Views • {event.favorites} Favorites
              </div>
            </Col>

            <Col xs={24} lg={16}>
              <ActionsContainer>
                {!isMyAccount &&
                  event.account.stripe_id &&
                  !isFree &&
                  !isPurchased && (
                    <Button
                      type="primary"
                      size="large"
                      icon={<TagOutlined />}
                      onClick={handleClick}
                    >
                      Buy Ticket ({event.price})
                    </Button>
                  )}
                {!isMyAccount && (
                  <SubscribeButton
                    account_id={event.account.id}
                    subscription_id={account?.subscriptions?.[0]?.id}
                  />
                )}
                {isMyAccount && isBroadcast && (
                  <StartStreamButton
                    event_id={event.id}
                    streamKey={liveData?.mux_livestream?.streamKey}
                  />
                )}
                <ShareButton />
                {isMyAccount && (
                  <Link
                    to={`/${event.account.username}/manage/events/${event.id}`}
                  >
                    <Button size="large" icon={<SettingOutlined />}>
                      Manage
                    </Button>
                  </Link>
                )}
              </ActionsContainer>
            </Col>
          </Row>
          <Row>
            <Col xs={24} lg={16}>
              {isPurchased ? <Tag color="green">Purchased</Tag> : null}
              {isFree && <Tag color="blue">Free!</Tag>}
              {isBroadcast && <Tag color="cyan">Broadcast</Tag>}
              {isVideo && <Tag color="gold">Video</Tag>}
              <br />
              <br />

              <EventDescription>{event.description}</EventDescription>
              {user?.isAdmin && (
                <EditButton
                  type="primary"
                  size="large"
                  ghost
                  onClick={handleEditClick}
                >
                  Edit Event
                </EditButton>
              )}
            </Col>
          </Row>
        </div>
      </Content>
    </React.Fragment>
  );
}
