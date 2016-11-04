import React from 'react';
import {Currency} from '../components/_currency/Currency';
import {isUSA, isCanada, isGB} from '../utils/CountryUtils';
import {renderFields} from './renderFields';

const ibanPlaceholder = props => {
  return {
    'AT': 'AT61 1904 3002 3547 3201',
    'BE': 'BE12 3456 7891 2345',
    'DK': 'DK50 0040 0440 1162 43',
    'FI': 'FI21 1234 5600 0007 85',
    'FR': 'FR14 2004 1010 0505 0001 3M02 606',
    'DE': 'DE89 3704 0044 0532 0130 00',
    'IE': 'IE29 AIBK 9311 5212 3456 78',
    'IT': 'IT60 X054 2811 1010 0000 0123 456',
    'LU': 'LU28 0019 4006 4475 0000',
    'NL': 'NL91 ABNA 0417 1643 00',
    'NO': 'NO93 8601 1117 947',
    'ES': 'ES91 2100 0418 4502 0005 1332',
    'SE': 'SE45 5000 0000 0583 9825 7466',
    'GB': 'GB29 NWBK 6016 1331 9268 19'
  }[props.country];
};

const schema = {
  sort_code: ({country}) => {
    switch (true) {
      case isGB(country):
        return ['required'];
      default:
        return [];
    }
  },
  account_number: ({country}) => {
    switch (true) {
      case isGB(country):
      case isUSA(country):
      case isCanada(country):
        return ['required', 'confirm', 'stripe_account_number'];
      default:
        return [];
    }
  },
  routing_number: ({country}) => {
    switch (true) {
      case isUSA(country):
        return ['required', 'stripe_routing_number'];
      default:
        return [];
    }
  },
  transit_number: ({country}) => {
    switch (true) {
      case isCanada(country):
        return ['required'];
      default:
        return [];
    }
  },
  institution_number: ({country}) => {
    switch (true) {
      case isCanada(country):
        return ['required'];
      default:
        return [];
    }
  },
  iban: ({country}) => {
    switch (true) {
      case isGB(country):
      case isUSA(country):
      case isCanada(country):
        return [];
      default:
        return ['required', 'confirm', 'stripe_account_number'];
    }
  }
};

const formSchema = {
  currency: {
    input: Currency,
    sharedAttributes: ['country']
  },
  routing_number: {
    isHidden: ({country}) => {
      switch (true) {
        case isUSA(country):
          return false;
        default:
          return true;
      }
    },
    sharedAttributes: ['country']
  },
  transit_number: {
    isHidden: ({country}) => {
      switch (true) {
        case isCanada(country):
          return false;
        default:
          return true;
      }
    },
    sharedAttributes: ['country'],
    placeholder: '12345'
  },
  institution_number: {
    isHidden: ({country}) => {
      switch (true) {
        case isCanada(country):
          return false;
        default:
          return true;
      }
    },
    sharedAttributes: ['country'],
    placeholder: '000'
  },
  sort_code: {
    isHidden: ({country}) => {
      switch (true) {
        case isGB(country):
          return false;
        default:
          return true;
      }
    },
    sharedAttributes: ['country'],
    placeholder: '12-34-56'
  },
  account_number: {
    isHidden: ({country}) => {
      switch (true) {
        case isGB(country):
        case isUSA(country):
        case isCanada(country):
          return false;
        default:
          return true;
      }
    },
    sharedAttributes: ['country']
  },
  confirm_account_number: {
    isHidden: ({country}) => {
      switch (true) {
        case isGB(country):
        case isUSA(country):
        case isCanada(country):
          return false;
        default:
          return true;
      }
    },
    sharedAttributes: ['country']
  },
  iban: {
    isHidden: ({country}) => {
      switch (true) {
        case isGB(country):
        case isUSA(country):
        case isCanada(country):
          return true;
        default:
          return false;
      }
    },
    placeholder: ibanPlaceholder,
    sharedAttributes: ['country']
  },
  confirm_iban: {
    isHidden: ({country}) => {
      switch (true) {
        case isGB(country):
        case isUSA(country):
        case isCanada(country):
          return true;
        default:
          return false;
      }
    },
    placeholder: ibanPlaceholder,
    sharedAttributes: ['country']
  }
};

export const createStripeBankRenderer = ({component, validator}) => {
  validator.addSchema(schema);
  return function () {
    return renderFields('stripe_bank', formSchema, {component, validator});
  };
};



// WEBPACK FOOTER //
// ./src/main/app/renderers/stripe_bank.js