import React from 'react';
import Gallery from 'react-grid-gallery';

export default function Images({ images }) {
  let photos = images.map((image) => {
    return {
      src: image.url,
      thumbnail: image.url,
      thumbnailWidth: image.width,
      thumbnailHeight: image.height,
      caption: image.name
    };
  });

  return <Gallery images={photos} />;
}
