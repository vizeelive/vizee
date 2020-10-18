import config from '../config';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';

import { loadStripe } from '@stripe/stripe-js';

import VideoPlayer from '../components/VideoPlayer';
import VideoConference from '../components/VideoConference';
import useAuth from '../hooks/useAuth';

import { Button, Typography, Tag, message, Modal, Row, Col, Alert } from 'antd';

import {
  EyeOutlined,
  StarFilled,
  SettingOutlined,
  ShareAltOutlined,
  PlayCircleOutlined,
  TagOutlined
} from '@ant-design/icons';

import { Centered } from '../components/styled/common';
import Spinner from '../components/ui/Spinner';

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share';

const { Title } = Typography;

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
    height: 50vh;
    object-fit: cover;
  }
`;

const EventName = styled(Typography.Title)`
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
  margin-left: 1rem;
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

const Counts = styled.div`
  svg {
    margin-right: 0.25rem;
  }
`;

const EditButton = styled(Button)`
  margin-top: 0.5rem;
  float: none !important;
`;

const CopyButton = styled.button.attrs({
  'aria-label': 'copy link'
})`
  background-color: #aaa;
  border: none;
  padding: 0px;
  font: inherit;
  color: inherit;
  cursor: pointer;
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-20px);

  svg {
    width: 24px;
    height: 24px;
  }

  path {
    fill: #fff;
  }
`;

const stripePromise = loadStripe(
  'pk_test_51GxNPWFN46jAxE7Qjk2k8EvqQyVBsaq9TZ2NXcEtBfqWpKlilZWUuAoggjDXYaPjMogzejgajC7InSicHwXSRS4x006DpoBHJl'
);

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
        name
        username
        photo
        stripe_id
      }
    }
  }
`;

const GET_EVENT_AUTH = gql`
  query UserEventsReport($id: uuid!, $user_id: String!) {
    myaccounts: accounts_users(
      order_by: { account: { name: asc } }
      where: { user_id: { _eq: $user_id } }
    ) {
      account {
        id
        name
        username
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
  const { id } = useParams();

  const history = useHistory();

  const [shareModalVisible, setShareModalVisible] = useState(false);
  const { user, loginWithRedirect } = useAuth();
  const [trackView] = useMutation(TRACK_VIEW);
  const { loading, error, data } = useQuery(
    user ? GET_EVENT_AUTH : GET_EVENT_UNAUTH,
    {
      fetchPolicy: 'cache-and-network',
      variables: { id, user_id: user?.sub }
    }
  );

  const { data: liveData } = useSubscription(WATCH_MUX, {
    variables: { id }
  });

  const event = { ...data?.events_report?.[0] };
  const userId = user?.sub || null;
  const isMyAccount = !!data?.myaccounts?.filter(
    (acc) => acc.account.username === event.account.username
  ).length;

  useEffect(() => {
    if (event?.id) {
      trackView({
        variables: {
          object: {
            created_by: userId,
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
  }, [event.id, trackView, user, userId]);

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
        event_id: event.id
      })
    );

    const stripe = await stripePromise;

    const response = await fetch(`${config.api}/session?ref=${ref}`, {
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

  const handleClick = user ? handleBuy : loginWithRedirect;

  let time = moment();
  let start = moment(event.start);
  let end = moment(event.end);
  let isFree = event.price === '$0.00';
  let isLive = time.isBetween(start, end);
  let isPurchased = event?.transaction?.length;
  let isConference = event.type === 'conference';
  let isBroadcast = event.type === 'live';
  let isVideo = event.type === 'video';

  const canWatch = isLive && (isFree || isPurchased);
  const liveEvent = liveData?.events_by_pk;

  const handleCopy = () => {
    message.success('Copied link');
  };

  const handleEditClick = () => {
    history.push(`/admin/events/edit/${event.id}`);
  };

  const handleStartLivestream = async () => {
    const response = await fetch(`${config.api}/mux/stream/create?id=${id}`, {
      method: 'GET'
    });

    const stream = await response.json();
    console.log({ stream });
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
                <video
                  src={event.video}
                  poster={event.photo}
                  width="100%"
                  autoPlay
                  muted
                  controls
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
          <Row gutter={32}>
            <Col xs={24} lg={16}>
              <EventName>{event.name}</EventName>
              <div>
                <Title level={3}>
                  <Link to={`/${event.account.username}`}>
                    {event.account.name}
                  </Link>
                </Title>
              </div>
              <Date>{moment(event.start).format('MMMM Do h:mma')}</Date>
              {isLive && <LiveTag color="#ee326e">LIVE NOW</LiveTag>}
            </Col>

            <Col xs={24} lg={8}>
              <ActionsContainer>
                {event.account.stripe_id && !isFree && !isPurchased && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<TagOutlined />}
                    onClick={handleClick}
                  >
                    Buy Ticket ({event.price})
                  </Button>
                )}
                {isMyAccount && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={handleStartLivestream}
                  >
                    Start Live Stream
                  </Button>
                )}
                <Button
                  size="large"
                  icon={<ShareAltOutlined />}
                  onClick={() => setShareModalVisible(true)}
                >
                  Share
                </Button>
                {isMyAccount && (
                  <Link to={`/${event.account.username}/events/${event.id}`}>
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
              {isMyAccount && (
                <Alert
                  type="info"
                  message={
                    <React.Fragment>
                      <pre style={{ margin: 0, fontSize: '14px' }}>
                        RTMP URL: rtmp://global-live.mux.com:5222/app
                      </pre>
                      <pre style={{ margin: 0, fontSize: '14px' }}>
                        Stream Key: {liveEvent?.mux_livestream?.stream_key}
                      </pre>
                    </React.Fragment>
                  }
                  style={{ marginBottom: '1.5rem' }}
                />
              )}
              {isPurchased ? <Tag color="green">Purchased</Tag> : null}
              {isFree && <Tag color="blue">Free!</Tag>}
              {isBroadcast && <Tag color="cyan">Broadcast</Tag>}
              {isVideo && <Tag color="gold">Video</Tag>}
              <br />
              <br />
              <Counts>
                <EyeOutlined />
                {event.views} Views
              </Counts>
              <Counts>
                <StarFilled />
                {event.favorites} Favorites
              </Counts>
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

      <Modal
        title="Share"
        visible={shareModalVisible}
        footer={null}
        onCancel={() => setShareModalVisible(false)}
      >
        <FacebookShareButton url={window.location.href}>
          <FacebookIcon />
        </FacebookShareButton>
        <TwitterShareButton url={window.location.href}>
          <TwitterIcon />
        </TwitterShareButton>
        <EmailShareButton url={window.location.href}>
          <EmailIcon />
        </EmailShareButton>
        <CopyToClipboard text={window.location.href} onCopy={handleCopy}>
          <CopyButton className="react-share__ShareButton">
            <svg viewBox="0 0 24 24">
              <path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z" />
            </svg>
          </CopyButton>
        </CopyToClipboard>
      </Modal>
    </React.Fragment>
  );
}
