import React from 'react';
import PropTypes from 'prop-types';
import VideoPlayer from '../VideoPlayer';
import VideoConference from '../VideoConference';

function EventContent(props) {
  const {
    event,
    user,
    liveData,
    playerKey,
    videoJsOptions,
    coverPhoto
  } = props;

  const canWatch = event.canWatch(user, liveData);

  const renderEventVideo = () => {
    if (event.isBroadcast()) {
      return (
        <div data-test-id="event-video-live">
          <VideoPlayer key={playerKey} {...videoJsOptions} />
        </div>
      );
    }

    if (event.isConference()) {
      return (
        <div data-test-id="event-video-conference">
          <VideoConference
            roomName={`${event.id}-23kjh23kjh232kj3h`}
            user={user}
          />
        </div>
      );
    }

    return (
      <div data-test-id="event-video-vod">
        <VideoPlayer key={playerKey} {...videoJsOptions} />
      </div>
    );
  };

  const renderPreview = () => {
    if (event.preview) {
      return (
        <video
          data-test-id="event-preview-video"
          playsInline
          src={event.preview}
          width="100%"
          muted
          controls
        />
      );
    }

    return (
      <img
        data-test-id="event-preview-image"
        width="100%"
        alt={event.name || event?.account?.name}
        src={
          !coverPhoto
            ? `https://dummyimage.com/1216x684/000/fff.png&text=${event.name}`
            : `https://vizee.imgix.net/${coverPhoto}?fit=fill&fill=blur&w=1216&h=684`
        }
      />
    );
  };

  // @TODO dont sign video links that aren't available yet
  if (!event.isAvailable()) {
    return renderPreview();
  } else {
    return canWatch ? renderEventVideo() : renderPreview();
  }
}

EventContent.propTypes = {
  event: PropTypes.object.isRequired,
  user: PropTypes.object,
  liveData: PropTypes.object,
  playerKey: PropTypes.number.isRequired,
  videoJsOptions: PropTypes.object.isRequired,
  coverPhoto: PropTypes.string
};

export default EventContent;
