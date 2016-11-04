import React from 'react';
import {ImageUpload} from '../components/_image-upload/ImageUpload';
import {renderFields} from './renderFields';

const schema = {
  first_name: ['required', {max_length: 256}],
  last_name: ['required', {max_length: 256}],
  avatar: ['required']
};

const formSchema = userId => ({
  avatar: {
    input: ImageUpload,
    showLabel: false,
    inputProps: {
      parentType: 'users',
      parentId: userId,
      property: 'avatar'
    }
  },
  first_name: {},
  last_name: {}
});

export const createPersonalRenderer = ({component, validator, userId}) => {
  validator.addSchema(schema);
  return function () {
    return renderFields('personal', formSchema(userId), {component, validator});
  };
};



// WEBPACK FOOTER //
// ./src/main/app/renderers/personal.js