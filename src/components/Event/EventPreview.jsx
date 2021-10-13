import React from 'react';
import PropTypes from 'prop-types';
import VideoPlayer from 'components/VideoPlayer';

function EventPreview(props) {
  const { event, coverPhoto } = props;

  let videoJsOptions = {
    autoplay: true,
    controls: true,
    aspectRatio: '16:9',
    sources: [event.preview]
  };

  if (event.preview) {
    return (
      <VideoPlayer
        data-test-id="event-preview-video"
        {...videoJsOptions}
        preview={true}
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
}

EventPreview.propTypes = {
  event: PropTypes.object.isRequired,
  coverPhoto: PropTypes.string
};

export default EventPreview;
