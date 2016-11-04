import moment from 'moment';
import React from 'react';
import {CityShape, shapeCity} from './CityModel';
import {DateShape, shapeDate} from './DateModel';
import {LocationShape, shapeLocation} from './LocationModel';
import {ItemShape, shapeItem} from './ItemModel';
import {OfferShape, shapeOffer} from './OfferModel';
import {shapeUser, UserShape} from './UserModel';

const {arrayOf, bool, number, object, oneOf, oneOfType, shape, string} = React.PropTypes;

export function shapeGrab(grab) {
  if (grab) {
    let imageUrls = [];
    if (grab.get('item') && grab.get('item').get('images')) {
      imageUrls = (grab.get('item').get('images') || []).map(image => image.get('url'))
    }
    return {
      acceptedGrabber: shapeUser(grab.getAcceptedGrabber()),
      aggregateState: grab.get('aggregate_state'),
      allItemsPrice: grab.get('item_price_cents') / 100 * grab.get('quantity'),
      applicationFee: grab.get('application_fee_cents') / 100,
      comment: grab.get('comment'),
      consumer: grab.get('consumer') ? shapeUser(grab.get('consumer')) : {},
      conversationId: grab.get('conversation') ? grab.get('conversation').get('id') : null,
      createdDate: moment(grab.get('created')),
      description: grab.get('description'),
      dueDate: grab.get('due_date') ? moment(grab.get('due_date')) : null,
      from: shapeLocation(grab.get('from')),
      hasMyOffer: grab.get('has_my_offer'),
      id: grab.get('id'),
      imageUrl: ((grab.get('image') || {})._attributes || {}).url,
      imageUrls,
      isActive: grab.isActive(),
      isDelivered: grab.isDelivered(),
      isDraft: grab.isDraft(),
      isFinished: grab.isFinished(),
      isPending: grab.isPending(),
      item: grab.get('item') ? shapeItem(grab.get('item')) : null,
      itemPrice: grab.get('item_price_cents') / 100,
      itemPriceCurrency: 'USD',
      offerBids: (grab.get('offers_bid') || []).map(bid => bid / 100),
      offers: (grab.get('offers') || []).map(shapeOffer),
      offersCount: grab.get('offers_count'),
      paidIn: shapeDate(grab.get('paid_in')),
      quantity: grab.get('quantity'),
      reward: grab.get('reward_cents') / 100,
      rewardCurrency: grab.get('reward_currency'),
      title: grab.get('title'),
      to: grab.get('to') ? shapeCity(grab.get('to')) : null,
      total: grab.get('total_cents') / 100,
      type: grab.get('type')
    };
  }
}

export function isGrab({type}) {
  return type === 'grab' || type === 'grabs';
}

export const GrabShape = shape({
  acceptedGrabber: UserShape,
  aggregateState: oneOf(['active', 'draft', 'finished', 'pending']).isRequired,
  allItemsPrice: number,
  applicationFee: number,
  comment: string,
  consumer: UserShape,
  conversationId: oneOfType([number, string]),
  createdDate: object.isRequired,
  dueDate: object,
  from: LocationShape,
  hasMyOffer: bool,
  id: oneOfType([number, string]).isRequired,
  imageUrl: string,
  isActive: bool,
  isDelivered: bool,
  isDraft: bool,
  isFinished: bool,
  isPending: bool,
  item: ItemShape,
  itemPrice: number,
  itemPriceCurrency: string,
  offerBids: arrayOf(number),
  offers: arrayOf(OfferShape),
  offersCount: number,
  paidIn: DateShape,
  quantity: number,
  reward: number.isRequired,
  rewardCurrency: string.isRequired,
  title: string.isRequired,
  to: CityShape,
  total: number,
  type: oneOf(['grab', 'grabs']).isRequired
});

export const GRAB_STATE = {
  DELAYED: 'delayed',
  DELIVERED: 'delivered',
  DELIVERY_CONFIRMED: 'delivery_confirmed',
  DRAFT: 'draft',
  IN_TRANSFER: 'in_transfer',
  OFFER_ACCEPTED: 'offer_accepted',
  ON_HOLD: 'on_hold',
  PAID_IN: 'paid_in',
  PAID_OUT: 'paid_out',
  PUBLISHED: 'published'
};

export const GRAB_AGGREGATE_STATE = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  FINISHED: 'finished',
  PENDING: 'pending'
};



// WEBPACK FOOTER //
// ./src/main/app/models/GrabModel.js