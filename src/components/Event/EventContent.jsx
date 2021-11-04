import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useDimensions from 'react-use-dimensions';
import VideoPlayer from '../VideoPlayer';
import VideoPlayerIVS from '../VideoPlayerIVS';
import VideoConference from '../VideoConference';
import cdnImage from 'lib/cdn-image';

function EventContent(props) {
  const {
    event,
    user,
    liveData,
    playerKey,
    videoJsOptions,
    onHeightChange,
    onEnded
  } = props;

  const [ref, { height }] = useDimensions();

  useEffect(() => {
    onHeightChange(height);
  }, [height]);

  const renderEventVideo = () => {
    if (event.isAudio()) {
      return (
        <div data-test-id="event-audio">
          <VideoPlayer
            key={playerKey}
            {...videoJsOptions}
            cover={cdnImage(event.cover(), {
              fit: 'fill',
              fill: 'blur',
              w: 1216,
              h: 684
            })}
            onEnded={onEnded}
          />
        </div>
      );
    }

    if (event.isBroadcast() && event.stream_type.includes('mux')) {
      return (
        <div data-test-id="event-video-live">
          <VideoPlayer key={playerKey} {...videoJsOptions} onEnded={onEnded} />
        </div>
      );
    }

    if (event.isBroadcast() && event.stream_type.includes('ivs')) {
      return (
        <div data-test-id="event-video-live">
          <VideoPlayerIVS key={playerKey} {...videoJsOptions} />
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
        <VideoPlayer key={playerKey} {...videoJsOptions} onEnded={onEnded} />
      </div>
    );
  };

  // @TODO dont sign video links that aren't available yet

  return <div ref={ref}>{renderEventVideo()}</div>;
}

EventContent.propTypes = {
  onEnded: PropTypes.func,
  event: PropTypes.object.isRequired,
  user: PropTypes.object,
  liveData: PropTypes.object,
  playerKey: PropTypes.number.isRequired,
  videoJsOptions: PropTypes.object.isRequired,
  coverPhoto: PropTypes.string
};

export default EventContent;
