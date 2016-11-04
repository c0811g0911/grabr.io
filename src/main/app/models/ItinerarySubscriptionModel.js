import React from 'react';
import {shapeLocation, LocationShape} from './LocationModel';
import {shapeCity, CityShape} from './CityModel';

export function shapeItinerarySubscription(subscription) {
  if (subscription) {
    return {
      id: subscription.get('id'),
      from: shapeLocation(subscription.get('from')),
      to: shapeCity(subscription.get('to'))
    };
  }
}

const {shape, number} = React.PropTypes;

export const ItinerarySubscriptionShape = shape({
  id: number.isRequired,
  from: LocationShape,
  to: CityShape.isRequired
});



// WEBPACK FOOTER //
// ./src/main/app/models/ItinerarySubscriptionModel.js