import React from 'react';
import {renderFields} from './renderFields';
import {DateSelect} from '../components/_date-select/DateSelect';

const schema = {
  first_name: ['required', {max_length: 256}],
  last_name: ['required', {max_length: 256}],
  birth_date: ['required', 'legal_age']
};

const formSchema = {
  first_name: {
    inputProps: {
      autoCorrect: 'off',
      autoComplete: 'name'
    }
  },
  last_name: {
    inputProps: {
      autoCorrect: 'off',
      autoComplete: 'name'
    }
  },
  birth_date: {
    input: DateSelect,
    wrapInDiv: true
  }
};

export const createStripePersonalRenderer = ({component, validator}) => {
  validator.addSchema(schema);

  return function () {
    return renderFields('stripe_personal', formSchema, {component, validator});
  };
};



// WEBPACK FOOTER //
// ./src/main/app/renderers/stripe_personal.js