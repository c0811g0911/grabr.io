import {Actions} from '../actions/Constants';
import {pushHistoryState} from './HistoryActionCreators';
import {get, post, patch} from '../utils/APIUtils';
import {changeState} from '../utils/stateMachines';
import _ from 'lodash';
import {handleError} from '../utils/handleError';
import {makeAuthorizedRequest} from '../utils/ActionUtils';
import {LocalStore} from '../stores/LocalStore';
import {AccountStore} from '../stores/AccountStore';
import {UserStore} from '../stores/DataStores';
import {AppStore} from '../stores/AppStore';

async function syncPhone(context, {number}) {
  context.dispatch(Actions.LOAD_ACCOUNT_START);
  try {
    const query = {
      user: {phone: {number}}
    };
    const {config: {apiRoot}} = context.getStore(AppStore).getState();
    const options = {
      authToken: context.getStore(LocalStore).get('AUTH_TOKEN'),
      version: 2,
      apiRoot
    };
    const {body: json} = await patch('/account/user', query, options);
    return context.dispatch(Actions.LOAD_ACCOUNT_SUCCESS, json);
  } catch (error) {
    handleError(error, context);
  }
}

function syncEmail(context, attributes, callback) {
  context.dispatch(Actions.LOAD_ACCOUNT_START);

  attributes = _.pickBy(attributes, (value, key) => {
    return ['address', 'newsletter'].indexOf(key) !== -1 && !_.isUndefined(value);
  });

  const user = context.getStore(AccountStore).getUser();

  if (!attributes.address) {
    attributes.address = user.get('email').address;
  }

  makeAuthorizedRequest('patch', '/account/email', {query: {email: attributes}, version: 2}, context)
    .then(res => {
      changeState({context, type: 'finish'});
      context.dispatch(Actions.UPDATE_ACCOUNT, {json: res.body});
      callback();
    }).catch(err => {
    handleError(err, context);
  });
}

export function loadAccount(context) {
  return makeAuthorizedRequest('get', '/account', {version: 2}, context).then(res => {
    const json = res.body.account;

    if (!json) {
      throw new Error('Unexpected server response');
    }

    context.dispatch(Actions.UPDATE_ACCOUNT, json);
    context.dispatch(Actions.LOAD_DATA_ITEM, {id: json.user.id, storeName: UserStore.storeName});
  });
}

export async function confirmEmail(context, {token}, done) {
  const {config: {apiRoot}} = context.getStore(AppStore).getState();

  get(`/email/confirmation?token=${ token }`, {}, {apiRoot}).then(res => done()).catch(() => {
    done({statusCode: 404, message: 'Not Found'});
  });
}

export function updateEmail(context, {address, newsletter}, done) {
  syncEmail(context, {address, newsletter}, () => {
    context.dispatch(Actions.SHOW_ALERT, {data: {custom: true, type: 'email_update_success'}});
    done();
  });
}

export function resendEmail(context) {
  makeAuthorizedRequest('post', '/account/email/resend', {version: 2}, context)
    .then(() => {
      context.dispatch(Actions.SHOW_ALERT, {data: {custom: true, type: 'email_resend_success'}});
    });
}

export async function resendSms(context, {}) {
  const user = context.getStore(AccountStore).getUser();
  const number = user.getPhone().number;

  try {
    await syncPhone(context, {number});
    return context.dispatch(Actions.SHOW_ALERT, {
      data: {
        custom: true,
        type: 'sms_resend_success'
      }
    });
  } catch (error) {
  }
}

export async function updatePhone(context, {number}) {
  return syncPhone(context, {number});
}

export async function confirmPhone(context, {code}) {
  context.dispatch(Actions.LOAD_ACCOUNT_START);
  try {
    const query = {
      phone: {code}
    };
    const {config: {apiRoot}} = context.getStore(AppStore).getState();
    const options = {
      authToken: context.getStore(LocalStore).get('AUTH_TOKEN'),
      version: 2,
      apiRoot
    };
    const {body: {phone}} = await post('/account/phone/confirmation', query, options);
    changeState({context, type: 'finish'});
    context.dispatch(Actions.SHOW_ALERT, {
      data: {
        custom: true,
        type: 'phone_success'
      }
    });
    return context.dispatch(Actions.LOAD_ACCOUNT_SUCCESS, {
      user: {
        id: context.getStore(AccountStore).getUser().get('id'),
        type: 'users',
        phone
      }
    });
  } catch (error) {
    if (error.message === 'Unprocessable Entity') {
      error = {errors: {code: ['mismatch']}};
    }
    handleError(error, context);
  }
}

export async function updateProfile(context, {attributes}, done) {
  const authToken = context.getStore(LocalStore).get('AUTH_TOKEN');
  const {config: {apiRoot}} = context.getStore(AppStore).getState();

  context.dispatch(Actions.LOAD_ACCOUNT_START);
  attributes.avatar_file_id = attributes.avatar.get('file_id');
  attributes = _.omit(attributes, 'avatar');

  patch(`/account/user`, {user: attributes}, {authToken, apiRoot, version: 2}).then(res => {
    context.executeAction(pushHistoryState, ['/settings']);
    context.dispatch(Actions.UPDATE_ACCOUNT, res.body);
    context.dispatch(Actions.SHOW_ALERT, {data: {custom: true, type: 'profile_success'}});
    done();
  }).catch(err => handleError(err, context));
}

export async function updateSSN(context, {ssn_last_4}, done) {
  const authToken = context.getStore(LocalStore).get('AUTH_TOKEN');
  const {config: {apiRoot}} = context.getStore(AppStore).getState();

  context.dispatch(Actions.LOAD_ACCOUNT_START);

  patch('/account/verification', {verification: {ssn_last_4}}, {authToken, apiRoot, version: 2}).then(res => {
    context.executeAction(pushHistoryState, ['/settings']);
    context.dispatch(Actions.UPDATE_ACCOUNT, {json: res.body});
    context.dispatch(Actions.SHOW_ALERT, {data: {custom: true, type: 'ssn_success'}});
    done();
  }).catch(err => handleError(err, context));
}



// WEBPACK FOOTER //
// ./src/main/app/actions/ProfileActionCreators.js