import React from 'react';
import {shapeImage} from './ImageModel';
import {CountryShape, shapeCountry} from './CountryModel';
import {LocaleShape, shapeLocale} from './LocaleModel';

const {arrayOf, number, oneOf, shape, string} = React.PropTypes;

export function shapeCity(city) {
  if (city) {
    return {
      country: shapeCountry(city.get('country')),
      grabsCount: city.get('grabs_count'),
      id: city.get('id'),
      imageUrl: (shapeImage(city.get('image')) || {}).url,
      offersCount: city.get('offers_count'),
      reward: city.get('total_delivery_reward_cents') / 100,
      rewardCurrency: city.get('total_delivery_reward_currency'),
      translations: shapeLocale(city.get('translations')),
      type: city.get('type')
    };
  }
}

export function shapeCityList(cityList) {
  return (cityList || []).map(shapeCity).filter(isCity);
}

export function isCity(any) {
  if (!any) {
    return false;
  }
  return any.type === 'city' || any.type === 'cities';
}

export function isSameCity($1, $2) {
  return isCity($1) && isCity($2) && $1.id === $2.id;
}

export const CityShape = shape({
  country: CountryShape,
  grabsCount: number,
  id: number.isRequired,
  imageUrl: string,
  offersCount: number,
  reward: number,
  rewardCurrency: string,
  translations: LocaleShape.isRequired,
  type: oneOf(['city', 'cities']).isRequired
});

export const CityListShape = arrayOf(CityShape);



// WEBPACK FOOTER //
// ./src/main/app/models/CityModel.js