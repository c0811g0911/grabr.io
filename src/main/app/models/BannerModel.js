import React from 'react';
import {ImageShape, shapeImage} from './ImageModel';
import {LocaleShape, shapeLocale} from './LocaleModel';

const {number, oneOf, shape, string} = React.PropTypes;

export function shapeBanner(banner) {
  if (banner) {
    return {
      id: banner.get('id'),
      image: shapeImage(banner.get('image')),
      lead: shapeLocale(banner.get('lead')),
      redTitle: shapeLocale(banner.get('red_title')),
      smallTitle: shapeLocale(banner.get('small_title')),
      targetUrl: banner.get('target_url'),
      title: shapeLocale(banner.get('title')),
      type: banner.get('type')
    };
  }
}

export function isBanner(any) {
  if (!any) {
    return false;
  }
  return any.type === 'banner' || any.type === 'banners';
}

export function isSameBanner($1, $2) {
  return isBanner($1) && isBanner($2) && $1.id === $2.id;
}

export const BannerShape = shape({
  id: number.isRequired,
  image: ImageShape.isRequired,
  lead: LocaleShape.isRequired,
  redTitle: LocaleShape,
  smallTitle: LocaleShape.isRequired,
  targetUrl: string,
  title: LocaleShape.isRequired,
  type: oneOf(['banner', 'banners']).isRequired
});



// WEBPACK FOOTER //
// ./src/main/app/models/BannerModel.js