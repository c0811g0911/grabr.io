import React from 'react';
import {renderFields} from './renderFields';

const schema = {
  email: ['required'],
  password: ['required', {'min_length': 8}]
};

const formSchema = {
  email: {
    inputProps: {
      type: 'email',
      autoCapitalize: 'off',
      autoCorrect: 'off',
      autoComplete: 'email'
    }
  },
  password: {
    inputProps: {
      type: 'password'
    }
  }
};

export const createLoginRenderer = ({component, validator}) => {
  validator.addSchema(schema);

  return () => {
    return renderFields('login', formSchema, {component, validator});
  };
};



// WEBPACK FOOTER //
// ./src/main/app/renderers/login.js