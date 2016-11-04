import {CityInstance} from '../stores/DataStores';
import React from 'react';
import {CityShape, shapeCity} from './CityModel';
import {CountryShape, shapeCountry} from './CountryModel';

const {oneOfType} = React.PropTypes;

export function shapeLocation(location) {
  if (location) {
    if (location instanceof CityInstance) {
      return shapeCity(location);
    }
    return shapeCountry(location);
  }
  return null;
}

export const LocationShape = oneOfType([CityShape, CountryShape]);



// WEBPACK FOOTER //
// ./src/main/app/models/LocationModel.js