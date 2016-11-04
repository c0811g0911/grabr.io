import {Actions} from '../actions/Constants';
import {createBankToken} from './PaymentActionCreators';
import {changeState} from '../utils/stateMachines';
import {handleError} from '../utils/handleError';
import {makeAuthorizedRequest, makePaginatedRequest} from '../utils/ActionUtils';
import _ from 'lodash';
import {PopularCities} from '../stores/SequenceStores';
import {CityStore} from '../stores/DataStores';
import URI from 'urijs';

async function createTraveler(context, attributes) {
  const endpoint = '/account/traveler';
  const options = {query: {traveler: attributes}, version: 2};

  try {
    const {body: json} = await makeAuthorizedRequest('patch', endpoint, options, context);
    context.dispatch(Actions.UPDATE_ACCOUNT, json);
    changeState({context, type: 'finish', redirectUrl: '/'});
    return context.dispatch(Actions.SHOW_ALERT, {data: {custom: true, type: 'traveler_success'}});
  } catch (err) {
    handleError(err, context, {
      customHandler: error => {
        if (!error.errors) {
          return;
        }
        const authorizationErrors = error.errors.authorization;

        if (authorizationErrors.indexOf('unconfirmed_email') !== -1) {
          changeState({type: 'email_open', context, copy: 'become_a_traveler'});
        }
      }
    });
  }
}

async function becomeStripeTraveler(context, attributes) {
  const token = await createBankToken(context, attributes);
  const {street, city, state, zip, country} = attributes;
  return createTraveler(context, {
    ..._.omit(attributes, [
      'account_number',
      'city',
      'confirm_account_number',
      'confirm_iban',
      'country',
      'iban',
      'institution_number',
      'routing_number',
      'state',
      'street',
      'transit_number',
      'zip'
    ]),
    address: {street, city, zip, state, country_alpha2: country},
    bank_account: {token},
    type: 'stripe_profiles'
  });
}

async function becomePaypalTraveler(context, attributes) {
  const {email, country} = attributes;
  return createTraveler(context, {email, address: {country}, type: 'paypal_profiles'});
}

export async function becomeTraveler(context, {attributes}) {
  context.dispatch(Actions.LOAD_ACCOUNT_START);
  if (attributes.type === 'paypal') {
    return becomePaypalTraveler(context, attributes);
  } else {
    return becomeStripeTraveler(context, attributes);
  }
}

export async function loadPopularCities(context, {count}) {
  return makePaginatedRequest(context, '/popular_cities', {
    version: 2, sequenceName: PopularCities.sequenceName,
    pageNumber: 0, pageSize: count
  });
}

export async function loadCity(context, {id}) {
  const endpoint = URI.expand('/locations{/id}', {id}).href();
  const options = {version: 2};
  const {body: {location}} = await makeAuthorizedRequest('get', endpoint, options, context);
  context.dispatch(Actions.LOAD_DATA_SUCCESS, {json: {city: location}});
  return context.dispatch(Actions.LOAD_DATA_ITEM, {id, storeName: CityStore.storeName});
}



// WEBPACK FOOTER //
// ./src/main/app/actions/TravelerActionCreators.js