import moment from 'moment';
import React from 'react';
import {LocationShape, shapeLocation} from './LocationModel';
import {shapeUser, UserShape} from './UserModel';

const {number, object, shape, string} = React.PropTypes;

export function shapeOffer(offer) {
  return {
    applicationFee: offer.get('application_fee_cents') / 100,
    applicationFeeCurrency: 'USD',
    bid: offer.get('bid_cents') / 100,
    bidCurrency: 'USD',
    comment: offer.get('comment'),
    conversationId: offer.get('conversation') ? offer.get('conversation').get('id') : null,
    createdDate: moment(offer.get('created')),
    deliveryDate: moment(offer.get('delivery_date')),
    discount: offer.get('discount_cents') / 100,
    discountCurrency: 'USD',
    from: shapeLocation(offer.get('from')),
    grabber: offer.get('grabber') ? shapeUser(offer.get('grabber')) : {},
    id: offer.get('id'),
    itemsAndBid: offer.get('items_and_bid_cents') / 100,
    total: offer.get('total_cents') / 100,
    totalCurrency: 'USD',
    value: offer.get('items_and_bid_cents') / 100,
    valueCurrency: 'USD'
  };
}

export const OfferShape = shape({
  applicationFee: number,
  applicationFeeCurrency: string,
  bid: number.isRequired,
  bidCurrency: string.isRequired,
  comment: string,
  conversationId: number,
  createdDate: object.isRequired,
  deliveryDate: object.isRequired,
  discount: number,
  discountCurrency: string,
  from: LocationShape,
  grabber: UserShape.isRequired,
  id: number.isRequired,
  itemsAndBid: number,
  total: number,
  totalCurrency: string,
  value: number.isRequired,
  valueCurrency: string.isRequired
});



// WEBPACK FOOTER //
// ./src/main/app/models/OfferModel.js