import React from 'react';
const {number, oneOf, shape, string} = React.PropTypes;

export function shapePromotion(promotion) {
  if (promotion) {
    return {
      amount_cents: promotion.get('amount_cents'),
      amount_currency: promotion.get('amount_currency'),
      expires_at: promotion.get('expires_at'),
      id: promotion.get('id'),
      quantity: promotion.get('quantity'),
      token: promotion.get('token'),
      type: promotion.get('type'),
      usage_quota: promotion.get('usage_quota')
    };
  }
}

export function isPromotion({type}) {
  return type === 'promotion' || type === 'promotions';
}

export const PromotionShape = shape({
  amount_cents: number.isRequired,
  amount_currency: string.isRequired,
  expires_at: string.isRequired,
  id: number.isRequired,
  quantity: number.isRequired,
  token: string.isRequired,
  type: oneOf(['promotions']).isRequired,
  usage_quota: number.isRequired
});



// WEBPACK FOOTER //
// ./src/main/app/models/PromotionModel.js