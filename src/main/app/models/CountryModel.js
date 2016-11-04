import React from 'react';
import {shapeImage} from './ImageModel';
import {LocaleShape, shapeLocale} from './LocaleModel';

const {arrayOf, shape, string, number, oneOf} = React.PropTypes;

export function shapeCountry(country) {
  if (country) {
    return {
      grabsCount: country.get('grabs_count'),
      id: country.get('id'),
      alpha2: country.get('country_alpha2'),
      imageUrl: (shapeImage(country.get('image')) || {}).url,
      name: country.get('name'),
      offersCount: country.get('offers_count'),
      reward: country.get('total_delivery_reward_cents'),
      rewardCurrency: country.get('total_delivery_reward_currency'),
      translations: shapeLocale(country.get('translations'))
    };
  }
}

export function shapeCountryList(countryList) {
  return (countryList || []).map(shapeCountry).filter(isCountry);
}

export function isCountry(any) {
  if (!any) {
    return false;
  }
  return any.type === 'country' || any.type === 'countries';
}

export function isSameCountry($1, $2) {
  return isCountry($1) && isCountry($2) && $1.id === $2.id;
}

export const CountryShape = shape({
  alpha2: string,
  code: number,
  id: number.isRequired,
  translations: LocaleShape.isRequired,
  type: oneOf(['country', 'countries'])
});

export const CountryListShape = arrayOf(CountryShape);



// WEBPACK FOOTER //
// ./src/main/app/models/CountryModel.js