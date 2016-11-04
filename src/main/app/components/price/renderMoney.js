import React from 'react';
import {FormattedMessage} from 'react-intl';

export const renderValue = value => {
  return value;
};

export const renderCurrency = currency => {
  return <FormattedMessage id="shared.usd"/>;
};

export const renderFull = (value, currency) => {
  return <FormattedMessage id="shared.usd_with_value" values={{value: renderValue(value)}}/>;
};



// WEBPACK FOOTER //
// ./src/main/app/components/price/renderMoney.js