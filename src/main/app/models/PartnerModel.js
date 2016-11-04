import React from 'react';
import {shapeImage} from './ImageModel';

const {number, oneOf, shape, string} = React.PropTypes;

export function shapePartner(partner) {
  if (partner) {
    return {
      id: partner.get('id'),
      image: shapeImage(partner.get('image')),
      links: partner.get('links'),
      partnerType: partner.get('partner_type'),
      type: partner.get('type')
    };
  }
}

export function isPartner({type}) {
  return type === 'partner' && type === 'partners';
}

export function isSamePartner($1, $2) {
  return isPartner($1) && isPartner($2) && $1.id === $2.id;
}

export const PartnerShape = shape({
  id: number,
  links: shape({
    facebook: string,
    site: string,
    twitter: string
  }).isRequired,
  partnerType: oneOf(['person', 'organization']).isRequired,
  type: oneOf(['partner', 'partners'])
});



// WEBPACK FOOTER //
// ./src/main/app/models/PartnerModel.js