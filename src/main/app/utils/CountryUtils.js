import React from 'react';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

export function isEurope(country) {
  return ['US', 'CA'].indexOf(country) === -1;
}

export function isUSA(country) {
  return country === 'US';
}

export function isCanada(country) {
  return country === 'CA';
}

export function isGB(country) {
  return country === 'GB';
}

export function hasStates(country) {
  return ['US', 'BE', 'CA', 'FR', 'IE', 'IT', 'NL', 'ES'].indexOf(country) > -1;
}

export function getCopy(country) {
  return <p>
    <FormattedMessage id="forms.stripe_bank.copy.rest" values={{routing: +!isEurope(country)}}/>
    <If condition={!isUSA(country)}>
      <FormattedHTMLMessage id="forms.stripe_bank.copy.non_usa"/>
    </If>
  </p>;
}



// WEBPACK FOOTER //
// ./src/main/app/utils/CountryUtils.js