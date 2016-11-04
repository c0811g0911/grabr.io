import React from 'react';

const {arrayOf, oneOf, shape, string} = React.PropTypes;

export function shapeImage(image) {
  if (image) {
    return {
      fileId: image.get('file_id') || image.get('id'),
      id: image.get('id'),
      type: image.get('type'),
      url: image.get('url')
    };
  }
}

export function shapeImages(image) {
  return (image || []).map(shapeImage);
}

export const ImageShape = shape({
  fileId: string.isRequired,
  id: string.isRequired,
  type: oneOf(['image', 'images']).isRequired,
  url: string.isRequired
});

export const ImagesShape = arrayOf(ImageShape);



// WEBPACK FOOTER //
// ./src/main/app/models/ImageModel.js