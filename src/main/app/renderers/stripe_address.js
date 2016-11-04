import {hasStates} from '../utils/CountryUtils';
import {renderFields} from './renderFields';
import {StateSelect} from '../components/_state-select/StateSelect';

export const createStripeAddressRenderer = ({component, validator}) => {
  validator.addSchema({
    street: ['required'],
    city: ['required'],
    zip: ['required'],
    country: ['required'],
    state(props) {
      if (hasStates(props.country)) {
        return ['required'];
      }
      return [];
    }
  });
  return function () {
    return renderFields('stripe_address', {
      state: {
        labelKey({country}) {
          switch (country) {
            case 'FR':
              return 'label.departement';
            case 'IE':
              return 'label.county';
            case 'US':
              return 'label.state';
            case 'BE':
            case 'CA':
            case 'ES':
            case 'IT':
            case 'NL':
              return 'label.province';
            default:
          }
        },
        input: StateSelect,
        isHidden({country}) {
          return !hasStates(country);
        },
        sharedAttributes: ['country']
      },
      city: {
        inputProps: {
          autoComplete: 'address-level2',
          autoCorrect: 'off'
        }
      },
      street: {
        placeholderKey({country}) {
          switch (country) {
            case 'FR':
              return 'placeholder.fr';
            case 'IE':
              return 'placeholder.ie';
            case 'IT':
              return 'placeholder.it';
            case 'ES':
              return 'placeholder.es';
            case 'BE':
            case 'DE':
            case 'LU':
              return 'placeholder.extra';
            default:
              return 'placeholder.rest';
          }
        },
        inputProps: {
          autoComplete: 'address-line1',
          autoCorrect: 'off'
        },
        sharedAttributes: ['country']
      },
      zip: {
        labelKey({country}) {
          switch (country) {
            case 'BE':
              return 'label.be';
            case 'CA':
              return 'label.ca';
            case 'ES':
              return 'label.es';
            case 'FR':
              return 'label.fr';
            case 'NL':
              return 'label.nl';
            case 'US':
              return 'label.us';
            default:
              return 'label.rest';
          }
        },
        placeholderKey({country}) {
          switch (country) {
            case 'BE':
              return 'label.be';
            case 'CA':
              return 'label.ca';
            case 'DE':
              return 'placeholder.de';
            case 'DK':
              return 'placeholder.dk';
            case 'ES':
              return 'label.es';
            case 'FI':
              return 'placeholder.fi';
            case 'FR':
              return 'label.fr';
            case 'IT':
              return 'placeholder.it';
            case 'NL':
              return 'label.nl';
            case 'NW':
              return 'placeholder.nw';
            case 'SE':
              return 'placeholder.se';
            case 'US':
              return 'label.us';
            default:
              return 'label.rest';
          }
        },
        inputProps: {
          noValidate: true,
          autoCorrect: 'off',
          autoComplete: 'postal-code'
        },
        sharedAttributes: ['country']
      }
    }, {component, validator});
  };
};



// WEBPACK FOOTER //
// ./src/main/app/renderers/stripe_address.js