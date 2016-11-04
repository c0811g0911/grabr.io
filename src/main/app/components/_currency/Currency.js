import React from 'react';
import _ from 'lodash';
import {connectToStores} from 'fluxible-addons-react';
import {AllCountriesStore} from '../../stores/SequenceStores';

export const Currency = connectToStores(class extends React.Component {
  static displayName = 'Currency';

  getCurrency() {
    const country = _.find(this.props.countries, country => country.get('id') === this.props.country);

    if (!country) {
      return null;
    }
    return country.get('currencies')[0];
  }

  render() {
    return <div>
      {this.getCurrency()}
    </div>;
  }
}, [AllCountriesStore], ({getStore}) => {
  return {
    countries: getStore(AllCountriesStore).get()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_currency/Currency.js