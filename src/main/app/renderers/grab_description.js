import React from 'react';
import {ImageUpload} from '../components/_image-upload/ImageUpload';
import {Money} from '../components/_money/Money';
import {NumberInput} from '../components/_number-input/NumberInput';
import {TextareaInput, TextInput} from '../components/_field_2/Field_2';
import {renderFields} from './renderFields_2';

export const grabDescriptionSchema = {
  title: ['required', {'max_length': 70}],
  description: ['required', {'max_length': 1000}],
  estimate_price_cents: ['required', {'min_number': 500}, {'max_number': 500000}],
  shop_url: ['url'],
  images: ['required_array']
};

const formSchema = ({properties = [], locale}) => ({
  images: {
    input: ImageUpload,
    wrapInDiv: true,
    inputProps: {
      isMultiple: true,
      maxNumber: 10,
      v2: true
    }
  },
  title: {
    input: TextareaInput,
    inputProps: {
      className: 'small-input'
    }
  },
  description: {
    input: TextareaInput
  },
  estimate_price_cents: {
    input: Money,
    inputProps: {
      asInput: true
    }
  },
  quantity: {
    input: NumberInput,
    wrapInDiv: true,
    inputProps: {
      min: 1,
      max: 9
    }
  },
  ...properties.reduce((memo, value) => {
    const {key, label, placeholder} = value;
    memo[`_property_${ key }`] = {
      input: TextInput,
      label: label[locale],
      placeholder: placeholder[locale]
    };
    return memo;
  }, {})
});

export const renderDescription = (attributes, errors, {properties = [], locale = "en"} = {}) => {
  return renderFields('grab', formSchema({properties, locale}), {attributes, errors});
};



// WEBPACK FOOTER //
// ./src/main/app/renderers/grab_description.js