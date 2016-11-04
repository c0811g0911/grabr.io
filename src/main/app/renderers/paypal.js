import React from 'react';
import {renderFields} from './renderFields';
import {FormattedMessage} from 'react-intl';

const schema = {
  email: ['required', 'confirm']
};

const formSchema = {
  email: {
    type: 'email',
    inputProps: {
      autoCapitalize: 'off',
      autoCorrect: 'off',
      autoComplete: 'email'
    }
  },
  confirm_email: {
    type: 'email',
    inputProps: {
      autoCapitalize: 'off',
      autoCorrect: 'off',
      autoComplete: 'email'
    }
  }
};

export const createPaypalRenderer = ({component, validator}) => {
  validator.addSchema(schema);
  return function () {
    return [
      <h3 key={0} className="header-caps">
        <FormattedMessage id="forms.paypal.header"/>
      </h3>, <fieldset key={1}>
        {renderFields('paypal', formSchema, {component, validator})}
      </fieldset>
    ];
  };
};



// WEBPACK FOOTER //
// ./src/main/app/renderers/paypal.js