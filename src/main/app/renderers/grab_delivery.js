import React from 'react';
import {GrabFormFrom, GrabFormTo} from '../components/_cities-suggest/CitiesSuggest';
import {DateTimeInput} from '../components/_date-time-input/DateTimeInput';
import {ToggledInput} from '../components/_toggled-input/ToggledInput';
import {Reward} from '../components/_reward/Reward';
import {renderFields} from './renderFields_2';
import moment from 'moment';

export const grabDeliverySchema = {
  to: ['required'],
  due_date: ['future', {deadline: 30}],
  reward_cents: ['required', {min_number: 500}, {max_number: 300000}]
};

const formSchema = {
  to: {
    input: GrabFormTo,
    inputProps: {
      value: {
        func: ({to}) => to && to.value,
        isFunc: true
      },
      query: {
        func: ({to}) => to && to.query,
        isFunc: true
      }
    }
  },
  from: {
    input: GrabFormFrom,
    isHidden: attributes => !attributes.to,
    inputProps: {
      value: {
        func: ({from}) => from && from.value,
        isFunc: true
      },
      query: {
        func: ({from}) => from && from.query,
        isFunc: true
      }
    }
  },
  due_date: {
    input: ToggledInput,
    wrapInDiv: true,
    showLabel: false,
    inputProps: {
      input: DateTimeInput,
      minDate: moment().add(1, 'days'),
      maxDate: moment().add(29, 'days'),
      defaultValue: moment().add(19, 'days').format('YYYY-MM-DD')
    }
  },
  reward_cents: {
    input: Reward,
    wrapInDiv: true,
    description: true,
    inputProps: {
      asInput: true,
      price: {
        func: ({estimate_price_cents, quantity}) => estimate_price_cents * quantity,
        isFunc: true
      }
    }
  }
};

export const renderDelivery = (attributes, errors) => {
  return renderFields('grab', formSchema, {attributes, errors});
};



// WEBPACK FOOTER //
// ./src/main/app/renderers/grab_delivery.js