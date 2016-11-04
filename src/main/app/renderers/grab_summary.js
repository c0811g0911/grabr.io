import React from 'react';
import {TextareaInput} from '../components/_field_2/Field_2';
import {renderFields} from './renderFields_2';

export const grabSummarySchema = {
  comment: [{max_length: 140}]
};

const formSchema = {
  comment: {
    input: TextareaInput,
    showLabel: false
  }
};

export const renderSummary = (attributes, errors) => {
  return renderFields('grab', formSchema, {attributes, errors});
};



// WEBPACK FOOTER //
// ./src/main/app/renderers/grab_summary.js