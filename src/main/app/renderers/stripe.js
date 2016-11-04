import {createStripeAddressRenderer} from '../renderers/stripe_address';
import {createStripeBankRenderer} from '../renderers/stripe_bank';
import {createStripePersonalRenderer} from '../renderers/stripe_personal';
import {getCopy} from '../utils/CountryUtils';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import React from 'react';

export function createStripeRenderer({component, validator}) {
  return function () {
    return [
      <h3 key={0} className="header-caps">
        <FormattedMessage id="forms.stripe_bank.personal"/>
      </h3>,
      <fieldset key={1}>
        {createStripePersonalRenderer({component, validator})()}
      </fieldset>,
      <h3 key={2} className="header-caps">
        <FormattedMessage id="forms.stripe_bank.address"/>
      </h3>,
      <fieldset key={3}>
        {createStripeAddressRenderer({component, validator})()}
      </fieldset>,
      <h3 key={4} className="header-caps">
        <FormattedMessage id="forms.stripe_bank.payout"/>
      </h3>,
      getCopy(component.state.attributes.country),
      <fieldset key={5}>
        <If condition={component.state.errors.stripe}>
          <label className="grabr-input">
            <div className="grabr-error">
              {component.state.errors.stripe}
            </div>
          </label>
        </If>
        {createStripeBankRenderer({component, validator})()}
      </fieldset>,
      <label key={6} className="grabr-input grabr-input-agree">
        <FormattedHTMLMessage id="forms.stripe_bank.agree"/>
      </label>
    ];
  };
}



// WEBPACK FOOTER //
// ./src/main/app/renderers/stripe.js