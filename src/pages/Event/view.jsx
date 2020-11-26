import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { isMobile } from 'react-device-detect';
import Linkify from 'react-linkify';
import useAuth from 'hooks/useAuth';

import { Button, Tag, Row, Col, Modal, Result } from 'antd';
import { SettingOutlined, TagOutlined } from '@ant-design/icons';

import Countdown from 'components/Countdown';
import Comments from 'components/CommentsContainer';
import StartStreamButton from 'components/StartStreamButton';
import ShareButton from 'components/ShareButton';
// import SubscribeButton from '../components/SubscribeButton';
import FollowButton from 'components/FollowButton';
import VideoPlayer from 'components/VideoPlayer';
import VideoConference from 'components/VideoConference';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';

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
  }
`;

const EventName = styled.h1`
  margin-bottom: 0 !important;
`;

const EventDescription = styled.p`
  border-top: 1px solid ${({ theme }) => theme.colors.gray['500']};
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

export default function EventPage(props) {
  const {
    loading,
    error,
    event,
    account,
    isMyAccount,
    user,
    playerKey,
    videoJsOptions,
    liveData,
    handleBuy,
    status
  } = props;

  const { loginWithRedirect } = useAuth();

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const coverPhoto = (event.photo || event.account.photo).replace(
    'https://dam-media.s3.amazonaws.com/',
    ''
  );

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
      {status === 'success' && (
        <Modal
          title="Congrats, you're in!"
          closable={false}
          visible={true}
          footer={null}
        >
          <Result
            status="success"
            title="You successfully purchased a ticket to this event!"
            extra={[
              <Button
                type="primary"
                key="signIn"
                onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
              >
                Sign Up
              </Button>
            ]}
          />
        </Modal>
      )}
      <MainContent>
        {(() => {
          if (event.canWatch(user?.sub, liveData)) {
            if (event.isBroadcast()) {
              return (
                <VideoPlayer
                  key={playerKey}
                  {...videoJsOptions}
                  style={{ width: '100%' }}
                />
              );
            } else if (event.isConference()) {
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
                  autoPlay={!isMobile}
                  muted
                  controls
                />
              );
            } else {
              return (
                <img
                  width="100%"
                  alt={event.name || event?.account?.name}
                  src={`https://vizee.imgix.net/${coverPhoto}?fit=fill&fill=blur&w=${
                    window.innerWidth
                  }&h=${window.innerHeight * 0.3}`}
                />
              );
            }
          }
        })()}
      </MainContent>
      <Content>
        <div>
          <Row>
            {event.isLive() && <LiveTag color="#ee326e">LIVE NOW</LiveTag>}{' '}
          </Row>
          <Row>
            <EventName data-test-id="event-name">{event.name}</EventName>
          </Row>
          <Row>
            <h2 data-test-id="account-name">
              <Link to={`/${event.account.username}`}>
                {event.account.name}
              </Link>
            </h2>
          </Row>
          <Row gutter={32}>
            <Col xs={24} lg={8}>
              <Date data-test-id="event-start">
                {moment(event.start).format('MMMM Do h:mma')}
                <br />
                {!event.hasStarted() && <Countdown date={event.start} />}
              </Date>
              <div>
                {event.views} Views • {event.favorites} Favorites
              </div>
              <div>{event.location}</div>
            </Col>

            <Col xs={24} lg={16}>
              <ActionsContainer>
                {!user?.isAdmin &&
                  !isMyAccount &&
                  event.account.stripe_data &&
                  !event.isFree() &&
                  !event.isPurchased() && (
                    <Button
                      type="primary"
                      size="large"
                      icon={<TagOutlined />}
                      onClick={handleBuy}
                    >
                      Buy Ticket ({event.price})
                    </Button>
                  )}
                {user && !user.isAdmin && !isMyAccount && (
                  <FollowButton
                    account_id={event.account.id}
                    follower_id={account?.followers?.[0]?.id}
                  />
                )}
                {/* {user && !user.isAdmin && !isMyAccount && (
                  <SubscribeButton />
                )} */}
                {isMyAccount && event.isBroadcast() && (
                  <StartStreamButton
                    event_id={event.id}
                    streamKey={liveData?.mux_livestream?.streamKey}
                  />
                )}
                <ShareButton
                  url={`https://viz.ee/${event.account.username}/${event.id}`}
                />
                {(user?.isAdmin || isMyAccount) && (
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
              {/* {event.isPurchased() ? <Tag color="green">Purchased</Tag> : null}
              {event.isFree() && <Tag color="blue">Free!</Tag>}
              {event.isBroadcast() && <Tag color="cyan">Broadcast</Tag>}
              {event.isVideo() && <Tag color="gold">Video</Tag>}
              <br />
              <br /> */}

              <EventDescription>
                <Linkify>{event.description}</Linkify>
              </EventDescription>

              <Comments event={event} user={user} />
            </Col>
          </Row>
        </div>
      </Content>
    </React.Fragment>
  );
}

EventPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool,
  event: PropTypes.object.isRequired,
  account: PropTypes.object,
  user: PropTypes.object,
  playerKey: PropTypes.number.isRequired,
  videoJsOptions: PropTypes.object.isRequired,
  liveData: PropTypes.object,
  handleBuy: PropTypes.func.isRequired,
  status: PropTypes.string
};
