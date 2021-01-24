import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import Linkify from 'react-linkify';
import useAuth from 'hooks/useAuth';
import cn from 'classnames';
import { isMobile } from 'react-device-detect';

import TwButton from 'components/ui/Button';
import Countdown from 'components/Event/Countdown';
// import Comments from 'components/Event/CommentsContainer';
import CommentsChat from 'components/Event/CommentsChat';
import StartStreamButton from 'components/Event/StartStreamButton';
// import RedeemCode from 'components/Event/RedeemCode';
import BuyButton from 'components/Event/BuyButton';
import ShareButton from 'components/Event/ShareButton';
import FollowButton from 'components/Event/FollowButton';
import EventContent from 'components/Event/EventContent';
import EventPreview from 'components/Event/EventPreview';
import AvatarHandle from 'components/AvatarHandle';
import SuccessModal from 'components/SuccessModal';
import ChatToggle from 'components/Event/ChatToggle';

export default function EventPage(props) {
  const {
    coverPhoto,
    event,
    account,
    isMyAccount,
    user,
    playerKey,
    videoJsOptions,
    liveData,
    status
  } = props;

  const searchParams = new URLSearchParams(window.location.search);

  const origin = process.env.REACT_APP_DOMAIN || window.location.origin;

  const { loginWithRedirect } = useAuth();
  const history = useHistory();
  const [showModal] = useState(
    !searchParams.get('tip') && status === 'success' ? true : false
  );
  const [showTipModal] = useState(
    searchParams.get('tip') && status === 'success' ? true : false
  );

  const [showChat, setShowChat] = useState(false);
  const [videoHeight, setVideoHeight] = useState(0);
  const [showMobileEvent, setShowMobileEvent] = useState(false);
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia('(orientation: landscape)').matches
  );
  const [offsetY, setOffsetY] = useState(0);
  const [initialHeight, setInitialHeight] = useState(window.innerHeight);

  const canWatch = event.canWatch(user, liveData);
  const chatEnabled =
    user && canWatch && (event.isBroadcast() || event.isConference());

  useEffect(() => {
    user && setShowChat(true);
  }, [user]);

  const isMobileEvent =
    isMobile && window.matchMedia('(max-width: 991px)').matches;

  useEffect(() => {
    const handleResize = (event) => {
      // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
      const viewport = event.target;
      const vh = viewport.height * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      if (isMobileEvent) {
        const landscape = window.matchMedia('(orientation: landscape)').matches;

        if (landscape !== isLandscape) {
          // device rotated
          setInitialHeight(window.innerHeight);
          setOffsetY(0);
        } else {
          // soft keyboard is resizing viewport
          const offset = initialHeight - viewport.height;
          const vidHeight = (viewport.width * 9) / 16; // 16:9 video height
          const closeBtnHeight = 132;
          const fixedVideoFits = viewport.height > vidHeight + closeBtnHeight;

          /**
           * If there's enough vertical space for the video + chat input +
           * close button, keep the video in view. Otherwise, let the video
           * slide up out of view.
           */
          const setOffset = fixedVideoFits ? offset : 0;
          setOffsetY(setOffset);
        }

        setIsLandscape(landscape);
      }
    };

    window.visualViewport.addEventListener('resize', handleResize);

    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleShowMobileEvent = () => {
    document.documentElement.style.setProperty('overflow', 'hidden');
    document.body.classList.add('show-mobile-event');
    setShowMobileEvent(true);
    window.scroll(0, 0);
  };

  const handleHideMobileEvent = () => {
    document.documentElement.style.removeProperty('overflow', 'hidden');
    document.body.classList.remove('show-mobile-event');
    setShowMobileEvent(false);
  };

  const renderBadges = () => {
    return (
      <div className="mt-2 flex items-center lg:mr-6 event-badges">
        {event.isStreamComplete() && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-sm font-semibold bg-primary text-white uppercase">
            Stream Ended
          </span>
        )}
        {event.isStreamStarting() && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-sm font-semibold bg-primary text-white uppercase">
            Stream Starting...
          </span>
        )}
        {!event.isBroadcast() && event.isAvailable() && !event.isLive() && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-sm font-semibold bg-primary text-white uppercase">
            Available Now
          </span>
        )}
        {event.isLive() && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-sm font-semibold bg-primary text-white uppercase">
            Live Now
          </span>
        )}
        {event.preview && !event.canWatch(user, liveData) && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-sm font-semibold bg-gray-750 text-white uppercase">
            Preview
          </span>
        )}
      </div>
    );
  };

  const renderInfo = () => (
    <div className="lg:flex lg:items-start lg:justify-between px-6 sm:px-0">
      <div className="flex-1 min-w-0">
        <h2
          className="text-2xl font-sans font-bold leading-7 text-white m-0 sm:text-3xl sm:leading-10"
          data-test-id="event-name"
        >
          {event.name}
        </h2>
        <div className="mt-1 flex flex-col lg:flex-row lg:flex-wrap lg:mt-0">
          {renderBadges()}
          <div className="mt-2 flex items-center text-sm text-gray-300 lg:mr-6">
            {/* Heroicon name: calendar */}
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {`Available on ${moment(event.start).format('MMMM Do h:mma')}`}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-300 lg:mr-6">
            {/* Heroicon name: calendar */}
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {`Until ${moment(event.end).format('MMMM Do h:mma')}`}
          </div>
          {event.location && (
            <div
              className="mt-2 flex items-center text-sm text-gray-300 lg:mr-6"
              data-test-id="event-location"
            >
              {/* Heroicon name: location-marker */}
              <svg
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {event.location}
            </div>
          )}
          <div className="lg:flex lg:flex-nowrap" data-test-id="event-views">
            <div className="mt-2 flex items-center text-sm text-gray-300 lg:mr-6">
              {/* Heroicon name: eye */}
              <svg
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <strong>{event.views}</strong>
              &nbsp;Views
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-300 lg:mr-6">
              {/* Heroicon name: eye */}
              <svg
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <strong>{event.favorites}</strong>
              &nbsp;Favorites
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap lg:mt-0 lg:ml-4 lg:max-w-xl lg:justify-end">
        {!user?.isAdmin &&
          !isMyAccount &&
          event.account.stripe_data &&
          !event.isFree() &&
          !event.isPurchased() &&
          !event.hasEnded() && (
            <span className="mr-3 lg:mr-0 lg:ml-3">
              <BuyButton user={user} event={event} />
            </span>
          )}

        {event.account.stripe_data && (
          <span className="mr-3 lg:mr-0 lg:ml-3">
            <BuyButton isTip={true} user={user} event={event} />
          </span>
        )}

        {/* {user && (
          <span className="mr-3 mb-3 lg:mr-0 lg:ml-3">
            <RedeemCode event_id={event.id} user_id={user.id} />
          </span>
        )} */}

        {user && !user.isAdmin && !isMyAccount && (
          <span className="mr-3 mb-3 lg:mr-0 lg:ml-3">
            <FollowButton
              account_id={event.account.id}
              follower_id={account?.followers?.[0]?.id}
            />
          </span>
        )}

        {/* {user && !user.isAdmin && !isMyAccount && (
          <SubscribeButton />
        )} */}

        {(user?.isAdmin || isMyAccount) && event.isBroadcast() && (
          <span className="mr-3 mb-3 lg:mr-0 lg:ml-3">
            <StartStreamButton event_id={event.id} />
          </span>
        )}

        <span className="mr-3 mb-3 lg:mr-0 lg:ml-3">
          <ShareButton
            url={`${origin}/${event.account.username}/${event.id}`}
            user={user}
          />
        </span>

        {(user?.isAdmin || isMyAccount) && (
          <div className="flex flex-no-wrap">
            <span className="mr-3 mb-3 lg:mr-0 lg:ml-3">
              <Link to={`/${event.account.username}/manage/events/${event.id}`}>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm lg:text-base font-medium text-gray-300 bg-black hover:bg-white-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
                >
                  {/* Heroicon name: cog */}
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Manage
                </button>
              </Link>
            </span>
            <span className="mr-3 mb-3 lg:mr-0 lg:ml-3">
              <Link
                to={`/${event.account.username}/manage/events/edit/${event.id}`}
              >
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm lg:text-base font-medium text-gray-300 bg-black hover:bg-white-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-600"
                >
                  {/* Heroicon name: pencil-alt */}
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
              </Link>
            </span>
          </div>
        )}
      </div>
    </div>
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
        <meta
          name="twitter:image"
          content={event?.photo || event?.account?.photo}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${event.name} - ${event.account.name}`}
        />
        <meta name="twitter:description" content={event.description} />
      </Helmet>

      <SuccessModal
        title="Congrats, you're in!"
        description="You successfully purchased a ticket to this event!"
        status="success"
        isVisible={window.location.search.includes('event.purchase')}
      />

      <SuccessModal
        title="Thanks for the tip!"
        description="Your generosity allows creators to keep doing their thing!"
        status="success"
        isVisible={window.location.search.includes('tip')}
      />

      <article
        className={cn('mx-auto lg:px-8 page-min-height', {
          'max-w-screen-xl 2xl:max-w-screen-2xl': chatEnabled,
          'max-w-screen-lg 2xl:max-w-screen-xl': !chatEnabled
        })}
      >
        <div
          className={cn('grid video-chat-grid gap-y-6 lg:py-8', {
            'show-chat': showChat
          })}
        >
          <section className="relative">
            {!canWatch ||
            !event.isAvailable() ||
            (isMobileEvent && chatEnabled) ? (
              <EventPreview event={event} coverPhoto={coverPhoto} />
            ) : (
              <EventContent
                event={event}
                user={user}
                liveData={liveData}
                playerKey={playerKey}
                videoJsOptions={videoJsOptions}
                coverPhoto={coverPhoto}
                onHeightChange={(h) => setVideoHeight(h)}
              />
            )}
            {isMobileEvent && canWatch && chatEnabled && (
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center',
                  {
                    'bg-black-50': !showMobileEvent,
                    'bg-black': showMobileEvent
                  }
                )}
              >
                {!showMobileEvent && (
                  <button
                    type="button"
                    className="inline-flex items-center px-6 py-3 text-2xl font-extrabold rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black-5 focus:ring-primary"
                    onClick={handleShowMobileEvent}
                  >
                    <svg
                      className="-ml-1 -mt-1 mr-4 h-8 w-8 overflow-visible"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Play Event
                  </button>
                )}

                <div
                  id="mobileEvent"
                  className={cn({
                    hidden: !showMobileEvent,
                    block: showMobileEvent
                  })}
                >
                  <div
                    className={cn('fixed left-0 z-50', {
                      'w-full': !isLandscape,
                      'w-6/12': isLandscape
                    })}
                    style={{
                      top: `${offsetY}px`,
                      boxShadow: '0 25px 50px -12px black'
                    }}
                  >
                    <EventContent
                      event={event}
                      user={user}
                      liveData={liveData}
                      playerKey={playerKey}
                      videoJsOptions={videoJsOptions}
                      coverPhoto={coverPhoto}
                      onHeightChange={(h) => setVideoHeight(h)}
                    />
                  </div>
                  {chatEnabled && (
                    <div
                      className={cn('fixed bottom-0 z-40', {
                        'w-full left-0': !isLandscape,
                        'w-6/12 left-1/2': isLandscape
                      })}
                      style={{
                        top: isLandscape
                          ? `${offsetY}px`
                          : `calc(${offsetY}px + 56.25vw)` // offset + 16:9 video height
                      }}
                    >
                      <CommentsChat event={event} user={user} />
                    </div>
                  )}
                  <div className="fixed bottom-20 right-4 z-50">
                    <TwButton type="primary" onClick={handleHideMobileEvent}>
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Close
                    </TwButton>
                  </div>
                </div>
              </div>
            )}
          </section>
          <aside
            id="chatContainer"
            className={cn('hidden lg:block relative event-chat', {
              'lg:hidden': !chatEnabled || isMobileEvent,
              'w-96': showChat,
              'w-8': !showChat
            })}
          >
            <div
              className={cn('pl-12', {
                hidden: !showChat,
                block: showChat
              })}
              style={{
                height: `${videoHeight}px`
              }}
            >
              {chatEnabled && !isMobileEvent && (
                <CommentsChat event={event} user={user} />
              )}
            </div>
            {chatEnabled && (
              <ChatToggle
                showChat={showChat}
                onToggle={() => setShowChat(!showChat)}
              />
            )}
          </aside>
        </div>
        <div className="my-8 lg:mt-0 sm:px-6 lg:px-0">{renderInfo()}</div>

        {!event.hasStarted() && (
          <div className="my-6 px-6 sm:px-0">
            <p className="text-base font-semibold text-gray-300 m-0">
              Event starts in&hellip;
            </p>
            <Countdown date={event.start} />
          </div>
        )}

        <div className="my-8 px-6 lg:px-0">
          {/* <div className="my-6">
            {event.isPurchased() ? <Tag color="green">Purchased</Tag> : null}
            {event.isFree() && <Tag color="blue">Free!</Tag>}
            {event.isBroadcast() && <Tag color="cyan">Broadcast</Tag>}
            {event.isVideo() && <Tag color="gold">Video</Tag>}
          </div> */}
          <AvatarHandle account={event.account} />
          <div
            className="prose text-gray-500 pl-14 ml-1"
            data-test-id="event-description"
          >
            <Linkify>
              <p>{event.description || <em>No description provided</em>}</p>
            </Linkify>
          </div>
          {/* <div className="max-w-prose my-8">
            <Comments event={event} user={user} />
          </div> */}
        </div>
      </article>
    </React.Fragment>
  );
}

EventPage.propTypes = {
  event: PropTypes.object.isRequired,
  account: PropTypes.object,
  user: PropTypes.object,
  playerKey: PropTypes.number,
  videoJsOptions: PropTypes.object.isRequired,
  liveData: PropTypes.object,
  status: PropTypes.string
};
