import {pushHistoryState} from './HistoryActionCreators';
import {Actions} from '../actions/Constants';
import {patch} from '../utils/APIUtils';
import {isUSA, isCanada, isGB} from '../utils/CountryUtils';
import {handleError} from '../utils/handleError';
import {makeAuthorizedRequest} from '../utils/ActionUtils';
import _ from 'lodash';
import {LocalStore} from '../stores/LocalStore';
import {changeState} from '../utils/stateMachines';
import {AppStore} from '../stores/AppStore';

async function updateTraveler(context, attributes, done) {
  makeAuthorizedRequest('patch', '/account/traveler', {query: {traveler: attributes}, version: 2}, context)
    .then(res => {
      context.executeAction(pushHistoryState, ['/settings']);
      context.dispatch(Actions.UPDATE_ACCOUNT, res.body);
      context.dispatch(Actions.SHOW_ALERT, {data: {custom: true, type: 'bank_success'}});
      done();
    }).catch(err => handleError(err, context));
}

export async function createBankToken(context, {
  currency, country, account_number, routing_number,
  iban, transit_number, institution_number, sort_code
}) {
  context.dispatch(Actions.LOAD_ACCOUNT_START);
  const attributes = (() => {
    switch (true) {
      case isUSA(country):
        return {
          currency,
          country,
          account_number,
          routing_number
        };
      case isCanada(country):
        return {
          currency,
          country,
          account_number,
          routing_number: `${ transit_number }-${ institution_number }`
        };
      case isGB(country):
        return {
          currency,
          country,
          account_number,
          routing_number: sort_code.replace(/-/g, '')
        };
      default:
        return {
          currency,
          country,
          account_number: iban.toUpperCase().replace(/\s/g, '')
        };
    }
  })();
  return new Promise(resolve => {
    Stripe.bankAccount.createToken(attributes, (statusCode, {error, id}) => {
      if (error) {
        handleError({errors: {stripe: error.message}}, context);
      } else {
        resolve(id);
      }
    });
  });
}

export async function updateCard(context, {attributes, onSuccess}, done) {
  const authToken = context.getStore(LocalStore).get('AUTH_TOKEN');
  console.log(attributes);
  const {number, cvc, expiry_month: exp_month, expiry_year: exp_year, address_country, address_zip, name} = attributes;

  context.dispatch(Actions.LOAD_ACCOUNT_START);

  Stripe.card.createToken({
    number,
    cvc,
    exp_month,
    exp_year,
    address_zip,
    address_country,
    name
  }, (statusCode, res) => {
    if (res.error) {
      const error = {
        errors: {
          stripe: [res.error.code]
        }
      };

      handleError(error, context);
    } else {
      const {config: {apiRoot}} = context.getStore(AppStore).getState();
      patch('/account/consumer', {consumer: {credit_card: {token: res.id}}}, {authToken, apiRoot, version: 2}).then(res => {
        context.dispatch(Actions.UPDATE_ACCOUNT, res.body);
        changeState({context, type: 'payment_finish'});
        if (onSuccess) {
          onSuccess();
        }
        done();
      }).catch(err => handleError(err, context, {
        // fixme: KILL IT WITH FIRE!!!
        notify: err => {
          if (!err.errors.stripe) {
            const stripe = err.errors['credit_card.stripe_card_error'];
            if (stripe) {
              err.errors.stripe = stripe;
            }
          }
          delete err.errors['credit_card.stripe_card_error'];
        }
      }));
    }
  });
}

export async function updateBankAccount(context, {attributes, type, country}, done) {
  context.dispatch(Actions.LOAD_ACCOUNT_START);

  if (type === 'stripe') {
    const token = await createBankToken(context, attributes);
    attributes = _.omit(attributes, [
      'account_number',
      'routing_number',
      'iban',
      'transit_number',
      'institution_number'
    ]);
    attributes.bank_account = {token};

    const {street, city, state, zip, country} = attributes;
    attributes.address = {street, city, zip, state, country_alpha2: country};
    attributes = _.omit(attributes, ['street', 'city', 'zip', 'state', 'country']);

    updateTraveler(context, attributes, done);
  } else if (type === 'paypal') {
    updateTraveler(context, _.pick(attributes, 'email'), done);
  }
}



// WEBPACK FOOTER //
// ./src/main/app/actions/PaymentActionCreators.js