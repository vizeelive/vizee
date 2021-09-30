import React from 'react';
import PropTypes from 'prop-types';

function EventPreview(props) {
  const { event, coverPhoto } = props;

  if (event.preview) {
    return (
      <video
        data-test-id="event-preview-video"
        playsInline
        src={event.preview}
        width="100%"
        autoPlay
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
}

EventPreview.propTypes = {
  event: PropTypes.object.isRequired,
  coverPhoto: PropTypes.string
};

export default EventPreview;
