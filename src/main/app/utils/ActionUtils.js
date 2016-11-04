import * as APIUtils from './APIUtils';
import {Actions} from '../actions/Constants';
import {getSequenceClass} from './StoreUtils';
import {AppStore} from '../stores/AppStore';
import {LocalStore} from '../stores/LocalStore';

export function getAuthToken(context) {
  return context.getStore(LocalStore).get('AUTH_TOKEN');
}

export function getFingerprint(context) {
  return context.getStore('LocalStore').get('fingerprint');
}

function getXForwardedFor(context) {
  return context.getStore(LocalStore).get('X-Forwarded-For');
}

export function setXForwardedFor(context, {value}) {
  return context.dispatch(Actions.SET_RECORD, {'X-Forwarded-For': value});
}

export async function makeAuthorizedRequest(method, endpoint, options = {}, context) {
  if (!APIUtils[method]) {
    throw new Error('Wrong APIUtils method');
  }

  const {config: {apiRoot}} = context.getStore(AppStore).getState();

  return APIUtils[method](endpoint, options.query, {
    ...options,
    authToken: getAuthToken(context),
    fingerprint: getFingerprint(context),
    lang: context.getStore(AppStore).getState().language,
    xForwardedFor: getXForwardedFor(context),
    apiRoot
  });
}

export async function makePaginatedRequest(context, endpoint, {
  pageSize, pageNumber, append, query = {}, sequenceName, done = () => {
}, version = 1, callback
}) {
  function getRange({pageSize, pageNumber, total}) {
    const begin = Math.max(0, pageSize * pageNumber);
    const end = Math.min(begin + pageSize - 1, total);
    return isFinite(begin) && isFinite(end) && 0 <= begin && begin < end ? `${ begin }-${ end }` : undefined;
  }

  const total = context.getStore(getSequenceClass(sequenceName)).getInfo('totalCount');
  const range = getRange({pageSize, pageNumber, total: append ? total : +Infinity});

  context.dispatch(Actions.SET_SEQUENCE_INFO, {
    sequenceName,
    data: {isSyncing: true}
  });

  try {
    const options = {query, range, version};
    const res = await makeAuthorizedRequest('get', endpoint, options, context);
    context.dispatch(Actions.LOAD_SEQUENCE_SUCCESS, {
      json: res.body,
      totalCount: +(res.headers['content-range'] || '').split('/')[1] || 0,
      append,
      sequenceName
    });
    if (callback) {
      callback(res);
    }
    if (done) {
      done(null, res.body);
    }
    return res;
  } catch (error) {
    if (done) {
      done(error);
    }
    throw error;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/utils/ActionUtils.js