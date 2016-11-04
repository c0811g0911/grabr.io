import React from 'react';
import {DateShape, shapeDate} from './DateModel';
import {ImagesShape, shapeImages} from './ImageModel';
import {LocaleShape, shapeLocale} from './LocaleModel';
import {PartnerShape, shapePartner} from './PartnerModel';
import {LocationShape, shapeLocation} from './LocationModel';

const {arrayOf, number, oneOf, oneOfType, shape, string} = React.PropTypes;

export function shapeCollection(collection) {
  if (collection) {
    return {
      description: shapeLocale(collection.get('description')),
      id: collection.get('id'),
      images: shapeImages(collection.get('images')),
      items: {
        count: collection.get('items_count'),
        minPrice: {
          amount: collection.get('items_min_price_cents') / 100,
          currency: collection.get('items_min_price_currency')
        }
      },
      lead: shapeLocale(collection.get('lead')),
      partnership: {
        partner: shapePartner(collection.get('partner')),
        expiration: shapeDate(collection.get('partnership_expiration_date'))
      },
      title: shapeLocale(collection.get('title')),
      type: collection.get('type'),
      targetLocation: shapeLocation(collection.get('target_location'))
    };
  }
}

export function shapeCollectionList(collectionList) {
  return (collectionList || []).map(shapeCollection);
}

export function isCollection(any) {
  if (!any) {
    return false;
  }
  return any.type === 'collection' || any.type === 'collections';
}

export function isSameCollection($1, $2) {
  return isCollection($1) && isCollection($2) && $1.id === $2.id;
}

export const CollectionShape = shape({
  description: LocaleShape,
  id: oneOfType([number, string]).isRequired,
  images: ImagesShape.isRequired,
  items: shape({
    count: number,
    minPrice: shape({
      amount: number,
      currency: string
    })
  }),
  lead: LocaleShape,
  partnership: shape({
    partner: PartnerShape,
    expiration: DateShape
  }),
  title: LocaleShape.isRequired,
  type: oneOf(['collection', 'collections']).isRequired,
  targetLocation: LocationShape
});

export const CollectionListShape = arrayOf(CollectionShape);



// WEBPACK FOOTER //
// ./src/main/app/models/CollectionModel.js