import React from 'react';
import moment from 'moment';

export function shapeCoupon(coupon) {
  if (coupon) {
    return {
      id: coupon.get('id'),
      description: coupon.get('description'),
      expirationDate: !!coupon.get('expiration_date') && moment(coupon.get('expiration_date')),
      value: coupon.get('value') / 100,
      unit: coupon.get('unit')
    };
  }
}

const {shape, object, string, number, instanceOf} = React.PropTypes;

export const CouponShape = shape({
  id: number.isRequired,
  description: string.isRequired,
  expirationDate: object,
  value: number.isRequired,
  unit: string.isRequired
});



// WEBPACK FOOTER //
// ./src/main/app/models/CouponModel.js