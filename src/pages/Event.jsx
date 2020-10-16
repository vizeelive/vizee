import config from '../config';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Button, Typography, Tag, message, Modal, Row, Col } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { gql, useQuery, useMutation } from '@apollo/client';

import { loadStripe } from '@stripe/stripe-js';

import VideoPlayer from '../components/VideoPlayer';
import VideoConference from '../components/VideoConference';
import useAuth from '../hooks/useAuth';

import { EyeOutlined, StarFilled } from '@ant-design/icons';

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

const EventName = styled(Typography.Title)`
  margin-bottom: 0 !important;
`;

const EventDescription = styled.p`
  border-top: 1px solid ${({ theme }) => theme.colors.gray.light};
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  max-width: 40rem;
`;

const LiveTag = styled(Tag)`
  font-weight: 700;
  font-size: 18px;
  padding: 3px 7px;
  font-family: 'FoundersGrotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial;
  margin-left: 1rem;
  position: relative;
  top: -0.5rem;
`;

const Date = styled.time`
  display: inline-block;
  margin-bottom: 1rem;
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
    events(where: { id: { _eq: $id } }) {
      mux_livestream
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
      }
      transaction {
        id
      }
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
  const { loading, error, data, refetch } = useQuery(
    user ? GET_EVENT_AUTH : GET_EVENT_UNAUTH,
    {
      fetchPolicy: 'cache-and-network',
      variables: { id, user_id: user?.sub }
    }
  );

  const event = { ...data?.events_report?.[0] };
  const eventExtra = { ...data?.events?.[0] };
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

  const Content = styled.div`
    margin: 20px;
    height: 100vh;
    button {
      float: right;
    }
  `;

  const MainContent = styled.div`
    img,
    video {
      height: 50vh;
      object-fit: cover;
    }
  `;

  const canWatch = isLive && (isFree || isPurchased);

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
    refetch();
  };

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    sources: [
      {
        src: `https://stream.mux.com/${eventExtra?.mux_livestream?.playback_ids[0]?.id}.m3u8`,
        type: 'audio/mpegURL'
      }
      // {
      //   src: 'https://dam-media.s3.amazonaws.com/movement.mp4',
      //   type: 'video/mp4'
      // }
    ]
  };

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
                <VideoPlayer {...videoJsOptions} style={{ width: '100%' }} />
              );
            } else if (isConference) {
              return (
                <VideoConference
                  roomName={`${event.id}-23kjh23kjh232kj3h`}
                  user={user}
                />
              );
            } else
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
        <Row>
          <Col span={12}>
            <EventName>
              {event.name}
              {isLive && <LiveTag color="#ee326e">LIVE NOW</LiveTag>}
            </EventName>
            <div>
              <Title level={3}>
                <Link to={`/${event.account.username}`}>
                  {event.account.name}
                </Link>
              </Title>
            </div>
            <Date>{moment(event.start).format('MMMM Do h:mma')}</Date>
            <br />
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
          </Col>
          <Col span={12}>
            {!isFree && !isPurchased && (
              <Button type="primary" role="link" onClick={handleClick}>
                Buy Ticket ({event.price})
              </Button>
            )}
            <Button onClick={() => setShareModalVisible(true)}>Share</Button>
            <CopyToClipboard text={window.location.href} onCopy={handleCopy}>
              <Button>Copy Link</Button>
            </CopyToClipboard>
            {isMyAccount && (
              <Button
                type="secondary"
                role="link"
                onClick={handleStartLivestream}
              >
                Start Live Stream
              </Button>
            )}
            {isMyAccount && (
              <Link to={`/${event.account.username}/events/${event.id}`}>
                <Button type="secondary" role="link">
                  Manage
                </Button>
              </Link>
            )}
          </Col>
        </Row>
        {isMyAccount && (
          <React.Fragment>
            <pre>RTMP URL: rtmp://global-live.mux.com:5222/app</pre>
            <pre>Stream Key: {eventExtra?.mux_livestream?.stream_key}</pre>
          </React.Fragment>
        )}
        <EventDescription>{event.description}</EventDescription>
        {user?.isAdmin && (
          <EditButton type="primary" ghost onClick={handleEditClick}>
            Edit
          </EditButton>
        )}
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
        </Modal>
      </Content>
    </React.Fragment>
  );
}
